import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// --- CONFIGURATION ---
const PYTHON_API_URL = 'http://localhost:8000'; // Your Python server URL
const PORT = process.env.PORT || 3001;

// Groq API Configuration (FREE & FAST)
// Get your free API key at: https://console.groq.com/keys
const GROQ_API_KEY = process.env.GROQ_API_KEY || 'YOUR_GROQ_API_KEY_HERE';
const GROQ_MODEL = 'llama-3.3-70b-versatile'; // Fast, high quality model (replacement for mixtral)
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads folder exists for multer's temporary storage
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}_${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

const app = express();
app.use(cors());
app.use(express.json());

// ==============================
// HEALTH CHECK
// ==============================
app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Node.js backend is running' });
});

// ==============================
// UPLOAD ENDPOINT (NOW CALLS PYTHON)
// ==============================
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Create a form and append the file stream from the path where multer saved it
    const form = new FormData();
    form.append('file', fs.createReadStream(req.file.path), req.file.originalname);

    // Forward the file to the Python RAG server's /process/ endpoint
    const response = await axios.post(`${PYTHON_API_URL}/process/`, form, {
      headers: {
        ...form.getHeaders(),
      },
    });

    // IMPORTANT: Clean up the temporary file saved by multer
    fs.unlinkSync(req.file.path);

    // Return the successful response from the Python server to the frontend
    return res.json(response.data);

  } catch (err) {
    console.error("Upload processing error:", err.response ? err.response.data : err.message);
    // Clean up file on error as well
    if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: "processing_failed", detail: err.response ? err.response.data : err.message });
  }
});

// ==============================
// HELPER: Call Groq API (OpenAI-compatible)
// ==============================
async function callGroq(prompt, maxTokens = 500) {
  try {
    const response = await axios.post(GROQ_API_URL, {
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: 'You are a legal document simplifier. Your job is to explain complex legal and privacy terms in plain English. Format your output as bullet points (using • or -). Each bullet point should be a complete, explanatory sentence - NOT single words or fragments. Include ALL information from the original document. Never add commentary like "Here is the simplified version". Just output the bullet points.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: maxTokens,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 second timeout (Groq is fast)
    });

    return response.data.choices[0]?.message?.content?.trim() || '';
  } catch (err) {
    console.error('Groq API error:', err.response?.data || err.message);
    throw err;
  }
}

// ==============================
// HELPER: Summarize a single chunk (for Map phase)
// ==============================
async function summarizeChunk(chunkText, index) {
  const prompt = `Explain this legal/privacy text as clear bullet points. Each bullet should be a complete sentence that explains what it means in plain English. Cover ALL information:\n\n"${chunkText}"`;

  try {
    const summary = await callGroq(prompt, 250);
    return { index, summary: summary || chunkText.substring(0, 200) + '...' };
  } catch (err) {
    console.error(`Error summarizing chunk ${index}:`, err.message);
    return { index, summary: chunkText.substring(0, 200) + '...' }; // Fallback to truncated original
  }
}

// ==============================
// QUERY ENDPOINT (SMART: FAST PATH FOR SHORT TEXT, MAP-REDUCE FOR LONG)
// ==============================
app.post('/api/query', async (req, res) => {
  try {
    const { collection_id, question, top_k = 3 } = req.body;

    if (!collection_id) return res.status(400).json({ error: 'collection_id missing' });
    if (!question) return res.status(400).json({ error: 'question missing' });

    // 1. Retrieve relevant chunks from the Python RAG server
    const retrieveResponse = await axios.post(`${PYTHON_API_URL}/retrieve/`, {
      collection_id,
      question,
      top_k,
    });

    const sources = retrieveResponse.data.sources;
    const combinedText = sources.map(s => s.text_snippet).join('\n\n');

    // Set headers for streaming response
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // FAST PATH: If text is short, skip Map-Reduce and call LLM directly
    const FAST_PATH_THRESHOLD = 2000; // characters
    
    let prompt;
    if (combinedText.length < FAST_PATH_THRESHOLD) {
      // Direct simplification - single LLM call
      res.write(`data: ${JSON.stringify({ status: 'Simplifying text...' })}\n\n`);
      
      prompt = `Explain this privacy policy in plain English using bullet points. Each bullet should be a complete sentence that clearly describes what the policy means for the user. Cover ALL information - do not skip anything:\n\n"${combinedText}"`;
    } else {
      // MAP-REDUCE for longer text
      res.write(`data: ${JSON.stringify({ status: 'Summarizing chunks in parallel...' })}\n\n`);

      // MAP PHASE: Summarize each chunk in parallel
      const chunkTexts = sources.map(s => s.text_snippet);
      const summaryPromises = chunkTexts.map((text, index) => summarizeChunk(text, index));
      const summaryResults = await Promise.all(summaryPromises);

      // Sort by index to maintain order
      summaryResults.sort((a, b) => a.index - b.index);
      const summaries = summaryResults.map(r => r.summary);

      res.write(`data: ${JSON.stringify({ status: 'Generating final summary...' })}\n\n`);

      // REDUCE PHASE: Combine summaries
      const combinedSummaries = summaries.join('\n');
      prompt = `Combine these bullet points into a well-organized summary. Group related points together. Each bullet should be a complete, clear sentence explaining what the policy means. Remove duplicates but keep ALL unique information:\n\n${combinedSummaries}`;
    }

    // Call Groq API
    res.write(`data: ${JSON.stringify({ status: 'Generating response...' })}\n\n`);
    
    const simplifiedText = await callGroq(prompt, 1500);
    
    // Send the result as tokens (simulating streaming for smooth UI)
    const words = simplifiedText.split(' ');
    for (let i = 0; i < words.length; i++) {
      const token = (i === 0 ? '' : ' ') + words[i];
      res.write(`data: ${JSON.stringify({ token })}\n\n`);
    }
    
    // Send done signal
    res.write(`data: ${JSON.stringify({ done: true, sources })}\n\n`);
    res.end();

  } catch (err) {
    console.error("Query error:", err.response ? err.response.data : err.message);
    // Check if headers have already been sent
    if (!res.headersSent) {
      res.status(500).json({ error: "query_failed", detail: err.response ? err.response.data : err.message });
    } else {
      res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
      res.end();
    }
  }
});

// ==============================
// GET ORIGINAL TEXT ENDPOINT
// ==============================
app.get('/api/original-text/:collection_id', async (req, res) => {
  try {
    const { collection_id } = req.params;
    if (!collection_id) {
      return res.status(400).json({ error: 'collection_id is required' });
    }

    // Forward the request to the Python server's new endpoint
    const response = await axios.get(`${PYTHON_API_URL}/get-text/${collection_id}`);

    // Return the successful response from the Python server to the frontend
    return res.json(response.data);

  } catch (err) {
    console.error("Error fetching original text:", err.response ? err.response.data : err.message);
    res.status(500).json({ error: "original_text_failed", detail: err.response ? err.response.data : err.message });
  }
});

// ==============================
// SERVER START
// ==============================
app.listen(PORT, () => {
  console.log(`Backend running (connected to Python) → http://localhost:${PORT}`);
});