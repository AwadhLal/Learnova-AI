import express from 'express';
import { addReview, getCourseReviews } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/course/:courseId', getCourseReviews);
router.post('/', protect, addReview);

export default router;
