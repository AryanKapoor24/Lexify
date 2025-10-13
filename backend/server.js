import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import analyzeRoute from "./routes/analyzeRoute.js";

dotenv.config();
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Main route
app.use("/api", analyzeRoute);

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
