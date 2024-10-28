import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalContent: {
    type: String,
    required: true
  },
  parsedContent: {
    type: Object,
    required: true
  },
  suggestions: [{
    type: {
      type: String,
      enum: ['improvement', 'warning', 'success'],
      required: true
    },
    text: {
      type: String,
      required: true
    }
  }],
  fileName: String,
  fileType: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;