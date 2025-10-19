// Import dependencies
import fs from "fs";
import { execSync } from "child_process";
import { PDFParse } from 'pdf-parse';

export const analyzePDF = async (req, res) => {
  try {
    // 🧩 Check if file exists (multer adds req.file)
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Read PDF content into buffer
    const fileBuffer = req.file.buffer;

    // Extract text from PDF
    const data = await PDFParse(fileBuffer);
    const text = data.text?.trim() || "";

    // Safety check: empty PDFs
    if (!text) {
      return res.status(400).json({ error: "Could not extract text from PDF" });
    }

    // 🧠 Create a meaningful prompt for Mistral
    const prompt = `Simplify the following privacy policy or legal document and highlight risky clauses or unclear terms:\n\n${text}`;

    // ⚙️ Run the local Mistral model using Ollama CLI
    // escape quotes properly
    const safePrompt = prompt.replace(/"/g, '\\"');
    const command = `ollama run mistral "${safePrompt}"`;

    // Execute and capture the model output
    const result = execSync(command, { encoding: "utf-8" });

    // Send both versions to frontend
    res.json({
      originalText: text,
      simplifiedText: result,
    });

  } catch (error) {
    console.error("❌ Error analyzing PDF:", error);
    res.status(500).json({
      error: "Failed to process document",
      details: error.message,
    });
  }
};
