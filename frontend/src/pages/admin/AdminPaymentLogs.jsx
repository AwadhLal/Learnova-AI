import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { DollarSign, Shield, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const AdminPaymentLogs = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await API.get('/admin/payments');
        if (res.data.success) {
          setPayments(res.data.payments);
        }
      } catch (err) {
        console.warn('Error fetching payment logs:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="space-y-1">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
          <Shield className="w-3.5 h-3.5" /> Razorpay Test Mode Audit
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-white">Financial Transaction Logs</h1>
        <p className="text-xs text-slate-400">Complete audit trail of orders created, signatures verified, and enrollments triggered.</p>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-bold border-b border-slate-800 uppercase text-[10px]">
              <tr>
                <th className="p-4">Transaction / Order ID</th>
                <th className="p-4">Student</th>
                <th className="p-4">Course</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {payments.map((p) => (
                <tr key={p._id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-4 font-mono text-[11px] text-indigo-300">
                    <div>{p.razorpayOrderId}</div>
                    <div className="text-[10px] text-slate-500">{p.razorpayPaymentId || 'N/A'}</div>
                  </td>
                  <td className="p-4 font-bold text-white">{p.user?.name || 'Student'}</td>
                  <td className="p-4 text-slate-300 font-medium">{p.course?.title || 'Course'}</td>
                  <td className="p-4 font-black text-emerald-400">₹{p.amount}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      p.status === 'successful'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : p.status === 'pending'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {p.status?.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 text-[11px]">{new Date(p.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPaymentLogs;
