import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import Progress from '../models/Progress.js';

// @desc Enroll student in a course (Free or Direct)
// @route POST /api/enrollments
export const enrollCourse = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const userId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    let enrollment = await Enrollment.findOne({ user: userId, course: courseId });
    if (enrollment) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
    }

    enrollment = await Enrollment.create({
      user: userId,
      course: courseId,
      status: 'active',
    });

    // Create initial Progress record
    await Progress.create({
      user: userId,
      course: courseId,
      completedLessons: [],
      percentage: 0,
    });

    // Increment enrolled count
    await Course.findByIdAndUpdate(courseId, { $inc: { enrolledStudentsCount: 1 } });

    res.status(201).json({
      success: true,
      enrollment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get current student's enrollments
// @route GET /api/enrollments/my
export const getMyEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id })
      .populate({
        path: 'course',
        populate: { path: 'category instructor', select: 'name avatar slug icon' }
      })
      .sort({ enrolledAt: -1 });

    const enrollmentsWithProgress = await Promise.all(
      enrollments.map(async (en) => {
        if (!en.course) return en.toObject();
        const prog = await Progress.findOne({ user: req.user._id, course: en.course._id });
        return {
          ...en.toObject(),
          progressPercentage: prog ? prog.percentage : 0,
          completedLessonsCount: prog ? prog.completedLessons.length : 0,
        };
      })
    );

    res.json({
      success: true,
      count: enrollmentsWithProgress.length,
      enrollments: enrollmentsWithProgress,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Check if user is enrolled in course
// @route GET /api/enrollments/check/:courseId
export const checkEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: req.params.courseId,
    });

    res.json({
      success: true,
      isEnrolled: !!enrollment,
    });
  } catch (error) {
    next(error);
  }
};
