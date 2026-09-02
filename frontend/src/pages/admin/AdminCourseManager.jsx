import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Plus, Edit3, Trash2, BookOpen, Layers, Play, Upload, X, Shield, Star, Check } from 'lucide-react';

const AdminCourseManager = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  // Modals
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [level, setLevel] = useState('Intermediate');
  const [price, setPrice] = useState(1999);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [objectives, setObjectives] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Module & Lesson Modals
  const [selectedCourseForModules, setSelectedCourseForModules] = useState(null);
  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [moduleTitle, setModuleTitle] = useState('');

  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState('');
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonType, setLessonType] = useState('video');
  const [videoUrl, setVideoUrl] = useState('');
  const [lessonContent, setLessonContent] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [cRes, catRes] = await Promise.all([
        API.get('/courses?limit=50'),
        API.get('/categories')
      ]);
      if (cRes.data.success) setCourses(cRes.data.courses);
      if (catRes.data.success) {
        setCategories(catRes.data.categories);
        if (catRes.data.categories.length > 0) setCategoryId(catRes.data.categories[0]._id);
      }
    } catch (err) {
      console.warn('Error fetching course manager data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingCourse(null);
    setTitle('');
    setSubtitle('');
    setDescription('');
    setLevel('Intermediate');
    setPrice(1999);
    setObjectives('');
    setIsCourseModalOpen(true);
  };

  const handleOpenEdit = (course) => {
    setEditingCourse(course);
    setTitle(course.title);
    setSubtitle(course.subtitle || '');
    setDescription(course.description || '');
    setCategoryId(course.category?._id || course.category || '');
    setLevel(course.level);
    setPrice(course.price);
    setObjectives(course.learningObjectives?.join('\n') || '');
    setIsCourseModalOpen(true);
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('subtitle', subtitle);
      formData.append('description', description);
      formData.append('category', categoryId);
      formData.append('level', level);
      formData.append('price', price);

      if (objectives) {
        formData.append('learningObjectives', JSON.stringify(objectives.split('\n').filter(Boolean)));
      }

      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
      }

      let res;
      if (editingCourse) {
        res = await API.put(`/courses/${editingCourse._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        res = await API.post('/courses', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (res.data.success) {
        addToast(editingCourse ? 'Course updated!' : 'Course created successfully!', 'success');
        setIsCourseModalOpen(false);
        fetchData();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Error saving course', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      const res = await API.delete(`/courses/${id}`);
      if (res.data.success) {
        addToast('Course deleted successfully!', 'success');
        fetchData();
      }
    } catch (err) {
      addToast('Failed to delete course', 'error');
    }
  };

  const handleCreateModule = async (e) => {
    e.preventDefault();
    if (!moduleTitle.trim() || !selectedCourseForModules) return;

    try {
      const res = await API.post(`/courses/${selectedCourseForModules._id}/modules`, {
        title: moduleTitle
      });

      if (res.data.success) {
        addToast('Module added!', 'success');
        setModuleTitle('');
        setModuleModalOpen(false);
        fetchData();
      }
    } catch (err) {
      addToast('Failed to add module', 'error');
    }
  };

  const handleCreateLesson = async (e) => {
    e.preventDefault();
    if (!lessonTitle.trim() || !selectedModuleId) return;

    try {
      const res = await API.post(`/courses/modules/${selectedModuleId}/lessons`, {
        title: lessonTitle,
        type: lessonType,
        videoUrl,
        content: lessonContent
      });

      if (res.data.success) {
        addToast('Lesson added!', 'success');
        setLessonTitle('');
        setVideoUrl('');
        setLessonContent('');
        setLessonModalOpen(false);
        fetchData();
      }
    } catch (err) {
      addToast('Failed to add lesson', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" /> Admin Control
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-white">Course Catalog CRUD</h1>
          <p className="text-xs text-slate-400">Create, modify, and structure curriculum without database touch.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Create New Course
        </button>
      </div>

      {/* Courses List Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-bold border-b border-slate-800 uppercase text-[10px]">
              <tr>
                <th className="p-4">Course Info</th>
                <th className="p-4">Category</th>
                <th className="p-4">Level</th>
                <th className="p-4">Price</th>
                <th className="p-4">Students</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {courses.map((c) => (
                <tr key={c._id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <img src={c.thumbnail} alt={c.title} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-bold text-white max-w-xs truncate">{c.title}</h4>
                      <span className="text-[10px] text-slate-400">{c.modulesCount || 0} Modules</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-300 font-medium">{c.category?.name || 'General'}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30 text-[10px]">
                      {c.level}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-white">₹{c.price}</td>
                  <td className="p-4 text-slate-300">{c.enrolledStudentsCount || 0} enrolled</td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => {
                        setSelectedCourseForModules(c);
                        setModuleModalOpen(true);
                      }}
                      className="p-2 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white transition-colors"
                      title="Add Modules / Lessons"
                    >
                      <Layers className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(c)}
                      className="p-2 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-slate-950 transition-colors"
                      title="Edit Course"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(c._id)}
                      className="p-2 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white transition-colors"
                      title="Delete Course"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT COURSE MODAL */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-2xl rounded-3xl p-6 border-amber-500/40 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingCourse ? 'Edit Course' : 'Create New Course'}
              </h3>
              <button onClick={() => setIsCourseModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Course Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Master Full-Stack MERN 2026"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Subtitle / Short Catchphrase</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Build production web apps with React & Node"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Level</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Price (INR)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Course Thumbnail Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnailFile(e.target.files[0])}
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Full Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingCourse ? 'Save Changes' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODULE MODAL */}
      {moduleModalOpen && selectedCourseForModules && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 border-indigo-500/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">
                Add Module to: {selectedCourseForModules.title}
              </h3>
              <button onClick={() => setModuleModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateModule} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Module Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Module 1: REST API & Auth"
                  value={moduleTitle}
                  onChange={(e) => setModuleTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-600/30"
              >
                Add Module
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourseManager;
