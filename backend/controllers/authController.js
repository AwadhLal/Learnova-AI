import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { sendEmail, getWelcomeEmailTemplate, getVerificationEmailTemplate, getPasswordResetEmailTemplate, getPasswordResetConfirmationTemplate } from '../services/emailService.js';
import { uploadToCloudinary } from '../services/cloudinaryService.js';
import crypto from 'crypto';

// @desc Register user
// @route POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    let user = await User.findOne({ email });
    
    if (user) {
      if (user.isVerified) {
        return res.status(400).json({ success: false, message: 'Email is already registered' });
      } else {
        // Update existing unverified user
        user.name = name;
        user.password = password;
      }
    } else {
      user = new User({
        name,
        email,
        password,
        role: 'student',
        isVerified: false
      });
    }

    if (user.lastVerificationCodeSentAt && Date.now() - user.lastVerificationCodeSentAt < 60000) {
      return res.status(400).json({ success: false, message: 'Please wait 60 seconds before requesting a new code' });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = code;
    user.verificationCodeExpires = Date.now() + 5 * 60 * 1000;
    user.verificationAttempts = 0;
    user.lastVerificationCodeSentAt = Date.now();
    await user.save();

    await sendEmail({
      to: user.email,
      subject: 'Learnova AI - Verification Code',
      html: getVerificationEmailTemplate(user.name, code),
    });

    res.status(200).json({
      success: true,
      message: 'Verification code sent to email',
      isUnverified: true
    });
  } catch (error) {
    next(error);
  }
};

// @desc Verify Email
// @route POST /api/auth/verify-email
export const verifyEmail = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ success: false, message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ success: false, message: 'Email is already verified' });
    
    if (user.verificationAttempts >= 5) {
      return res.status(400).json({ success: false, message: 'Too many incorrect attempts. Please request a new code.' });
    }

    if (!user.verificationCode || user.verificationCode !== code || user.verificationCodeExpires < Date.now()) {
      user.verificationAttempts += 1;
      await user.save();
      return res.status(400).json({ success: false, message: 'Invalid or expired verification code' });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    user.verificationAttempts = 0;
    await user.save();

    const token = generateToken(user._id);

    sendEmail({
      to: user.email,
      subject: 'Welcome to Learnova AI! 🚀',
      html: getWelcomeEmailTemplate(user.name),
    }).catch(err => console.error('Welcome email error:', err.message));

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        streak: user.streak,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Resend Verification Email
// @route POST /api/auth/resend-verification
export const resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ success: false, message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ success: false, message: 'Email is already verified' });
    
    if (user.lastVerificationCodeSentAt && Date.now() - user.lastVerificationCodeSentAt < 60000) {
      return res.status(400).json({ success: false, message: 'Please wait 60 seconds before requesting a new code' });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = code;
    user.verificationCodeExpires = Date.now() + 5 * 60 * 1000;
    user.verificationAttempts = 0;
    user.lastVerificationCodeSentAt = Date.now();
    await user.save();

    await sendEmail({
      to: user.email,
      subject: 'Learnova AI - Verification Code',
      html: getVerificationEmailTemplate(user.name, code),
    });

    res.json({ success: true, message: 'Verification code resent' });
  } catch (error) {
    next(error);
  }
};

// @desc Login user
// @route POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ success: false, isUnverified: true, message: 'Please verify your email before logging in.' });
    }

    // Update streak / last login date
    const now = new Date();
    const lastLogin = new Date(user.lastLoginDate);
    const diffHours = Math.abs(now - lastLogin) / 36e5;
    if (diffHours >= 24 && diffHours <= 48) {
      user.streak += 1;
    }
    user.lastLoginDate = now;
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        streak: user.streak,
        bio: user.bio,
        skills: user.skills,
        learningGoals: user.learningGoals,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Admin Login
// @route POST /api/auth/admin-login
export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied: Admin credentials required' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get current logged-in user
// @route GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update user profile
// @route PUT /api/auth/profile
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { name, bio, skills, learningGoals } = req.body;

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (skills) user.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    if (learningGoals) user.learningGoals = Array.isArray(learningGoals) ? learningGoals : learningGoals.split(',').map(g => g.trim());

    if (req.file) {
      const avatarUrl = await uploadToCloudinary(req.file.buffer, 'avatars');
      user.avatar = avatarUrl;
    }

    await user.save();

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Forgot password
// @route POST /api/auth/forgot-password
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'No user found with that email' });
    }

    if (user.lastResetCodeSentAt && Date.now() - user.lastResetCodeSentAt < 60000) {
      return res.status(400).json({ success: false, message: 'Please wait 60 seconds before requesting a new code' });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordCode = code;
    user.resetPasswordCodeExpires = Date.now() + 5 * 60 * 1000;
    user.resetPasswordAttempts = 0;
    user.lastResetCodeSentAt = Date.now();

    await user.save();

    await sendEmail({
      to: user.email,
      subject: 'Learnova AI - Password Reset Code',
      html: getPasswordResetEmailTemplate(user.name, code),
    });

    res.json({ success: true, message: 'Password reset code sent to email' });
  } catch (error) {
    next(error);
  }
};

// @desc Verify Reset Code
// @route POST /api/auth/verify-reset-code
export const verifyResetCode = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ success: false, message: 'User not found' });
    
    if (user.resetPasswordAttempts >= 5) {
      return res.status(400).json({ success: false, message: 'Too many incorrect attempts. Please request a new code.' });
    }

    if (!user.resetPasswordCode || user.resetPasswordCode !== code || user.resetPasswordCodeExpires < Date.now()) {
      user.resetPasswordAttempts += 1;
      await user.save();
      return res.status(400).json({ success: false, message: 'Invalid or expired reset code' });
    }

    res.json({ success: true, message: 'Code verified successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc Reset password
// @route POST /api/auth/reset-password
export const resetPassword = async (req, res, next) => {
  try {
    const { email, code, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ success: false, message: 'User not found' });

    if (user.resetPasswordAttempts >= 5) {
      return res.status(400).json({ success: false, message: 'Too many incorrect attempts. Please request a new code.' });
    }

    if (!user.resetPasswordCode || user.resetPasswordCode !== code || user.resetPasswordCodeExpires < Date.now()) {
      user.resetPasswordAttempts += 1;
      await user.save();
      return res.status(400).json({ success: false, message: 'Invalid or expired reset code' });
    }

    user.password = password;
    user.resetPasswordCode = undefined;
    user.resetPasswordCodeExpires = undefined;
    user.resetPasswordAttempts = 0;
    
    // Auto verify if they reset password
    if (!user.isVerified) {
      user.isVerified = true;
    }

    await user.save();

    await sendEmail({
      to: user.email,
      subject: 'Learnova AI - Password Updated',
      html: getPasswordResetConfirmationTemplate(user.name),
    });

    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    next(error);
  }
};
