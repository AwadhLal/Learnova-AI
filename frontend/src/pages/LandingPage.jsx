import React from 'react';
import Hero from '../components/landing/Hero';
import AIIntro from '../components/landing/AIIntro';
import PopularCourses from '../components/landing/PopularCourses';
import HowItWorks from '../components/landing/HowItWorks';
import AITutorShowcase from '../components/landing/AITutorShowcase';
import PersonalizedLearning from '../components/landing/PersonalizedLearning';
import AnalyticsShowcase from '../components/landing/AnalyticsShowcase';
import Testimonials from '../components/landing/Testimonials';
import Pricing from '../components/landing/Pricing';
import FAQ from '../components/landing/FAQ';
import CTA from '../components/landing/CTA';

const LandingPage = () => {
  return (
    <div className="space-y-0 overflow-hidden">
      <Hero />
      <AIIntro />
      <PopularCourses />
      <HowItWorks />
      <AITutorShowcase />
      <PersonalizedLearning />
      <AnalyticsShowcase />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
    </div>
  );
};

export default LandingPage;
