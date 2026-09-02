import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Star,
  Users,
  CheckCircle,
  Play,
  Lock,
  ChevronDown,
  ShieldCheck,
  Award,
  Bot,
  Sparkles,
  BookOpen
} from 'lucide-react';

const CourseDetailPage = () => {
  const { idOrSlug } = useParams();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Review Form state
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const res = await API.get(`/courses/${idOrSlug}`);
        if (res.data.success) {
          setCourse(res.data.course);
          setModules(res.data.modules || []);

          if (user) {
            const enRes = await API.get(`/enrollments/check/${res.data.course._id}`);
            if (enRes.data.success) setIsEnrolled(enRes.data.isEnrolled);
          }

          // Fetch reviews
          const revRes = await API.get(`/reviews/course/${res.data.course._id}`);
          if (revRes.data.success) setReviews(revRes.data.reviews || []);
        }
      } catch (err) {
        console.warn('Course fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [idOrSlug, user]);

  const handleEnrollClick = async () => {
    if (!user) {
      addToast('Please sign in to enroll in this course.', 'info');
      navigate('/login');
      return;
    }

    if (isEnrolled) {
      navigate(`/course/${course._id}/learn`);
      return;
    }

    setPaymentProcessing(true);

    try {
      // Step 1: Create Order on Backend
      const orderRes = await API.post('/payments/create-order', { courseId: course._id });

      if (!orderRes.data.success) {
        throw new Error('Order creation failed');
      }

      const { orderId, amount, keyId } = orderRes.data;

      // Step 2: Open Razorpay Test Mode Checkout Window
      const options = {
        key: keyId,
        amount: amount * 100,
        currency: 'INR',
        name: 'Learnova AI',
        description: `Enrollment: ${course.title}`,
        order_id: orderId.startsWith('order_test_') ? undefined : orderId, // handled in test SDK
        handler: async (response) => {
          try {
            // Step 3: Verify Payment Signature on Backend
            const verifyRes = await API.post('/payments/verify', {
              razorpayOrderId: orderId,
              razorpayPaymentId: response.razorpay_payment_id || `pay_test_${Date.now()}`,
              razorpaySignature: response.razorpay_signature || 'test_sig',
              courseId: course._id,
            });

            if (verifyRes.data.success) {
              addToast('Payment successful! Course unlocked.', 'success');
              setIsEnrolled(true);
              navigate(`/course/${course._id}/learn`);
            }
          } catch (err) {
            addToast('Payment verification error', 'error');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#6366f1',
        },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Fallback for environment without Razorpay script loaded
        const verifyRes = await API.post('/payments/verify', {
          razorpayOrderId: orderId,
          razorpayPaymentId: `pay_demo_${Date.now()}`,
          courseId: course._id,
        });
        if (verifyRes.data.success) {
          addToast('Test Payment Completed! Enrolled successfully.', 'success');
          setIsEnrolled(true);
          navigate(`/course/${course._id}/learn`);
        }
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Enrollment failed', 'error');
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!userComment.trim()) return;
    try {
      const res = await API.post('/reviews', {
        courseId: course._id,
        rating: userRating,
        comment: userComment,
      });
      if (res.data.success) {
        addToast('Review submitted! Thank you.', 'success');
        setUserComment('');
        // Refresh reviews
        const revRes = await API.get(`/reviews/course/${course._id}`);
        if (revRes.data.success) setReviews(revRes.data.reviews || []);
      }
    } catch (err) {
      addToast('Failed to submit review', 'error');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">
        Loading course curriculum...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">
        Course not found.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Top Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Info */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold">
              {course.category?.name || 'Software Engineering'}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-800 text-xs font-semibold">
              {course.level}
            </span>
            <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400" /> {course.rating} ({course.reviewCount || 0} reviews)
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
            {course.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {course.subtitle || course.description}
          </p>

          <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-indigo-400" /> {course.enrolledStudentsCount || 120} Students Enrolled</span>
            <span className="flex items-center gap-1.5"><Bot className="w-4 h-4 text-purple-400" /> 24/7 AI Tutor Included</span>
            <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-emerald-400" /> Verified Certificate</span>
          </div>
        </div>

        {/* Right Sticky Checkout Card */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 space-y-6 border-indigo-500/30 shadow-2xl sticky top-24">
          <div className="relative h-48 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-lg shadow-indigo-500/50">
                <Play className="w-5 h-5 fill-white ml-0.5" />
              </div>
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xs text-slate-400 line-through mr-2">₹{course.originalPrice || course.price * 2}</span>
              <span className="text-3xl font-black text-white">₹{course.price}</span>
            </div>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-1 rounded-full">
              50% OFF
            </span>
          </div>

          <button
            onClick={handleEnrollClick}
            disabled={paymentProcessing}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-xs shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
          >
            {isEnrolled ? (
              <>Go to Course Player <Play className="w-4 h-4 fill-white" /></>
            ) : paymentProcessing ? (
              'Opening Razorpay Test Modal...'
            ) : (
              <>Enroll Now (Razorpay Test Mode) <ShieldCheck className="w-4 h-4" /></>
            )}
          </button>

          <p className="text-[11px] text-center text-slate-400">
            💳 Test Mode Enabled • 30-Day Money-Back Guarantee
          </p>
        </div>
      </div>

      {/* Curriculum Breakdown */}
      <div className="space-y-6 pt-6 border-t border-slate-800">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-indigo-400" /> Course Curriculum & Modules
        </h2>

        <div className="space-y-4">
          {modules.map((mod, idx) => (
            <div key={mod._id} className="glass-panel rounded-2xl p-5 border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">{mod.title}</h3>
                <span className="text-xs text-slate-400 font-semibold">{mod.lessons ? mod.lessons.length : 0} Lessons</span>
              </div>
              <p className="text-xs text-slate-400">{mod.description}</p>

              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                {(mod.lessons || []).map((les) => (
                  <div key={les._id} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-300 font-medium flex items-center gap-2">
                      <Play className="w-3.5 h-3.5 text-indigo-400" /> {les.title}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold">{les.durationMinutes || 15} mins</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Reviews Section */}
      <div className="space-y-6 pt-6 border-t border-slate-800">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Star className="w-6 h-6 text-amber-400 fill-amber-400" /> Student Reviews ({reviews.length})
        </h2>

        {/* Add Review Form if Enrolled */}
        {isEnrolled && (
          <form onSubmit={handleReviewSubmit} className="glass-panel p-5 rounded-2xl space-y-4 border-indigo-500/30">
            <h4 className="text-sm font-bold text-white">Leave Your Feedback</h4>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300">Rating:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setUserRating(star)}
                  className="text-amber-400"
                >
                  <Star className={`w-5 h-5 ${userRating >= star ? 'fill-amber-400' : 'text-slate-600'}`} />
                </button>
              ))}
            </div>
            <textarea
              required
              rows={3}
              value={userComment}
              onChange={(e) => setUserComment(e.target.value)}
              placeholder="Share your learning experience..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
            <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold">
              Submit Review
            </button>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev) => (
            <div key={rev._id} className="glass-panel p-4 rounded-2xl border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={rev.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} alt={rev.user?.name} className="w-7 h-7 rounded-full object-cover" />
                  <span className="text-xs font-bold text-white">{rev.user?.name || 'Student'}</span>
                </div>
                <div className="flex items-center gap-1 text-amber-400 text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {rev.rating}
                </div>
              </div>
              <p className="text-xs text-slate-300 italic">"{rev.comment}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
