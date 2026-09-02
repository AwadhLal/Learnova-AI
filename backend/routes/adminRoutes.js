import express from 'express';
import {
  getDashboardStats,
  getAllStudents,
  toggleStudentStatus,
  getAllPayments,
  createAnnouncement,
  getAnnouncements,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/students', getAllStudents);
router.put('/students/:id/status', toggleStudentStatus);
router.get('/payments', getAllPayments);
router.post('/announcements', createAnnouncement);
router.get('/announcements', getAnnouncements);

export default router;
