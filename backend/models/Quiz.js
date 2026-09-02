import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  },
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
  },
  title: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    default: 'General',
  },
  description: {
    type: String,
    default: '',
  },
  timeLimitMinutes: {
    type: Number,
    default: 15,
  },
  passingScore: {
    type: Number,
    default: 70,
  },
  isAIGenerated: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

export default mongoose.model('Quiz', quizSchema);
