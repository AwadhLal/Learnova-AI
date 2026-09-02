import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    required: true,
  },
  learningObjectives: [{
    type: String,
  }],
  requirements: [{
    type: String,
  }],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
    default: 'Beginner',
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  originalPrice: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['Draft', 'Published', 'Archived'],
    default: 'Published',
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
  thumbnail: {
    type: String,
    default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
  },
  rating: {
    type: Number,
    default: 4.8,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  enrolledStudentsCount: {
    type: Number,
    default: 0,
  },
  tags: [{
    type: String,
  }],
}, { timestamps: true });

courseSchema.index({ title: 'text', description: 'text', tags: 'text' });

export default mongoose.model('Course', courseSchema);
