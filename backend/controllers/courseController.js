import Course from '../models/Course.js';
import Module from '../models/Module.js';
import Lesson from '../models/Lesson.js';
import Category from '../models/Category.js';
import Review from '../models/Review.js';
import { uploadToCloudinary } from '../services/cloudinaryService.js';

// @desc Get all courses with search, filters & pagination
// @route GET /api/courses
export const getCourses = async (req, res, next) => {
  try {
    const { category, level, search, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;

    const query = { isPublished: true };

    if (category) {
      const catObj = await Category.findOne({ slug: category });
      if (catObj) query.category = catObj._id;
    }

    if (level && level !== 'All') {
      query.level = level;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'popular') sortOptions = { enrolledStudentsCount: -1 };
    if (sort === 'rating') sortOptions = { rating: -1 };
    if (sort === 'price-low') sortOptions = { price: 1 };
    if (sort === 'price-high') sortOptions = { price: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const courses = await Course.find(query)
      .populate('category', 'name slug icon')
      .populate('instructor', 'name avatar bio')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    const total = await Course.countDocuments(query);

    res.json({
      success: true,
      count: courses.length,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      courses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get single course detail by slug or ID
// @route GET /api/courses/:idOrSlug
export const getCourseBySlugOrId = async (req, res, next) => {
  try {
    const param = req.params.idOrSlug;
    let course;

    if (param.match(/^[0-9a-fA-F]{24}$/)) {
      course = await Course.findById(param)
        .populate('category', 'name slug icon')
        .populate('instructor', 'name avatar bio');
    } else {
      course = await Course.findOne({ slug: param })
        .populate('category', 'name slug icon')
        .populate('instructor', 'name avatar bio');
    }

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Fetch modules & lessons for this course
    const modules = await Module.find({ course: course._id }).sort({ order: 1 });
    const modulesWithLessons = await Promise.all(
      modules.map(async (mod) => {
        const lessons = await Lesson.find({ module: mod._id }).sort({ order: 1 });
        return {
          ...mod.toObject(),
          lessons,
        };
      })
    );

    // Fetch reviews
    const reviews = await Review.find({ course: course._id })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      course: {
        ...course.toObject(),
        modules: modulesWithLessons,
        reviews,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Create a new course (Admin)
// @route POST /api/courses
export const createCourse = async (req, res, next) => {
  try {
    const { title, subtitle, description, category, level, price, originalPrice, learningObjectives, requirements, tags } = req.body;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();

    let thumbnailUrl = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80';
    if (req.file) {
      try {
        thumbnailUrl = await uploadToCloudinary(req.file.buffer, 'courses');
      } catch (err) {
        console.error('Cloudinary thumbnail upload error:', err.message || err);
        return res.status(400).json({
          success: false,
          message: `Thumbnail image upload failed: ${err.message || 'Cloudinary authorization error (403 Forbidden)'}`
        });
      }
    }

    const course = await Course.create({
      title,
      slug,
      subtitle,
      description,
      category,
      instructor: req.user._id,
      level,
      price: Number(price) || 0,
      originalPrice: Number(originalPrice) || Number(price) || 0,
      thumbnail: thumbnailUrl,
      learningObjectives: Array.isArray(learningObjectives) ? learningObjectives : (learningObjectives || '').split('\n').filter(Boolean),
      requirements: Array.isArray(requirements) ? requirements : (requirements || '').split('\n').filter(Boolean),
      tags: Array.isArray(tags) ? tags : (tags || '').split(',').map(t => t.trim()),
      isPublished: true,
    });

    // Update category course count
    await Category.findByIdAndUpdate(category, { $inc: { courseCount: 1 } });

    res.status(201).json({
      success: true,
      course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update Course (Admin)
// @route PUT /api/courses/:id
export const updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const updateFields = { ...req.body };
    if (req.file) {
      try {
        updateFields.thumbnail = await uploadToCloudinary(req.file.buffer, 'courses');
      } catch (err) {
        console.error('Cloudinary thumbnail update error:', err.message || err);
        return res.status(400).json({
          success: false,
          message: `Thumbnail image upload failed: ${err.message || 'Cloudinary authorization error (403 Forbidden)'}`
        });
      }
    }

    if (updateFields.learningObjectives && typeof updateFields.learningObjectives === 'string') {
      updateFields.learningObjectives = updateFields.learningObjectives.split('\n').filter(Boolean);
    }
    if (updateFields.requirements && typeof updateFields.requirements === 'string') {
      updateFields.requirements = updateFields.requirements.split('\n').filter(Boolean);
    }
    if (updateFields.tags && typeof updateFields.tags === 'string') {
      updateFields.tags = updateFields.tags.split(',').map(t => t.trim());
    }

    course = await Course.findByIdAndUpdate(req.params.id, updateFields, { new: true, runValidators: true });

    res.json({
      success: true,
      course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete Course (Admin)
// @route DELETE /api/courses/:id
export const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    await Module.deleteMany({ course: course._id });
    await Lesson.deleteMany({ course: course._id });
    await Course.findByIdAndDelete(course._id);

    res.json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc Add Module to Course
// @route POST /api/courses/:id/modules
export const addModule = async (req, res, next) => {
  try {
    const { title, description, order } = req.body;
    const courseId = req.params.id;

    const module = await Module.create({
      course: courseId,
      title,
      description,
      order: order || 1,
    });

    res.status(201).json({ success: true, module });
  } catch (error) {
    next(error);
  }
};

// @desc Add Lesson to Module
// @route POST /api/courses/modules/:moduleId/lessons
export const addLesson = async (req, res, next) => {
  try {
    const { moduleId } = req.params;
    const { title, type, content, videoUrl, durationMinutes, order } = req.body;

    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({ success: false, message: 'Module not found' });
    }

    const lesson = await Lesson.create({
      module: moduleId,
      course: module.course,
      title,
      type: type || 'video',
      content: content || '',
      videoUrl: videoUrl || '',
      durationMinutes: Number(durationMinutes) || 10,
      order: Number(order) || 1,
    });

    res.status(201).json({ success: true, lesson });
  } catch (error) {
    next(error);
  }
};

// @desc Update Module
// @route PUT /api/courses/modules/:moduleId
export const updateModule = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const module = await Module.findByIdAndUpdate(req.params.moduleId, { title, description }, { new: true, runValidators: true });
    if (!module) return res.status(404).json({ success: false, message: 'Module not found' });
    res.json({ success: true, module });
  } catch (error) {
    next(error);
  }
};

// @desc Delete Module and its Lessons
// @route DELETE /api/courses/modules/:moduleId
export const deleteModule = async (req, res, next) => {
  try {
    const module = await Module.findById(req.params.moduleId);
    if (!module) return res.status(404).json({ success: false, message: 'Module not found' });
    await Lesson.deleteMany({ module: module._id });
    await Module.findByIdAndDelete(module._id);
    res.json({ success: true, message: 'Module deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc Reorder Modules
// @route PUT /api/courses/:id/modules/reorder
export const reorderModules = async (req, res, next) => {
  try {
    const { modules } = req.body; // Array of { id, order }
    if (modules && modules.length > 0) {
      await Promise.all(modules.map(mod => Module.findByIdAndUpdate(mod.id, { order: mod.order })));
    }
    res.json({ success: true, message: 'Modules reordered' });
  } catch (error) {
    next(error);
  }
};

// @desc Update Lesson
// @route PUT /api/courses/lessons/:lessonId
export const updateLesson = async (req, res, next) => {
  try {
    const { title, type, content, videoUrl, durationMinutes, resources } = req.body;
    const lesson = await Lesson.findByIdAndUpdate(
      req.params.lessonId,
      { title, type, content, videoUrl, durationMinutes: Number(durationMinutes) || 10, resources },
      { new: true, runValidators: true }
    );
    if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' });
    res.json({ success: true, lesson });
  } catch (error) {
    next(error);
  }
};

// @desc Delete Lesson
// @route DELETE /api/courses/lessons/:lessonId
export const deleteLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.lessonId);
    if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' });
    res.json({ success: true, message: 'Lesson deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc Reorder Lessons
// @route PUT /api/courses/modules/:moduleId/lessons/reorder
export const reorderLessons = async (req, res, next) => {
  try {
    const { lessons } = req.body; // Array of { id, order }
    if (lessons && lessons.length > 0) {
      await Promise.all(lessons.map(less => Lesson.findByIdAndUpdate(less.id, { order: less.order })));
    }
    res.json({ success: true, message: 'Lessons reordered' });
  } catch (error) {
    next(error);
  }
};

// @desc Upload Video for Lesson
// @route POST /api/courses/upload-video
export const uploadVideo = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file provided' });
    const videoUrl = await uploadToCloudinary(req.file.buffer, 'course_videos');
    res.json({ success: true, videoUrl });
  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload video' });
  }
};
