import React from 'react';
import { BookOpen, History, ExternalLink, Sparkles, GraduationCap } from 'lucide-react';

interface HeaderProps {
  historyCount: number;
  onToggleHistory: () => void;
  isHistoryOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  historyCount,
  onToggleHistory,
  isHistoryOpen,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-indigo-600 to-indigo-800 text-white shadow-md shadow-indigo-500/20">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 font-sans">
                PaperPilot
              </h1>
              <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                Research Agent
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Chain-of-thought literature-review architecture
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="https://scholar.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <span>Google Scholar</span>
            <ExternalLink className="h-3 w-3" />
          </a>

          <button
            type="button"
            onClick={onToggleHistory}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition active:scale-95 ${
              isHistoryOpen
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
            }`}
          >
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
