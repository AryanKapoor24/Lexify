import express from "express";
import { analyzePolicy } from "../controllers/aiController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Privacy Policy Analyzer API is working 🚀");
});

// POST route: /api/analyze
router.post("/analyze", analyzePolicy);

export default router;
