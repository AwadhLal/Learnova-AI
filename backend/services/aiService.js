import { GoogleGenAI } from '@google/genai';

// Central API Key resolution
const getAPIKey = () => {
  const key = process.env.GEMINI_API_KEY;
  return key && key.trim() !== '' ? key.trim() : null;
};

// Central Client Factory
const getAIClient = () => {
  const apiKey = getAPIKey();
  if (apiKey) {
    return new GoogleGenAI({ apiKey });
  }
  return null;
};

const PRIMARY_MODEL = 'gemini-3.6-flash';

/**
 * Centralized Gemini Content Generator
 * Stripped of uncontrolled fallbacks to ensure strict adherence to gemini-2.5-flash
 */
const generateContentStrict = async (prompt) => {
  const apiKey = getAPIKey();
  const genAI = getAIClient();
  if (!genAI || !apiKey) {
    throw new Error('Gemini API Key is not configured. Please set GEMINI_API_KEY in backend/.env file.');
  }

  const modelName = process.env.GEMINI_MODEL?.trim() || PRIMARY_MODEL;

  try {
    const response = await genAI.models.generateContent({
      model: modelName,
      contents: prompt
    });
    return { result: response, modelName };
  } catch (err) {
    const safeError = err.message || err.toString();
    console.error(`⚠️ [Gemini AI] Model "${modelName}" failed. HTTP Status/Error:`, safeError.substring(0, 200));
    throw new Error(`Gemini AI Error with ${modelName}: ${safeError}`);
  }
};

/**
 * Safe Startup Diagnostics & Connectivity Test
 */
export const testGeminiConnection = async () => {
  const apiKey = getAPIKey();
  const primaryModel = process.env.GEMINI_MODEL || PRIMARY_MODEL;

  console.log('🤖 Gemini AI Environment Status:');
  console.log(`- Gemini API key configured: ${apiKey ? 'YES' : 'NO'}`);
  console.log(`- Preferred model: ${primaryModel}`);

  if (!apiKey) {
    console.warn('⚠️  Gemini AI Notice: GEMINI_API_KEY is not set in backend/.env');
    return { success: false, configured: false };
  }

  try {
    const { result, modelName } = await generateContentStrict('Respond with only the single word "ONLINE" to confirm API connectivity.');
    const responseText = result.text.trim();
    console.log(`🎉 ✅ Gemini AI Connected Successfully! Active Working Model: "${modelName}" | Status: "${responseText}"`);
    return { success: true, modelName, response: responseText };
  } catch (err) {
    console.error(`❌ Gemini AI Startup Test Failed: ${err.message}`);
    return { success: false, error: err.message };
  }
};

/**
 * 1. AI Tutor Handler (Direct, Hint, Hinglish, Summary modes)
 */
export const askAITutor = async ({ message, context = {}, mode = 'direct', history = [] }) => {
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
  
  try {
    const { result } = await generateContentStrict(prompt);
    return result.text;
  } catch (err) {
    console.error('Ask AI Tutor Error:', err.message);
    throw new Error(`Gemini AI Error: ${err.message}`);
  }
};

/**
 * 2. AI Quiz Generator
 */
export const generateAIQuiz = async ({ topic, numQuestions = 5, difficulty = 'Medium', questionType = 'MCQ' }) => {
  const prompt = `Generate a structured JSON quiz on the topic "${topic}".
Number of questions: ${numQuestions}.
Difficulty: ${difficulty}.
Type: ${questionType}.

Return ONLY valid JSON array with this exact structure:
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

  try {
    const { result } = await generateContentStrict(prompt);
    const responseText = result.text;
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    throw new Error('Parsed response is not a valid JSON question array');
  } catch (err) {
    console.error('AI Quiz Generation Error:', err.message);
    throw err;
  }
};

/**
 * 3. AI Study Planner Generator
 */
export const generateAIStudyPlan = async ({ goal, examDate, availableHoursPerDay = 2, skillLevel = 'Beginner' }) => {
  const prompt = `Generate a structured 3-day study schedule JSON for goal "${goal}", skill level ${skillLevel}, available hours/day: ${availableHoursPerDay}.
Return ONLY valid JSON array of objects: [{ "day": 1, "title": "...", "tasks": [{ "time": "30 mins", "task": "...", "type": "theory", "completed": false }] }]`;

  try {
    const { result } = await generateContentStrict(prompt);
    const responseText = result.text;
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    throw new Error('Parsed response is not a valid JSON study plan array');
  } catch (err) {
    console.error('AI Study Plan Error:', err.message);
    throw err;
  }
};

/**
 * 4. AI Summarizer & Flashcards
 */
export const summarizeLesson = async ({ title, content }) => {
  const prompt = `Summarize this lesson text titled "${title}":\n${content}\n
Return ONLY valid JSON object: { "summary": "...", "keyPoints": ["..."], "flashcards": [{ "front": "...", "back": "..." }] }`;

  try {
    const { result } = await generateContentStrict(prompt);
    const responseText = result.text;
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);
    if (parsed.summary) return parsed;
    throw new Error('Parsed response missing summary field');
  } catch (err) {
    console.error('AI Summarizer Error:', err.message);
    throw err;
  }
};

/**
 * 5. Admin AI Course Content Generator
 */
export const generateCourseContent = async ({ title, category, level }) => {
  const prompt = `Generate JSON course curriculum for title "${title}", category "${category}", level "${level}".
Return ONLY valid JSON object: { "description": "...", "learningObjectives": ["..."], "requirements": ["..."], "tags": ["..."] }`;

  try {
    const { result } = await generateContentStrict(prompt);
    const responseText = result.text;
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);
    if (parsed.description) return parsed;
    throw new Error('Parsed response missing description field');
  } catch (err) {
    console.error('AI Admin Course Content Error:', err.message);
    throw err;
  }
};
