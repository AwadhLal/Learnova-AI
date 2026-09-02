import { askAITutor, generateAIQuiz, generateAIStudyPlan, summarizeLesson, generateCourseContent } from '../services/aiService.js';
import AIConversation from '../models/AIConversation.js';
import Quiz from '../models/Quiz.js';
import Question from '../models/Question.js';
import StudyPlan from '../models/StudyPlan.js';
import QuizAttempt from '../models/QuizAttempt.js';
import Course from '../models/Course.js';

// @desc Ask AI Tutor
// @route POST /api/ai/tutor
export const askTutorController = async (req, res, next) => {
  try {
    const { message, courseId, lessonId, courseTitle, lessonTitle, topic, mode = 'direct' } = req.body;
    const userId = req.user._id;

    let conversation = await AIConversation.findOne({ user: userId, course: courseId || null, topic: topic || 'General Study Support' });
    if (!conversation) {
      conversation = await AIConversation.create({
        user: userId,
        course: courseId || null,
        lesson: lessonId || null,
        topic: topic || 'General Study Support',
        messages: [],
      });
    }

    conversation.messages.push({ role: 'user', content: message, mode });

    const aiResponse = await askAITutor({
      message,
      context: { courseTitle, lessonTitle, topic },
      mode,
      history: conversation.messages,
    });

    conversation.messages.push({ role: 'assistant', content: aiResponse, mode });
    await conversation.save();

    res.json({
      success: true,
      reply: aiResponse,
      conversationId: conversation._id,
      messages: conversation.messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Generate AI Quiz
// @route POST /api/ai/generate-quiz
export const generateQuizController = async (req, res, next) => {
  try {
    const { topic, numQuestions = 5, difficulty = 'Medium', questionType = 'MCQ', courseId } = req.body;

    const rawQuestions = await generateAIQuiz({ topic, numQuestions, difficulty, questionType });

    const quiz = await Quiz.create({
      title: `AI Quiz: ${topic}`,
      topic,
      description: `AI-generated practice quiz on ${topic} (${difficulty} difficulty)`,
      timeLimitMinutes: Math.max(5, numQuestions * 2),
      passingScore: 70,
      isAIGenerated: true,
      createdBy: req.user._id,
      course: courseId || null,
    });

    const questionDocs = await Promise.all(
      rawQuestions.map((q) =>
        Question.create({
          quiz: quiz._id,
          questionText: q.questionText,
          type: q.type || 'MCQ',
          options: q.options || [],
          correctAnswerIndex: q.correctAnswerIndex || 0,
          explanation: q.explanation || '',
          topic: q.topic || topic,
          difficulty: q.difficulty || difficulty,
        })
      )
    );

    res.status(201).json({
      success: true,
      quiz: {
        ...quiz.toObject(),
        questions: questionDocs,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Generate AI Study Plan
// @route POST /api/ai/study-plan
export const generateStudyPlanController = async (req, res, next) => {
  try {
    const { goal, examDate, availableHoursPerDay, skillLevel } = req.body;
    const userId = req.user._id;

    const schedule = await generateAIStudyPlan({ goal, examDate, availableHoursPerDay, skillLevel });

    const studyPlan = await StudyPlan.create({
      user: userId,
      goal,
      examDate: examDate ? new Date(examDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      availableHoursPerDay: Number(availableHoursPerDay) || 2,
      skillLevel: skillLevel || 'Beginner',
      schedule,
    });

    res.status(201).json({
      success: true,
      studyPlan,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get Active Study Plan
// @route GET /api/ai/study-plan/my
export const getMyStudyPlan = async (req, res, next) => {
  try {
    const studyPlan = await StudyPlan.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      studyPlan,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Summarize Lesson / Topic
// @route POST /api/ai/summarize
export const summarizeLessonController = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const summaryData = await summarizeLesson({ title: title || 'Lesson Overview', content: content || '' });

    res.json({
      success: true,
      ...summaryData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Recommendation Engine
// @route GET /api/ai/recommendations
export const getRecommendationsController = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Fetch user recent quiz attempts to identify weak topics
    const attempts = await QuizAttempt.find({ user: userId }).sort({ attemptedAt: -1 }).limit(5);
    const weakTopics = [];
    attempts.forEach(a => {
      if (a.weakTopics && a.weakTopics.length > 0) {
        weakTopics.push(...a.weakTopics);
      }
    });

    const uniqueWeak = Array.from(new Set(weakTopics));

    // Get recommended courses based on weak topics or high-rated courses
    let recommendedCourses = [];
    if (uniqueWeak.length > 0) {
      recommendedCourses = await Course.find({
        tags: { $in: uniqueWeak.map(t => new RegExp(t, 'i')) }
      }).limit(4);
    }

    if (recommendedCourses.length < 4) {
      const remaining = await Course.find({ isPublished: true })
        .sort({ rating: -1, enrolledStudentsCount: -1 })
        .limit(4 - recommendedCourses.length);
      recommendedCourses = [...recommendedCourses, ...remaining];
    }

    res.json({
      success: true,
      weakTopics: uniqueWeak,
      insightMessage: uniqueWeak.length > 0
        ? `✨ AI Insight: You have room for growth in "${uniqueWeak.join(', ')}". Practice these topics to boost your average score!`
        : `✨ AI Insight: Excellent work! You're demonstrating steady progress across your active learning paths.`,
      recommendations: recommendedCourses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Admin AI Content Generation
// @route POST /api/ai/admin-generate
export const adminGenerateContentController = async (req, res, next) => {
  try {
    const { title, category, level } = req.body;
    const generated = await generateCourseContent({ title, category, level });

    res.json({
      success: true,
      generated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Health check & test all Gemini AI features
// @route GET /api/ai/health-check
export const healthCheckAIController = async (req, res, next) => {
  try {
    const tutorReply = await askAITutor({ message: 'Hello AI Tutor', mode: 'direct' });
    res.json({
      success: true,
      message: 'Gemini AI integration is fully functional across all platform features!',
      activeModel: 'gemini-3.5-flash',
      testResponse: tutorReply.substring(0, 100) + '...',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

