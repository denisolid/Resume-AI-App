import React, { useEffect, useState } from "react";
import { Edit2, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";

interface Suggestion {
  type: "improvement" | "warning" | "success";
  text: string;
}

interface ResumeEditorProps {
  content?: string;
  suggestions?: Suggestion[];
  analysis?: string;
}

const ResumeEditor: React.FC<ResumeEditorProps> = ({
  content = "",
  suggestions = [],
  analysis = "",
}) => {
  const [editedContent, setEditedContent] = useState(content);

  useEffect(() => {
    setEditedContent(content);
  }, [content]);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">Resume Editor</h2>

      <div className="mb-6">
        <textarea
          className="w-full h-64 p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Your resume content will appear here..."
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
        />
      </div>

      {suggestions.length > 0 && (
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-medium">AI Suggestions</h3>
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg flex items-start space-x-3 ${
                suggestion.type === "improvement"
                  ? "bg-blue-50"
                  : suggestion.type === "warning"
                  ? "bg-yellow-50"
                  : "bg-green-50"
              }`}
            >
              {suggestion.type === "improvement" ? (
                <Edit2 className="h-5 w-5 text-blue-600" />
              ) : suggestion.type === "warning" ? (
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-600" />
              )}
              <p
                className={`${
                  suggestion.type === "improvement"
                    ? "text-blue-700"
                    : suggestion.type === "warning"
                    ? "text-yellow-700"
                    : "text-green-700"
                }`}
              >
                {suggestion.text}
              </p>
            </div>
          ))}
        </div>
      )}

      {analysis && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">Detailed Analysis</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 whitespace-pre-wrap">{analysis}</p>
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-end space-x-4">
        <button
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center space-x-2"
          onClick={() => setEditedContent(content)}
        >
          <RefreshCw className="h-4 w-4" />
          <span>Reset Changes</span>
        </button>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ResumeEditor;
