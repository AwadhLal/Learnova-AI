import express from 'express';
import { getQuizById, submitQuizAttempt, getUserQuizAttempts } from '../controllers/quizController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/my-attempts', protect, getUserQuizAttempts);
router.get('/:id', protect, getQuizById);
router.post('/:id/submit', protect, submitQuizAttempt);

export default router;
