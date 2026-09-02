import React from 'react';

export const CourseCardSkeleton = () => (
  <div className="glass-panel rounded-2xl p-4 space-y-4 animate-pulse">
    <div className="w-full h-44 bg-slate-800 rounded-xl" />
    <div className="h-4 bg-slate-800 rounded w-1/3" />
    <div className="h-6 bg-slate-800 rounded w-3/4" />
    <div className="h-3 bg-slate-800 rounded w-full" />
    <div className="h-3 bg-slate-800 rounded w-2/3" />
    <div className="pt-4 flex items-center justify-between border-t border-slate-800/80">
      <div className="h-4 bg-slate-800 rounded w-1/4" />
      <div className="h-8 bg-slate-800 rounded-lg w-1/3" />
    </div>
  </div>
);

export const DashboardStatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="glass-panel p-5 rounded-2xl space-y-3">
        <div className="h-4 bg-slate-800 rounded w-1/2" />
        <div className="h-8 bg-slate-800 rounded w-1/3" />
      </div>
    ))}
  </div>
);
