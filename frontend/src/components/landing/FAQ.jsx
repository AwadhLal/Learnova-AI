import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: 'How does the AI Tutor differ from standard ChatGPT?',
    answer: 'Learnova AI Tutor is deeply integrated with your course curriculum. It knows the exact lesson, module, code snippet, and topic you are viewing, allowing it to provide contextual hints, Hinglish explanations, and step-by-step problem-solving guidance without giving away answers directly.',
  },
  {
    question: 'How do Razorpay test payments work on Learnova AI?',
    answer: 'The platform integrates Razorpay in TEST MODE. You can click "Enroll Now", use test card details or test UPI handles, and test order creation, payment signature verification, and automated enrollment triggering without spending real money.',
  },
  {
    question: 'Can administrators manage courses and students without code edits?',
    answer: 'Yes! Learnova AI includes a dedicated Admin Panel accessible via /admin/login. Administrators can create, edit, publish courses, manage modules, lessons, quizzes, toggle student accounts, send announcements, and view platform analytics.',
  },
  {
    question: 'How is student progress and streak calculated?',
    answer: 'Progress is updated in real-time as lessons and quizzes are completed. Streaks increment automatically when students log in and complete learning activities on consecutive days.',
  },
  {
    question: 'Are completion certificates verified?',
    answer: 'Yes! Upon reaching 100% progress in any course, Learnova AI generates a unique verification certificate code stored securely in the database.',
  },
];

const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(null);

  const toggle = (i) => {
    setOpenIdx(openIdx === i ? null : i);
  };

  return (
    <section className="py-24 bg-slate-950/80 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs font-extrabold uppercase tracking-wider text-purple-400">Got Questions?</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-sm text-slate-400">Everything you need to know about Learnova AI.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="glass-panel rounded-2xl overflow-hidden border-slate-800 transition-colors"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-white hover:text-indigo-300 transition-colors"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${
                    openIdx === idx ? 'rotate-180 text-indigo-400' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {openIdx === idx && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
