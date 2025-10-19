// ...existing code...
import express from "express";
import multer from "multer";
import { analyzePDF } from "../controllers/aicontrol.js";

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Use multer as middleware then forward to controller.
// This makes multer errors go to Express error handlers automatically.
router.post(
  "/upload",
  upload.single("file"),
  (req, res, next) => {
    // debug helpful info
    console.log("Upload request content-type:", req.headers["content-type"]);
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded. Make sure the form field name is "file".' });
    }
    return analyzePDF(req, res, next);
  }
);

// alias
router.post("/analyze", upload.single("file"), (req, res, next) => {
  console.log("Upload request content-type:", req.headers["content-type"]);
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded. Make sure the form field name is "file".' });
  }
  return analyzePDF(req, res, next);
});

// Multer error handler for clearer JSON responses
router.use((err, _req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

export default router;
// ...existing code...