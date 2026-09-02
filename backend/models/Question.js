import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true,
  },
  questionText: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['MCQ', 'True/False', 'Short Answer', 'Coding/Conceptual'],
    default: 'MCQ',
  },
  options: [{
    type: String,
  }],
  correctAnswerIndex: {
    type: Number,
    required: true,
    default: 0,
  },
  correctAnswerText: {
    type: String,
    default: '',
  },
  explanation: {
    type: String,
    default: '',
  },
  topic: {
    type: String,
    default: '',
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium',
  },
}, { timestamps: true });

export default mongoose.model('Question', questionSchema);
