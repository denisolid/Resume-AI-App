import React, { useState } from 'react';
import { FileText, Upload, FileCheck, Send, Crown } from 'lucide-react';
import { useAuth } from './components/AuthContext';
import AuthModal from './components/AuthModal';
import ResumeUploader from './components/ResumeUploader';
import ResumeEditor from './components/ResumeEditor';
import CoverLetterGenerator from './components/CoverLetterGenerator';
import PricingPlans from './components/PricingPlans';

interface AnalysisResult {
  suggestions: Array<{
    type: 'improvement' | 'warning' | 'success';
    text: string;
  }>;
  parsedContent: string;
  analysis: string;
}

function App() {
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">ResumeAI</span>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-gray-600">Welcome, {user.name}</span>
                  <button
                    onClick={logout}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Transform Your Resume with AI
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your resume and let our AI optimize it for your dream job. Get instant feedback,
            suggestions, and tailored cover letters.
          </p>
        </div>

        {user ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <ResumeUploader onAnalysisComplete={handleAnalysisComplete} />
              <ResumeEditor 
                content={analysisResult?.parsedContent}
                suggestions={analysisResult?.suggestions}
                analysis={analysisResult?.analysis}
              />
            </div>
            <CoverLetterGenerator />
          </>
        ) : (
          <div className="text-center mb-16">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition text-lg"
            >
              Sign In to Get Started
            </button>
          </div>
        )}

        <PricingPlans />
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">ResumeAI</h3>
              <p className="text-gray-400">
                Empowering job seekers with AI-powered resume optimization and cover letter generation.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Home</li>
                <li>Pricing</li>
                <li>About</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-400">
                support@resumeai.com<br />
                1-800-RESUME-AI
              </p>
            </div>
          </div>
        </div>
      </footer>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}

export default App;