import { GoogleGenerativeAI } from '@google/generative-ai';

const getAIClient = () => {
  if (process.env.AI_API_KEY && process.env.AI_API_KEY.trim() !== '') {
    return new GoogleGenerativeAI(process.env.AI_API_KEY.trim());
  }
  return null;
};

/**
 * AI Tutor Handler
 */
export const askAITutor = async ({ message, context = {}, mode = 'direct', history = [] }) => {
  const apiKey = process.env.AI_API_KEY;

  if (apiKey && apiKey.trim() !== '') {
    try {
      const genAI = getAIClient();
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      let systemPrompt = `You are Learnova AI, an expert, patient, and encouraging AI Tutor.
Your goal is to guide students to deep understanding.
Current Context:
- Course: ${context.courseTitle || 'General'}
- Module: ${context.moduleTitle || 'General'}
- Lesson: ${context.lessonTitle || 'General'}
- Current Topic: ${context.topic || 'Software Development & Science'}

Instruction Mode: ${mode}
`;

      if (mode === 'hint') {
        systemPrompt += `\nMode rule: DO NOT give the final solution right away! Provide 2-3 conceptual hints first. Encourage the student to think through the problem step-by-step.`;
      } else if (mode === 'hinglish') {
        systemPrompt += `\nMode rule: Explain in clear, natural Hinglish (mix of Hindi and English in Roman script). Use relatable everyday analogies.`;
      } else if (mode === 'summary') {
        systemPrompt += `\nMode rule: Keep the response ultra-concise, structured into bullet points and key takeaways.`;
      }

      const prompt = `${systemPrompt}\n\nUser Question: ${message}`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (err) {
      console.warn('Gemini API call failed:', err.message);
      return `⚠️ Gemini API Error: ${err.message}. Please verify that AI_API_KEY in backend/.env is valid.`;
    }
  }

  // Configuration Notice when AI_API_KEY is missing
  return `⚠️ Configuration Notice: The AI_API_KEY environment variable is not configured in backend/.env.
Please set AI_API_KEY=your_gemini_api_key in your backend/.env file to activate live 24/7 Gemini AI tutoring.

[Context Engine Sandbox: Active Lesson "${context.lessonTitle || 'General'}"]`;
};

/**
 * AI Quiz Generator
 */
export const generateAIQuiz = async ({ topic, numQuestions = 5, difficulty = 'Medium', questionType = 'MCQ' }) => {
  const apiKey = process.env.AI_API_KEY;

  if (apiKey && apiKey.trim() !== '') {
    try {
      const genAI = getAIClient();
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `Generate a structured JSON quiz on the topic "${topic}".
Number of questions: ${numQuestions}.
Difficulty: ${difficulty}.
Type: ${questionType}.

Return ONLY valid JSON with this exact array structure:
[
  {
    "questionText": "Question text here...",
    "type": "MCQ",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswerIndex": 0,
    "explanation": "Detailed explanation of why Option A is correct.",
    "topic": "${topic}",
    "difficulty": "${difficulty}"
  }
]`;

      const result = await model.generateContent(prompt);
      const responseText = await result.response.text();
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (err) {
      console.warn('AI Quiz Generation error:', err.message);
    }
  }

  return [
    {
      questionText: `⚠️ AI_API_KEY not configured in backend/.env. Add a Gemini API Key to enable live quiz generation for "${topic}".`,
      type: 'MCQ',
      options: ['Option A: Configure AI_API_KEY', 'Option B: Set env variable', 'Option C: Restart backend', 'Option D: All of the above'],
      correctAnswerIndex: 3,
      explanation: 'Set AI_API_KEY=your_gemini_key in backend/.env to unlock dynamic real-time Gemini AI quiz generation.',
      topic: topic,
      difficulty: difficulty
    }
  ];
};

/**
 * AI Study Planner Generator
 */
export const generateAIStudyPlan = async ({ goal, examDate, availableHoursPerDay = 2, skillLevel = 'Beginner' }) => {
  const apiKey = process.env.AI_API_KEY;

  if (apiKey && apiKey.trim() !== '') {
    try {
      const genAI = getAIClient();
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `Generate a structured 3-day study schedule JSON for goal "${goal}", skill level ${skillLevel}, available hours/day: ${availableHoursPerDay}.
Return ONLY valid JSON array of objects: [{ "day": 1, "title": "...", "tasks": [{ "time": "30 mins", "task": "..." }] }]`;

      const result = await model.generateContent(prompt);
      const responseText = await result.response.text();
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (err) {
      console.warn('AI Study Plan error:', err.message);
    }
  }

  return [
    {
      day: 1,
      date: 'Day 1',
      title: 'Fundamentals & Core Concepts (AI_API_KEY Config Notice)',
      tasks: [
        { time: '30 mins', task: `Configure AI_API_KEY in backend/.env to generate live study plans for ${goal}`, type: 'theory', completed: false },
        { time: '45 mins', task: 'Review foundational concepts and documentation', type: 'practice', completed: false }
      ]
    }
  ];
};

/**
 * AI Summarizer & Flashcards
 */
export const summarizeLesson = async ({ title, content }) => {
  const apiKey = process.env.AI_API_KEY;

  if (apiKey && apiKey.trim() !== '') {
    try {
      const genAI = getAIClient();
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `Summarize this text titled "${title}":\n${content}\n
Return ONLY JSON object: { "summary": "...", "keyPoints": ["..."], "flashcards": [{ "front": "...", "back": "..." }] }`;

      const result = await model.generateContent(prompt);
      const responseText = await result.response.text();
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (parsed.summary) return parsed;
    } catch (err) {
      console.warn('AI Summarizer error:', err.message);
    }
  }

  return {
    summary: `⚠️ AI_API_KEY environment variable is missing in backend/.env. This is a configuration notice for summarizing "${title}".`,
    keyPoints: [
      'To enable live Gemini summarization, set AI_API_KEY in backend/.env.',
      'No fake fallback data is generated when API key is missing.'
    ],
    flashcards: [
      { front: 'How to enable AI Summarizer?', back: 'Add AI_API_KEY=your_key in backend/.env' }
    ]
  };
};

/**
 * AI Admin Course Content Helper
 */
export const generateCourseContent = async ({ title, category, level }) => {
  const apiKey = process.env.AI_API_KEY;

  if (apiKey && apiKey.trim() !== '') {
    try {
      const genAI = getAIClient();
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `Generate JSON course curriculum for title "${title}", category "${category}", level "${level}".
Return ONLY JSON object: { "description": "...", "learningObjectives": ["..."], "requirements": ["..."], "tags": ["..."] }`;

      const result = await model.generateContent(prompt);
      const responseText = await result.response.text();
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (parsed.description) return parsed;
    } catch (err) {
      console.warn('AI Admin Course content error:', err.message);
    }
  }

  return {
    description: `⚠️ AI_API_KEY is not configured in backend/.env. Please add AI_API_KEY to generate live AI course content for "${title}".`,
    learningObjectives: [
      'Set AI_API_KEY in backend/.env',
      'Restart backend server to apply environment variables'
    ],
    requirements: ['Valid Gemini API Key'],
    tags: [title.toLowerCase(), 'ai-notice']
  };
};
