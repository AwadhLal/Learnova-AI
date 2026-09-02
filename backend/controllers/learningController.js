import Progress from '../models/Progress.js';
import Lesson from '../models/Lesson.js';
import Note from '../models/Note.js';
import Bookmark from '../models/Bookmark.js';
import Certificate from '../models/Certificate.js';
import Achievement from '../models/Achievement.js';
import Course from '../models/Course.js';
import crypto from 'crypto';

// @desc Get Course Progress for Student Player
// @route GET /api/learning/progress/:courseId
export const getCourseProgress = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    let progress = await Progress.findOne({ user: userId, course: courseId });
    if (!progress) {
      progress = await Progress.create({
        user: userId,
        course: courseId,
        completedLessons: [],
        percentage: 0,
      });
    }

    const notes = await Note.find({ user: userId, course: courseId }).sort({ createdAt: -1 });
    const bookmarks = await Bookmark.find({ user: userId, course: courseId });

    res.json({
      success: true,
      progress,
      notes,
      bookmarks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Mark Lesson Complete
// @route POST /api/learning/complete-lesson
export const markLessonComplete = async (req, res, next) => {
  try {
    const { courseId, lessonId } = req.body;
    const userId = req.user._id;

    let progress = await Progress.findOne({ user: userId, course: courseId });
    if (!progress) {
      progress = new Progress({ user: userId, course: courseId, completedLessons: [] });
    }

    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
    }
    progress.lastAccessedLesson = lessonId;

    // Calculate percentage
    const totalLessons = await Lesson.countDocuments({ course: courseId });
    if (totalLessons > 0) {
      progress.percentage = Math.round((progress.completedLessons.length / totalLessons) * 100);
    } else {
      progress.percentage = 100;
    }

    await progress.save();

    // Check if course completed 100% -> generate certificate if not existing
    let certificate = null;
    if (progress.percentage >= 100) {
      certificate = await Certificate.findOne({ user: userId, course: courseId });
      if (!certificate) {
        const certCode = 'LN-' + crypto.randomBytes(4).toString('hex').toUpperCase();
        certificate = await Certificate.create({
          user: userId,
          course: courseId,
          certificateCode: certCode,
        });

        // Grant Achievement
        await Achievement.create({
          user: userId,
          title: 'Course Master',
          description: 'Completed 100% of a course on Learnova AI!',
          icon: 'Award',
        });
      }
    }

    res.json({
      success: true,
      progress,
      certificate,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Save Note
// @route POST /api/learning/notes
export const saveNote = async (req, res, next) => {
  try {
    const { courseId, lessonId, content } = req.body;
    const userId = req.user._id;

    const note = await Note.create({
      user: userId,
      course: courseId,
      lesson: lessonId,
      content,
    });

    res.status(201).json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

// @desc Get Notes for Course
// @route GET /api/learning/notes/:courseId
export const getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ user: req.user._id, course: req.params.courseId })
      .populate('lesson', 'title')
      .sort({ createdAt: -1 });

    res.json({ success: true, notes });
  } catch (error) {
    next(error);
  }
};

// @desc Toggle Bookmark
// @route POST /api/learning/bookmarks/toggle
export const toggleBookmark = async (req, res, next) => {
  try {
    const { courseId, lessonId } = req.body;
    const userId = req.user._id;

    const existing = await Bookmark.findOne({ user: userId, lesson: lessonId });
    if (existing) {
      await Bookmark.findByIdAndDelete(existing._id);
      return res.json({ success: true, isBookmarked: false, message: 'Bookmark removed' });
    } else {
      const bookmark = await Bookmark.create({ user: userId, course: courseId, lesson: lessonId });
      return res.json({ success: true, isBookmarked: true, bookmark, message: 'Lesson bookmarked' });
    }
  } catch (error) {
    next(error);
  }
};
