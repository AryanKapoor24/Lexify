import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';

// --- CONFIGURATION ---
const PYTHON_API_URL = 'http://localhost:8000'; // Your Python server URL
const PORT = process.env.PORT || 3001;

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
// QUERY ENDPOINT (NOW CALLS PYTHON FOR RETRIEVAL)
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

    // 2. Build a prompt for the LLM
    const context = sources.map(s => s.text_snippet).join('\n\n---\n\n');
    const prompt = `Based on the following context, please answer the question.

Context:
${context}

Question: ${question}

Answer:`;

     // 3. Call the local Mistral model via Ollama
    const ollamaResponse = await axios.post('http://localhost:11434/api/generate', {
      model: "mistral",
      prompt: prompt,
      stream: false // We want the full response at once
    });

    const llmAnswer = ollamaResponse.data.response;


    // 4. Return the final answer and the REAL sources to the frontend
    return res.json({ answer: llmAnswer, sources });

  } catch (err) {
    console.error("Query error:", err.response ? err.response.data : err.message);
    res.status(500).json({ error: "query_failed", detail: err.response ? err.response.data : err.message });
  }
});

// ==============================
// SERVER START
// ==============================
app.listen(PORT, () => {
  console.log(`Backend running (connected to Python) → http://localhost:${PORT}`);
});