import express from 'express';
import {
  getCourses,
  getCourseBySlugOrId,
  createCourse,
  updateCourse,
  deleteCourse,
  addModule,
  addLesson,
  updateModule,
  deleteModule,
  reorderModules,
  updateLesson,
  deleteLesson,
  reorderLessons,
  uploadVideo,
} from '../controllers/courseController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getCourses);
router.get('/:idOrSlug', getCourseBySlugOrId);

// Admin Routes
router.post('/', protect, authorize('admin'), upload.single('thumbnail'), createCourse);
router.post('/upload-video', protect, authorize('admin'), upload.single('video'), uploadVideo);
router.put('/:id', protect, authorize('admin'), upload.single('thumbnail'), updateCourse);
router.delete('/:id', protect, authorize('admin'), deleteCourse);

router.post('/:id/modules', protect, authorize('admin'), addModule);
router.put('/:id/modules/reorder', protect, authorize('admin'), reorderModules);
router.put('/modules/:moduleId', protect, authorize('admin'), updateModule);
router.delete('/modules/:moduleId', protect, authorize('admin'), deleteModule);

router.post('/modules/:moduleId/lessons', protect, authorize('admin'), addLesson);
router.put('/modules/:moduleId/lessons/reorder', protect, authorize('admin'), reorderLessons);
router.put('/lessons/:lessonId', protect, authorize('admin'), updateLesson);
router.delete('/lessons/:lessonId', protect, authorize('admin'), deleteLesson);

export default router;
