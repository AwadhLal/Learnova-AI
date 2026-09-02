import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const plans = [
  {
    name: 'Starter Student',
    price: '₹0',
    period: 'forever free',
    description: 'Perfect for exploring course previews and basic AI tutoring.',
    features: [
      'Access to free course previews',
      '10 AI Tutor questions per day',
      'Basic AI Quiz generator',
      'Community discussion forums',
    ],
    cta: 'Start Free',
    isPopular: false,
  },
  {
    name: 'Pro Learner',
    price: '₹999',
    period: 'per month',
    description: 'Full access to all courses, unlimited AI tutoring & certificates.',
    features: [
      'Unlimited course access',
      'Unlimited 24/7 AI Tutor questions',
      'Hinglish & Socratic hint modes',
      'AI Personal Study Planner',
      'Verified completion certificates',
      'Razorpay test payment access',
    ],
    cta: 'Get Pro Access',
    isPopular: true,
  },
  {
    name: 'Enterprise / Campus',
    price: '₹2,499',
    period: 'per seat / month',
    description: 'Dedicated admin management panel for university & corporate teams.',
    features: [
      'Everything in Pro Learner',
      'Dedicated Admin Panel access',
      'Full student progress analytics',
      'Course CRUD & custom curriculum builder',
      'Priority AI API bandwidth',
    ],
    cta: 'Contact Sales',
    isPopular: false,
  },
];

const Pricing = () => {
  return (
    <section className="py-24 relative bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400">Transparent Pricing</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            Invest in Your <span className="gradient-text">Future Today</span>
          </h2>
          <p className="text-sm text-slate-400">Choose the plan that best accelerates your skill mastery.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {plans.map((p, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`glass-panel rounded-3xl p-8 space-y-6 relative flex flex-col justify-between ${
                p.isPopular ? 'border-2 border-indigo-500 shadow-2xl shadow-indigo-500/20 bg-slate-900/90' : 'border-slate-800'
              }`}
            >
              {p.isPopular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[11px] font-extrabold shadow-md uppercase tracking-wider">
                  Most Popular
                </span>
              )}

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">{p.name}</h3>
                <p className="text-xs text-slate-400">{p.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">{p.price}</span>
                  <span className="text-xs text-slate-400 font-medium">{p.period}</span>
                </div>

                <ul className="space-y-3 pt-4 border-t border-slate-800 text-xs text-slate-300">
                  {p.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to="/register"
                className={`w-full py-3.5 rounded-2xl text-xs font-bold text-center transition-all ${
                  p.isPopular
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30'
                    : 'glass-panel hover:bg-slate-800 text-slate-200'
                }`}
              >
                {p.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
