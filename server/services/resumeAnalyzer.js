import { OpenAI } from 'openai';
import pdf from 'pdf-parse';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function extractTextFromPDF(filePath) {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

export async function analyzeResume(filePath, fileType) {
  try {
    let content = '';
    
    // Extract text from file
    if (fileType === 'application/pdf') {
      content = await extractTextFromPDF(filePath);
    } else if (fileType === 'text/plain') {
      content = await fs.readFile(filePath, 'utf-8');
    } else {
      throw new Error('Unsupported file type');
    }

    // Initial analysis for structure and content
    const structureAnalysis = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert resume analyzer. Analyze the resume structure and content, providing specific improvements."
        },
        {
          role: "user",
          content: `Analyze this resume and provide structured feedback:\n\n${content}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    // Generate suggestions
    const suggestions = [
      {
        type: 'improvement',
        text: structureAnalysis.choices[0].message.content
      }
    ];

    // Clean up the file after analysis
    try {
      await fs.unlink(filePath);
    } catch (unlinkError) {
      console.error('Error deleting file:', unlinkError);
    }

    return {
      suggestions,
      parsedContent: content,
      analysis: structureAnalysis.choices[0].message.content
    };

  } catch (error) {
    console.error('Resume analysis error:', error);
    
    // Clean up the file if it exists
    try {
      await fs.unlink(filePath);
    } catch (unlinkError) {
      console.error('Error deleting file:', unlinkError);
    }
    
    throw new Error(error.message || 'Failed to analyze resume');
  }
}

export async function generateCoverLetter(resumeContent, jobTitle, company) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert cover letter writer with deep knowledge of effective job application strategies."
        },
        {
          role: "user",
          content: `Write a compelling cover letter for a ${jobTitle} position at ${company}. Use relevant information from this resume:\n\n${resumeContent}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Cover letter generation error:', error);
    throw new Error('Failed to generate cover letter');
  }
}