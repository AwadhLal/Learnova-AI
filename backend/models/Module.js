import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
    default: 1,
  },
  description: {
    type: String,
    default: '',
  },
}, { timestamps: true });

export default mongoose.model('Module', moduleSchema);
