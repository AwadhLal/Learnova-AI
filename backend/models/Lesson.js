import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['video', 'text', 'pdf'],
    default: 'video',
  },
  content: {
    type: String,
    default: '',
  },
  videoUrl: {
    type: String,
    default: '',
  },
  durationMinutes: {
    type: Number,
    default: 10,
  },
  order: {
    type: Number,
    required: true,
    default: 1,
  },
  resources: [{
    title: String,
    url: String,
  }],
}, { timestamps: true });

export default mongoose.model('Lesson', lessonSchema);
