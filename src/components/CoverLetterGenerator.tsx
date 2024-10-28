import React, { useState } from 'react';
import { Send, Copy } from 'lucide-react';
import { coverLetter } from '../services/api';

const CoverLetterGenerator = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!jobTitle || !company) return;

    try {
      setIsGenerating(true);
      const { coverLetter: letter } = await coverLetter.generate(
        'Resume content here', // You'll need to pass the actual resume content
        jobTitle,
        company
      );
      setGeneratedLetter(letter);
    } catch (error) {
      console.error('Error generating cover letter:', error);
      // Handle error appropriately
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-16">
      <h2 className="text-2xl font-semibold mb-4">Cover Letter Generator</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Title
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Software Engineer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g. Tech Corp"
          />
        </div>
      </div>
      <button
        className={`w-full bg-indigo-600 text-white py-2 rounded-lg transition flex items-center justify-center space-x-2 mb-6 ${
          isGenerating ? 'opacity-75 cursor-not-allowed' : 'hover:bg-indigo-700'
        }`}
        onClick={handleGenerate}
        disabled={isGenerating}
      >
        <Send className="h-5 w-5" />
        <span>{isGenerating ? 'Generating...' : 'Generate Cover Letter'}</span>
      </button>
      {generatedLetter && (
        <div className="relative">
          <textarea
            className="w-full h-64 p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={generatedLetter}
            readOnly
          />
          <button
            className="absolute top-4 right-4 p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            onClick={() => navigator.clipboard.writeText(generatedLetter)}
          >
            <Copy className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CoverLetterGenerator;