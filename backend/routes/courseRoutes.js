import express from 'express';
import {
  getCourses,
  getCourseBySlugOrId,
  createCourse,
  updateCourse,
  deleteCourse,
  addModule,
  addLesson,
} from '../controllers/courseController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getCourses);
router.get('/:idOrSlug', getCourseBySlugOrId);

// Admin Routes
router.post('/', protect, authorize('admin'), upload.single('thumbnail'), createCourse);
router.put('/:id', protect, authorize('admin'), upload.single('thumbnail'), updateCourse);
router.delete('/:id', protect, authorize('admin'), deleteCourse);

router.post('/:id/modules', protect, authorize('admin'), addModule);
router.post('/modules/:moduleId/lessons', protect, authorize('admin'), addLesson);

export default router;
