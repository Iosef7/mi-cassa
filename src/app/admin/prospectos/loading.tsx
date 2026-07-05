import { Users, Inbox, Target, CheckSquare } from 'lucide-react';

export default function LoadingProspectos() {
  return (
    <div className="p-8 overflow-auto animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="h-9 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse mb-2"></div>
          <div className="h-5 w-72 bg-slate-100 dark:bg-slate-800/50 rounded-lg animate-pulse"></div>
        </div>
        <div className="h-10 w-40 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse"></div>
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card p-5 rounded-xl border border-border shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse flex-shrink-0"></div>
            <div className="space-y-2 w-full">
              <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
              <div className="h-6 w-16 bg-slate-300 dark:bg-slate-600 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls Skeleton */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse"></div>
        <div className="w-full sm:w-48 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse"></div>
        <div className="w-full sm:w-32 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse"></div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="h-12 border-b border-border bg-muted/50"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center p-4 border-b border-border gap-4">
            <div className="w-4 h-4 rounded bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                <div className="h-3 w-24 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="hidden sm:block flex-1">
              <div className="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
            </div>
            <div className="hidden md:block flex-1">
              <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
