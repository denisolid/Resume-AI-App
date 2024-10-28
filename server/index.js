import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs/promises";
import { createServer as createViteServer } from "vite";

import authRoutes from "./routes/auth.js";
import resumeRoutes from "./routes/resume.js";
import coverLetterRoutes from "./routes/coverLetter.js";

// Load environment variables
dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simplified CORS setup
app.use(cors());

// Create uploads directory
const uploadsDir = join(__dirname, "uploads");
try {
  await fs.access(uploadsDir);
} catch {
  await fs.mkdir(uploadsDir, { recursive: true });
}

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/cover-letter", coverLetterRoutes);

// Vite integration for development
if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });

  app.use(vite.middlewares);
} else {
  // Serve static files in production
  const distPath = join(__dirname, "../dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(join(distPath, "index.html"));
  });
}

// Error handling
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    error: err.message || "An error occurred",
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
