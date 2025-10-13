import axios from "axios";

export const analyzePolicy = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "No text provided" });
    }

    const prompt = `
    You are a privacy policy analyzer.
    Summarize the following policy in plain language.
    Highlight risky clauses (data sharing, tracking, third-party access).
    Give a privacy risk score from 1 (safe) to 10 (risky).
    Return the output as structured JSON:
    {
      "summary": "...",
      "risky_clauses": ["..."],
      "risk_score": "..."
    }

    Policy:
    ${text}
    `;

    // 🔹 Mistral (local Ollama) call
    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "mistral",
        prompt: prompt,
      }
    );

    // Ollama streams responses line by line — handle accordingly
    const resultText = response.data.response || response.data; 

    res.json({ result: resultText });
  } catch (error) {
    console.error("Error analyzing policy:", error.message);
    res.status(500).json({ error: "Failed to analyze policy" });
  }
};
