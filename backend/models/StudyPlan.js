import mongoose from 'mongoose';

const studyPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  goal: {
    type: String,
    required: true,
  },
  examDate: {
    type: Date,
  },
  availableHoursPerDay: {
    type: Number,
    default: 2,
  },
  skillLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner',
  },
  schedule: [{
    day: Number,
    date: String,
    title: String,
    tasks: [{
      time: String,
      task: String,
      type: { type: String, enum: ['theory', 'practice', 'revision', 'mock'] },
      completed: { type: Boolean, default: false },
    }],
  }],
}, { timestamps: true });

export default mongoose.model('StudyPlan', studyPlanSchema);
