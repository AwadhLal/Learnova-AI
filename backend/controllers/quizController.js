import Quiz from '../models/Quiz.js';
import Question from '../models/Question.js';
import QuizAttempt from '../models/QuizAttempt.js';

// @desc Get quiz with questions
// @route GET /api/quizzes/:id
export const getQuizById = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    const questions = await Question.find({ quiz: quiz._id });

    res.json({
      success: true,
      quiz: {
        ...quiz.toObject(),
        questions,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Submit quiz attempt
// @route POST /api/quizzes/:id/submit
export const submitQuizAttempt = async (req, res, next) => {
  try {
    const quizId = req.params.id;
    const { userAnswers } = req.body; // Array of { questionId, selectedOption }
    const userId = req.user._id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    const questions = await Question.find({ quiz: quizId });
    let correctCount = 0;
    const processedAnswers = [];
    const weakTopicsSet = new Set();

    questions.forEach((q) => {
      const uAns = userAnswers.find((a) => a.questionId === q._id.toString());
      const selectedOpt = uAns ? uAns.selectedOption : -1;
      const isCorrect = selectedOpt === q.correctAnswerIndex;

      if (isCorrect) {
        correctCount += 1;
      } else {
        if (q.topic) weakTopicsSet.add(q.topic);
        else if (quiz.topic) weakTopicsSet.add(quiz.topic);
      }

      processedAnswers.push({
        questionId: q._id,
        selectedOption: selectedOpt,
        isCorrect,
        explanation: q.explanation,
      });
    });

    const totalQuestions = questions.length;
    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 100;
    const passed = score >= (quiz.passingScore || 70);

    const attempt = await QuizAttempt.create({
      user: userId,
      quiz: quizId,
      score,
      totalQuestions,
      correctAnswersCount: correctCount,
      passed,
      answers: processedAnswers,
      weakTopics: Array.from(weakTopicsSet),
    });

    res.json({
      success: true,
      attempt,
      score,
      totalQuestions,
      correctAnswersCount: correctCount,
      passed,
      weakTopics: Array.from(weakTopicsSet),
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get user quiz attempts
// @route GET /api/quizzes/my-attempts
export const getUserQuizAttempts = async (req, res, next) => {
  try {
    const attempts = await QuizAttempt.find({ user: req.user._id })
      .populate('quiz', 'title topic')
      .sort({ attemptedAt: -1 });

    res.json({
      success: true,
      attempts,
    });
  } catch (error) {
    next(error);
  }
};
