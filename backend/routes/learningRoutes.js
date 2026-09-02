import express from 'express';
import {
  getCourseProgress,
  markLessonComplete,
  saveNote,
  getNotes,
  toggleBookmark,
} from '../controllers/learningController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/progress/:courseId', protect, getCourseProgress);
router.post('/complete-lesson', protect, markLessonComplete);
router.post('/notes', protect, saveNote);
router.get('/notes/:courseId', protect, getNotes);
router.post('/bookmarks/toggle', protect, toggleBookmark);

export default router;
