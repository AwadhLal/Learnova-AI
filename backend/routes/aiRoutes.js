import express from 'express';
import {
  askTutorController,
  generateQuizController,
  generateStudyPlanController,
  getMyStudyPlan,
  summarizeLessonController,
  getRecommendationsController,
  adminGenerateContentController,
  healthCheckAIController,
} from '../controllers/aiController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/health-check', healthCheckAIController);
router.post('/tutor', protect, askTutorController);
router.post('/generate-quiz', protect, generateQuizController);
router.post('/study-plan', protect, generateStudyPlanController);
router.get('/study-plan/my', protect, getMyStudyPlan);
router.post('/summarize', protect, summarizeLessonController);
router.get('/recommendations', protect, getRecommendationsController);

// Admin AI Tool
router.post('/admin-generate', protect, authorize('admin'), adminGenerateContentController);

export default router;
