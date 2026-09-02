import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Users, Search, Shield, Flame, CheckCircle, Ban, CheckCircle2 } from 'lucide-react';

const AdminStudentManager = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { addToast } = useToast();

  useEffect(() => {
    fetchStudents();
  }, [search]);

  const fetchStudents = async () => {
    try {
      const res = await API.get(`/admin/students?search=${encodeURIComponent(search)}`);
      if (res.data.success) {
        setStudents(res.data.students);
      }
    } catch (err) {
      console.warn('Error fetching students:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (studentId) => {
    try {
      const res = await API.put(`/admin/students/${studentId}/status`);
      if (res.data.success) {
        addToast(res.data.message, 'success');
        fetchStudents();
      }
    } catch (err) {
      addToast('Failed to change student status', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" /> User Access Management
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-white">Registered Students</h1>
          <p className="text-xs text-slate-400">View student learning stats and manage account access.</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-bold border-b border-slate-800 uppercase text-[10px]">
              <tr>
                <th className="p-4">Student Profile</th>
                <th className="p-4">Email</th>
                <th className="p-4">Streak</th>
                <th className="p-4">Enrollments</th>
                <th className="p-4">Account Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {students.map((st) => (
                <tr key={st._id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <img src={st.avatar} alt={st.name} className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                    <div>
                      <h4 className="font-bold text-white">{st.name}</h4>
                      <span className="text-[10px] text-slate-400">Joined {new Date(st.createdAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-300 font-medium">{st.email}</td>
                  <td className="p-4">
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <Flame className="w-4 h-4 fill-amber-400" /> {st.streak || 0} Days
                    </span>
                  </td>
                  <td className="p-4 text-slate-300 font-bold">{st.enrollmentsCount || 0} courses</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      st.isVerified
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {st.isVerified ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleToggleStatus(st._id)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors flex items-center gap-1 ml-auto ${
                        st.isVerified
                          ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white'
                          : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-white'
                      }`}
                    >
                      {st.isVerified ? <><Ban className="w-3.5 h-3.5" /> Deactivate</> : <><CheckCircle2 className="w-3.5 h-3.5" /> Activate</>}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminStudentManager;
