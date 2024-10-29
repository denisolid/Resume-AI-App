import React, { useState } from "react";
import { Upload, FileText, AlertCircle, Loader } from "lucide-react";
import { resume } from "../services/api";

interface ResumeUploaderProps {
  onAnalysisComplete: (data: any) => void;
}

const ResumeUploader: React.FC<ResumeUploaderProps> = ({
  onAnalysisComplete,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (file: File) => {
    setError(null);
    const allowedTypes = ["application/pdf", "text/plain"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      setError("Only PDF and TXT files are allowed");
      return;
    }

    if (file.size > maxSize) {
      setError("File size must be less than 5MB");
      return;
    }

    setFile(file);
    setProgress(0);
  };

  const handleAnalyze = async () => {
    if (!file) return;

    try {
      setIsAnalyzing(true);
      setError(null);
      setProgress(0);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 500);

      const result = await resume.analyze(file);

      clearInterval(progressInterval);
      setProgress(100);

      if (result.error) {
        throw new Error(result.error);
      }

      onAnalysisComplete(result);
    } catch (error: any) {
      setError(error.message || "Error analyzing resume");
      setProgress(0);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">Upload Your Resume</h2>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging ? "border-indigo-600 bg-indigo-50" : "border-gray-300"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!file ? (
          <>
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">Drag and drop your resume here</p>
            <p className="text-gray-500 text-sm mb-2">
              PDF or TXT files only, max 5MB
            </p>
            <p className="text-gray-500 text-sm mb-4">or</p>
            <label className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 transition">
              <FileText className="mr-2 h-5 w-5" />
              Browse Files
              <input
                type="file"
                className="hidden"
                accept=".pdf,.txt"
                onChange={handleFileInput}
              />
            </label>
          </>
        ) : (
          <div className="text-center">
            <FileText className="mx-auto h-12 w-12 text-indigo-600 mb-4" />
            <p className="text-gray-900 font-medium">{file.name}</p>
            <button
              className="mt-4 text-indigo-600 hover:text-indigo-800"
              onClick={() => setFile(null)}
            >
              Remove file
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 rounded-lg flex items-center space-x-2 text-red-700">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {isAnalyzing && (
        <div className="mt-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-center text-sm text-gray-600">
            <Loader className="animate-spin h-4 w-4 mr-2" />
            Analyzing your resume...
          </div>
        </div>
      )}

      {file && !isAnalyzing && (
        <button
          className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg transition hover:bg-indigo-700"
          onClick={handleAnalyze}
        >
          Analyze Resume
        </button>
      )}
    </div>
  );
};

export default ResumeUploader;
