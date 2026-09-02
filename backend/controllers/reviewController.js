import Review from '../models/Review.js';
import Course from '../models/Course.js';

export const addReview = async (req, res, next) => {
  try {
    const { courseId, rating, comment } = req.body;
    const userId = req.user._id;

    let review = await Review.findOne({ user: userId, course: courseId });
    if (review) {
      review.rating = Number(rating);
      review.comment = comment;
      await review.save();
    } else {
      review = await Review.create({
        user: userId,
        course: courseId,
        rating: Number(rating),
        comment,
      });
    }

    // Recalculate course rating
    const reviews = await Review.find({ course: courseId });
    const avgRating = Math.round((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) * 10) / 10;
    await Course.findByIdAndUpdate(courseId, { rating: avgRating, reviewCount: reviews.length });

    res.status(201).json({ success: true, review, avgRating });
  } catch (error) {
    next(error);
  }
};

export const getCourseReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ course: req.params.courseId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (error) {
    next(error);
  }
};
