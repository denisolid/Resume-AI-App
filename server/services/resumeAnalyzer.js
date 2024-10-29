import { OpenAI } from "openai";
import pdf from "pdf-parse";
import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set in environment variables");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function extractTextFromPDF(filePath) {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.error("PDF extraction error:", error);
    throw new Error("Failed to extract text from PDF");
  }
}

export async function analyzeResume(filePath, fileType) {
  try {
    let content = "";

    // Extract text from file
    if (fileType === "application/pdf") {
      content = await extractTextFromPDF(filePath);
    } else if (fileType === "text/plain") {
      content = await fs.readFile(filePath, "utf-8");
    } else {
      throw new Error("Unsupported file type");
    }

    // Initial analysis for structure and content
    const structureAnalysis = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an expert resume analyzer. Analyze the resume structure and content. Necessarily provide the word 'improvement', 'warning' or 'success' for each point of analysis",
        },
        {
          role: "user",
          content: `Analyze this resume and provide structured feedback:\n\n${content}. At the end of each comment, classify it into one of three categories (improvement, warning, success).`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Initial data analysis for content
    const dataAnalysis = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an expert resume analyzer and very professional HR. Analyze the resume content.",
        },
        {
          role: "user",
          content: `Analyze this resume and provide structured feedback:\n\n${content}.  1) Calculate the probability in percentage that person will be hired in bold. 2)Keyword Identification: Identify keywords that match the job posting and industry, and identify which words should be added or improved.
3) ATS Optimization: Tips to improve your resume for Applicant Tracking Systems (ATS) to increase your chances of getting through.4)Recommendations for training and development. 5)Provide 1-10 scale mark in bold, according to your resume analysis.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });
    const analysisText = structureAnalysis.choices[0].message.content;

    // Generate suggestions
    const suggestions = [];
    const lines = analysisText.split("\n");
    for (const line of lines) {
      if (line.toLowerCase().includes("improve")) {
        suggestions.push({
          type: "improvement",
          text: line,
        });
      } else if (line.toLowerCase().includes("warning")) {
        suggestions.push({
          type: "warning",
          text: line,
        });
      } else if (line.toLowerCase().includes("success")) {
        suggestions.push({
          type: "success",
          text: line,
        });
      }
    }

    // Clean up the file after analysis
    try {
      await fs.unlink(filePath);
    } catch (unlinkError) {
      console.error("Error deleting file:", unlinkError);
    }

    return {
      suggestions,
      parsedContent: content,
      analysis: dataAnalysis.choices[0].message.content,
    };
  } catch (error) {
    console.error("Resume analysis error:", error);

    // Clean up the file if it exists
    try {
      await fs.unlink(filePath);
    } catch (unlinkError) {
      console.error("Error deleting file:", unlinkError);
    }

    throw new Error(error.message || "Failed to analyze resume");
  }
}

export async function generateCoverLetter(resumeContent, jobTitle, company) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an expert cover letter writer with deep knowledge of effective job application strategies.",
        },
        {
          role: "user",
          content: `Write a compelling cover letter for a ${jobTitle} position at ${company}. Use relevant information from this resume:\n\n${resumeContent}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Cover letter generation error:", error);
    throw new Error("Failed to generate cover letter");
  }
}
