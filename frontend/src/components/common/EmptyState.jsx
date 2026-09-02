import React from 'react';
import { BookOpen } from 'lucide-react';

const EmptyState = ({ title = 'No items found', description = 'There are no items matching your request at the moment.', icon: Icon = BookOpen, actionButton }) => {
  return (
    <div className="glass-panel rounded-3xl p-12 text-center max-w-lg mx-auto my-8 space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto">
        <Icon className="w-8 h-8 text-indigo-400" />
      </div>
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">{description}</p>
      {actionButton && <div className="pt-2">{actionButton}</div>}
    </div>
  );
};

export default EmptyState;
