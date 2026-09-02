import User from '../models/User.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Payment from '../models/Payment.js';
import QuizAttempt from '../models/QuizAttempt.js';
import Announcement from '../models/Announcement.js';

// @desc Get Admin Dashboard Statistics & Chart Data (100% Real MongoDB Data)
// @route GET /api/admin/dashboard
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();

    // Total Revenue
    const successfulPayments = await Payment.find({ status: 'successful' });
    const totalRevenue = successfulPayments.reduce((acc, p) => acc + (p.amount || 0), 0);

    // Active Students (logged in last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const activeStudents = await User.countDocuments({ role: 'student', lastLoginDate: { $gte: thirtyDaysAgo } });

    // Real Quiz Stats
    const quizAttempts = await QuizAttempt.find();
    const avgScore = quizAttempts.length > 0
      ? Math.round(quizAttempts.reduce((acc, a) => acc + (a.score || 0), 0) / quizAttempts.length)
      : 0;

    // Real Course Completion Rate
    const completedEnrollments = await Enrollment.countDocuments({ status: 'completed' });
    const completionRate = totalEnrollments > 0 ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0;

    // Dynamic Monthly User Growth from MongoDB
    const userGrowthAgg = await User.aggregate([
      { $match: { role: 'student' } },
      {
        $group: {
          _id: { $dateToString: { format: '%b', date: '$createdAt' } },
          students: { $sum: 1 }
        }
      }
    ]);

    // Dynamic Monthly Revenue Growth from MongoDB
    const revenueGrowthAgg = await Payment.aggregate([
      { $match: { status: 'successful' } },
      {
        $group: {
          _id: { $dateToString: { format: '%b', date: '$createdAt' } },
          revenue: { $sum: '$amount' }
        }
      }
    ]);

    const userGrowth = userGrowthAgg.length > 0
      ? userGrowthAgg.map(item => ({ month: item._id, students: item.students }))
      : [{ month: 'Current', students: totalStudents }];

    const revenueGrowth = revenueGrowthAgg.length > 0
      ? revenueGrowthAgg.map(item => ({ month: item._id, revenue: item.revenue }))
      : [{ month: 'Current', revenue: totalRevenue }];

    res.json({
      success: true,
      stats: {
        totalStudents,
        totalCourses,
        totalEnrollments,
        totalRevenue,
        activeStudents,
        completionRate,
        avgScore,
      },
      charts: {
        userGrowth,
        revenueGrowth,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get All Students (Admin)
// @route GET /api/admin/students
export const getAllStudents = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const query = { role: 'student' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const students = await User.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
    const total = await User.countDocuments(query);

    const studentsWithStats = await Promise.all(
      students.map(async (st) => {
        const enrollmentsCount = await Enrollment.countDocuments({ user: st._id });
        const quizCount = await QuizAttempt.countDocuments({ user: st._id });
        return {
          ...st.toObject(),
          enrollmentsCount,
          quizCount,
        };
      })
    );

    res.json({
      success: true,
      students: studentsWithStats,
      total,
      pages: Math.ceil(total / Number(limit)) || 1,
      currentPage: Number(page),
    });
  } catch (error) {
    next(error);
  }
};

// @desc Toggle Student Active Status
// @route PUT /api/admin/students/:id/status
export const toggleStudentStatus = async (req, res, next) => {
  try {
    const student = await User.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    student.isVerified = !student.isVerified;
    await student.save();

    res.json({
      success: true,
      isVerified: student.isVerified,
      message: `Student account ${student.isVerified ? 'activated' : 'deactivated'}`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get All Payment Transactions (Admin)
// @route GET /api/admin/payments
export const getAllPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find()
      .populate('user', 'name email avatar')
      .populate('course', 'title price')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      payments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Admin Announcements
// @route POST /api/admin/announcements
export const createAnnouncement = async (req, res, next) => {
  try {
    const { title, content, targetAudience, courseId } = req.body;

    const announcement = await Announcement.create({
      title,
      content,
      author: req.user._id,
      targetAudience: targetAudience || 'all',
      course: courseId || null,
    });

    res.status(201).json({
      success: true,
      announcement,
    });
  } catch (error) {
    next(error);
  }
};

export const getAnnouncements = async (req, res, next) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json({ success: true, announcements });
  } catch (error) {
    next(error);
  }
};
