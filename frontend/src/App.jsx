import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import CourseCatalogPage from './pages/CourseCatalogPage';
import CourseDetailPage from './pages/CourseDetailPage';
import LearningPlayerPage from './pages/LearningPlayerPage';
import StudentDashboard from './pages/StudentDashboard';
import AITutorPage from './pages/AITutorPage';
import ProfilePage from './pages/ProfilePage';

import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCourseManager from './pages/admin/AdminCourseManager';
import AdminStudentManager from './pages/admin/AdminStudentManager';
import AdminPaymentLogs from './pages/admin/AdminPaymentLogs';
import AdminAITools from './pages/admin/AdminAITools';
import AdminCurriculumManager from './pages/admin/AdminCurriculumManager';

import { useAuth } from './context/AuthContext';

// Protected Route for Students
const StudentRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Protected Route for Admins
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || user.role !== 'admin') return <Navigate to="/admin/login" replace />;
  return children;
};

function App() {
  const location = useLocation();
  const isLearningPlayer = location.pathname.includes('/learn');

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Hide Navbar & Footer on Learning Player screen for maximum screen real estate */}
      {!isLearningPlayer && <Navbar />}

      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/courses" element={<CourseCatalogPage />} />
          <Route path="/courses/:idOrSlug" element={<CourseDetailPage />} />
          <Route path="/ai-tools" element={<AITutorPage />} />

          {/* Student Protected Routes */}
          <Route path="/dashboard" element={<StudentRoute><StudentDashboard /></StudentRoute>} />
          <Route path="/profile" element={<StudentRoute><ProfilePage /></StudentRoute>} />
          <Route path="/course/:courseId/learn" element={<StudentRoute><LearningPlayerPage /></StudentRoute>} />

          {/* Admin Protected Routes */}
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/courses" element={<AdminRoute><AdminCourseManager /></AdminRoute>} />
          <Route path="/admin/courses/:courseId/curriculum" element={<AdminRoute><AdminCurriculumManager /></AdminRoute>} />
          <Route path="/admin/students" element={<AdminRoute><AdminStudentManager /></AdminRoute>} />
          <Route path="/admin/payments" element={<AdminRoute><AdminPaymentLogs /></AdminRoute>} />
          <Route path="/admin/ai-tools" element={<AdminRoute><AdminAITools /></AdminRoute>} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isLearningPlayer && <Footer />}
    </div>
  );
}

export default App;
