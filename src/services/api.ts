import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api', // No need for full URL since we're on the same origin
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Improved error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMessage = error.response?.data?.error || 'An error occurred';
    throw new Error(errorMessage);
  }
);

export const auth = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (name: string, email: string, password: string) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }
};

export const resume = {
  analyze: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await api.post('/resume/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response;
    } catch (error) {
      console.error('Resume analysis error:', error);
      throw error;
    }
  }
};

export const coverLetter = {
  generate: async (resumeContent: string, jobTitle: string, company: string) => {
    try {
      const response = await api.post('/cover-letter/generate', {
        resumeContent,
        jobTitle,
        company
      });
      return response;
    } catch (error) {
      console.error('Cover letter generation error:', error);
      throw error;
    }
  }
};

export default api;