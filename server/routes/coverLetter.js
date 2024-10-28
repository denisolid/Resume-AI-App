import express from 'express';
import { generateCoverLetter } from '../services/resumeAnalyzer.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/generate', auth, async (req, res) => {
  try {
    const { resumeContent, jobTitle, company } = req.body;
    
    if (!resumeContent || !jobTitle || !company) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const coverLetter = await generateCoverLetter(resumeContent, jobTitle, company);
    res.json({ coverLetter });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate cover letter' });
  }
});

export default router;