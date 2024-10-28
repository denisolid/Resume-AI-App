import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { analyzeResume } from '../services/resumeAnalyzer.js';
import Resume from '../models/Resume.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    try {
      await fs.access(uploadsDir);
    } catch {
      await fs.mkdir(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'text/plain'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and TXT files are allowed.'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

router.post('/analyze', auth, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const result = await analyzeResume(req.file.path, req.file.mimetype);

    // Save analysis to database
    const resume = new Resume({
      userId: req.user._id,
      originalContent: result.parsedContent,
      parsedContent: result.parsedContent,
      suggestions: result.suggestions,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      analysis: result.analysis
    });

    await resume.save();

    res.json(result);
  } catch (error) {
    console.error('Resume analysis error:', error);
    res.status(500).json({ 
      error: error.message || 'Resume analysis failed',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

export default router;