import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student',
  },
  avatar: {
    type: String,
    default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  },
  bio: {
    type: String,
    default: '',
  },
  skills: [{
    type: String,
  }],
  learningGoals: [{
    type: String,
  }],
  streak: {
    type: Number,
    default: 1,
  },
  lastLoginDate: {
    type: Date,
    default: Date.now,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationCode: String,
  verificationCodeExpires: Date,
  verificationAttempts: { type: Number, default: 0 },
  lastVerificationCodeSentAt: Date,
  resetPasswordCode: String,
  resetPasswordCodeExpires: Date,
  resetPasswordAttempts: { type: Number, default: 0 },
  lastResetCodeSentAt: Date,
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, {
  timestamps: true,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
