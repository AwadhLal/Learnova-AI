import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { 
  ArrowLeft, Plus, Edit3, Trash2, GripVertical, FileText, 
  Video, File, ChevronDown, ChevronRight, Upload, Play, Shield
} from 'lucide-react';

const AdminCurriculumManager = () => {
  const { courseId } = useParams();
  const { addToast } = useToast();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [moduleModal, setModuleModal] = useState({ open: false, isEdit: false, data: null });
  const [lessonModal, setLessonModal] = useState({ open: false, isEdit: false, data: null, moduleId: null });
  
  // Module Form
  const [modTitle, setModTitle] = useState('');
  const [modDesc, setModDesc] = useState('');
  
  // Lesson Form
  const [lesTitle, setLesTitle] = useState('');
  const [lesType, setLesType] = useState('video');
  const [lesContent, setLesContent] = useState('');
  const [lesVideoUrl, setLesVideoUrl] = useState('');
  const [lesDuration, setLesDuration] = useState(10);
  const [lesVideoFile, setLesVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Expand/Collapse state
  const [expandedModules, setExpandedModules] = useState({});

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      const res = await API.get(`/courses/${courseId}`);
      if (res.data.success) {
        setCourse(res.data.course);
        setModules(res.data.course.modules || []);
        
        // Expand all by default
        const expandObj = {};
        res.data.course.modules?.forEach(m => {
          expandObj[m._id] = true;
        });
        setExpandedModules(expandObj);
      }
    } catch (err) {
      addToast('Error fetching curriculum', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (id) => {
    setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // ----- MODULE CRUD -----
  const openAddModule = () => {
    setModTitle('');
    setModDesc('');
    setModuleModal({ open: true, isEdit: false, data: null });
  };

  const openEditModule = (m) => {
    setModTitle(m.title);
    setModDesc(m.description || '');
    setModuleModal({ open: true, isEdit: true, data: m });
  };

  const saveModule = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (moduleModal.isEdit) {
        await API.put(`/courses/modules/${moduleModal.data._id}`, { title: modTitle, description: modDesc });
        addToast('Module updated', 'success');
      } else {
        await API.post(`/courses/${courseId}/modules`, { title: modTitle, description: modDesc, order: modules.length + 1 });
        addToast('Module added', 'success');
      }
      setModuleModal({ open: false, isEdit: false, data: null });
      fetchCourseData();
    } catch (err) {
      addToast(err.response?.data?.message || 'Error saving module', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteModule = async (id) => {
    if (!window.confirm('Delete module and all its lessons?')) return;
    try {
      await API.delete(`/courses/modules/${id}`);
      addToast('Module deleted', 'success');
      fetchCourseData();
    } catch (err) {
      addToast('Error deleting module', 'error');
    }
  };

  const moveModule = async (index, direction) => {
    const newModules = [...modules];
    if (direction === 'up' && index > 0) {
      [newModules[index - 1], newModules[index]] = [newModules[index], newModules[index - 1]];
    } else if (direction === 'down' && index < newModules.length - 1) {
      [newModules[index + 1], newModules[index]] = [newModules[index], newModules[index + 1]];
    } else {
      return;
    }
    
    setModules(newModules);
    const payload = newModules.map((m, i) => ({ id: m._id, order: i + 1 }));
    try {
      await API.put(`/courses/${courseId}/modules/reorder`, { modules: payload });
      addToast('Order saved', 'success');
    } catch (err) {
      addToast('Error saving order', 'error');
      fetchCourseData(); // Revert
    }
  };

  // ----- LESSON CRUD -----
  const openAddLesson = (moduleId) => {
    setLesTitle('');
    setLesType('video');
    setLesContent('');
    setLesVideoUrl('');
    setLesDuration(10);
    setLesVideoFile(null);
    setLessonModal({ open: true, isEdit: false, data: null, moduleId });
  };

  const openEditLesson = (moduleId, l) => {
    setLesTitle(l.title);
    setLesType(l.type);
    setLesContent(l.content || '');
    setLesVideoUrl(l.videoUrl || '');
    setLesDuration(l.durationMinutes || 10);
    setLesVideoFile(null);
    setLessonModal({ open: true, isEdit: true, data: l, moduleId });
  };

  const saveLesson = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    let finalVideoUrl = lesVideoUrl;

    try {
      if (lesVideoFile && lesType === 'video') {
        setUploading(true);
        const formData = new FormData();
        formData.append('video', lesVideoFile);
        const upRes = await API.post('/courses/upload-video', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        finalVideoUrl = upRes.data.videoUrl;
        setUploading(false);
      }

      const payload = {
        title: lesTitle,
        type: lesType,
        content: lesContent,
        videoUrl: finalVideoUrl,
        durationMinutes: lesDuration
      };

      if (lessonModal.isEdit) {
        await API.put(`/courses/lessons/${lessonModal.data._id}`, payload);
        addToast('Lesson updated', 'success');
      } else {
        const mod = modules.find(m => m._id === lessonModal.moduleId);
        payload.order = mod.lessons?.length + 1 || 1;
        await API.post(`/courses/modules/${lessonModal.moduleId}/lessons`, payload);
        addToast('Lesson added', 'success');
      }
      setLessonModal({ open: false, isEdit: false, data: null, moduleId: null });
      fetchCourseData();
    } catch (err) {
      setUploading(false);
      addToast(err.response?.data?.message || 'Error saving lesson', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteLesson = async (id) => {
    if (!window.confirm('Delete this lesson?')) return;
    try {
      await API.delete(`/courses/lessons/${id}`);
      addToast('Lesson deleted', 'success');
      fetchCourseData();
    } catch (err) {
      addToast('Error deleting lesson', 'error');
    }
  };

  const moveLesson = async (moduleId, lessonIndex, direction) => {
    const mod = modules.find(m => m._id === moduleId);
    const newLessons = [...mod.lessons];
    
    if (direction === 'up' && lessonIndex > 0) {
      [newLessons[lessonIndex - 1], newLessons[lessonIndex]] = [newLessons[lessonIndex], newLessons[lessonIndex - 1]];
    } else if (direction === 'down' && lessonIndex < newLessons.length - 1) {
      [newLessons[lessonIndex + 1], newLessons[lessonIndex]] = [newLessons[lessonIndex], newLessons[lessonIndex + 1]];
    } else {
      return;
    }
    
    const newModules = modules.map(m => m._id === moduleId ? { ...m, lessons: newLessons } : m);
    setModules(newModules);
    
    const payload = newLessons.map((l, i) => ({ id: l._id, order: i + 1 }));
    try {
      await API.put(`/courses/modules/${moduleId}/lessons/reorder`, { lessons: payload });
      addToast('Order saved', 'success');
    } catch (err) {
      addToast('Error saving order', 'error');
      fetchCourseData(); // Revert
    }
  };

  if (loading) return <div className="text-center py-20 text-indigo-400 font-bold animate-pulse">Loading Curriculum...</div>;
  if (!course) return <div className="text-center py-20 text-rose-400">Course not found</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
        <Link to="/admin/courses" className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1">
            <Shield className="w-3 h-3" /> Curriculum Manager
          </span>
          <h1 className="text-2xl font-black text-white">{course.title}</h1>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={openAddModule}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Module
        </button>
      </div>

      {/* Curriculum List */}
      <div className="space-y-4">
        {modules.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-slate-800 rounded-3xl text-slate-400">
            <Layers className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="font-medium text-sm">No curriculum built yet.</p>
            <p className="text-xs opacity-60">Click 'Add Module' to get started.</p>
          </div>
        ) : (
          modules.map((mod, mIndex) => (
            <div key={mod._id} className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-lg transition-all">
              {/* Module Header */}
              <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between group">
                <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => toggleModule(mod._id)}>
                  {expandedModules[mod._id] ? <ChevronDown className="w-5 h-5 text-indigo-400" /> : <ChevronRight className="w-5 h-5 text-indigo-400" />}
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      Module {mIndex + 1}: {mod.title}
                    </h3>
                    {mod.description && <p className="text-[10px] text-slate-400 mt-0.5">{mod.description}</p>}
                  </div>
                </div>
                
                <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex flex-col border-r border-slate-800 pr-2 mr-2">
                    <button disabled={mIndex === 0} onClick={() => moveModule(mIndex, 'up')} className="text-slate-500 hover:text-white disabled:opacity-30"><ChevronDown className="w-3.5 h-3.5 rotate-180" /></button>
                    <button disabled={mIndex === modules.length - 1} onClick={() => moveModule(mIndex, 'down')} className="text-slate-500 hover:text-white disabled:opacity-30"><ChevronDown className="w-3.5 h-3.5" /></button>
                  </div>
                  <button onClick={() => openAddLesson(mod._id)} className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500 hover:text-white mr-1"><Plus className="w-4 h-4" /></button>
                  <button onClick={() => openEditModule(mod)} className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => deleteModule(mod._id)} className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>

              {/* Lessons List */}
              {expandedModules[mod._id] && (
                <div className="p-3 bg-slate-900/40 space-y-1.5">
                  {!mod.lessons || mod.lessons.length === 0 ? (
                    <div className="text-center py-4 text-xs text-slate-500">No lessons in this module.</div>
                  ) : (
                    mod.lessons.map((lesson, lIndex) => (
                      <div key={lesson._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 group transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-slate-400 shadow-inner border border-slate-800">
                            {lesson.type === 'video' ? <Video className="w-4 h-4 text-sky-400" /> : 
                             lesson.type === 'pdf' ? <File className="w-4 h-4 text-rose-400" /> : 
                             <FileText className="w-4 h-4 text-emerald-400" />}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-200">{lesson.title}</p>
                            <p className="text-[10px] text-slate-500 flex items-center gap-2">
                              <span className="uppercase">{lesson.type}</span>
                              {lesson.type === 'video' && <span>• {lesson.durationMinutes} min</span>}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex flex-col border-r border-slate-800 pr-1 mr-1">
                            <button disabled={lIndex === 0} onClick={() => moveLesson(mod._id, lIndex, 'up')} className="text-slate-500 hover:text-white disabled:opacity-30 p-0.5"><ChevronDown className="w-3.5 h-3.5 rotate-180" /></button>
                            <button disabled={lIndex === mod.lessons.length - 1} onClick={() => moveLesson(mod._id, lIndex, 'down')} className="text-slate-500 hover:text-white disabled:opacity-30 p-0.5"><ChevronDown className="w-3.5 h-3.5" /></button>
                          </div>
                          <button onClick={() => openEditLesson(mod._id, lesson)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"><Edit3 className="w-3.5 h-3.5" /></button>
                          <button onClick={() => deleteLesson(lesson._id)} className="p-1.5 rounded-lg text-rose-400/70 hover:bg-rose-500/10 hover:text-rose-400"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* MODULE MODAL */}
      {moduleModal.open && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">{moduleModal.isEdit ? 'Edit Module' : 'Add Module'}</h3>
            <form onSubmit={saveModule} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Module Title *</label>
                <input required type="text" value={modTitle} onChange={e => setModTitle(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-indigo-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Description</label>
                <textarea rows={2} value={modDesc} onChange={e => setModDesc(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-indigo-500" />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={() => setModuleModal({open: false})} className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white">Cancel</button>
                <button type="submit" disabled={submitting} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow">{submitting ? 'Saving...' : 'Save Module'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LESSON MODAL */}
      {lessonModal.open && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4">{lessonModal.isEdit ? 'Edit Lesson' : 'Add Lesson'}</h3>
            <form onSubmit={saveLesson} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Lesson Title *</label>
                <input required type="text" value={lesTitle} onChange={e => setLesTitle(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-indigo-500" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Content Type *</label>
                  <select value={lesType} onChange={e => setLesType(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-indigo-500">
                    <option value="video">Video</option>
                    <option value="text">Text Article</option>
                    <option value="pdf">PDF Document</option>
                  </select>
                </div>
                {lesType === 'video' && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Duration (Mins)</label>
                    <input type="number" required value={lesDuration} onChange={e => setLesDuration(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-indigo-500" />
                  </div>
                )}
              </div>

              {lesType === 'video' && (
                <div className="space-y-3 p-3 border border-slate-800 rounded-xl bg-slate-950/50">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Video Source URL (YouTube/Vimeo)</label>
                    <input type="text" value={lesVideoUrl} onChange={e => setLesVideoUrl(e.target.value)} placeholder="https://youtube.com/..." className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white outline-none focus:border-indigo-500" />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-slate-800"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-2 bg-slate-950/50 text-slate-500 font-medium">OR UPLOAD</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Upload Video (Cloudinary)</label>
                    <input type="file" accept="video/mp4,video/webm" onChange={e => setLesVideoFile(e.target.files[0])} className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-sky-500/20 file:text-sky-400 hover:file:bg-sky-500/30" />
                    {lesVideoFile && <p className="text-[10px] text-amber-400 mt-1">Video will be uploaded on save.</p>}
                  </div>
                </div>
              )}

              {(lesType === 'text' || lesType === 'pdf') && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    {lesType === 'text' ? 'Article Content (Markdown supported)' : 'PDF / Resource URL'}
                  </label>
                  <textarea 
                    rows={6} 
                    required 
                    value={lesContent} 
                    onChange={e => setLesContent(e.target.value)} 
                    placeholder={lesType === 'pdf' ? "Enter URL to PDF document..." : "Write your lesson content here..."}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-indigo-500" 
                  />
                </div>
              )}

              <div className="flex gap-2 justify-end pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setLessonModal({open: false})} className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white">Cancel</button>
                <button type="submit" disabled={submitting || uploading} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow disabled:opacity-50 flex items-center gap-2">
                  {(submitting || uploading) && <span className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>}
                  {uploading ? 'Uploading Video...' : submitting ? 'Saving...' : 'Save Lesson'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCurriculumManager;
