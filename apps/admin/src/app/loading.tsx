import * as React from "react";

export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-3 w-24 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="h-7 w-72 rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="h-3 w-96 rounded-full bg-slate-300 dark:bg-slate-700" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="h-3 w-28 rounded-full bg-slate-200 dark:bg-slate-700" />
            <div className="h-8 w-32 rounded-lg bg-slate-200 dark:bg-slate-700" />
          </div>
        ))}
      </div>
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 w-full rounded-xl bg-slate-100 dark:bg-slate-800 mb-2" />
        ))}
      </div>
    </div>
  );
}

