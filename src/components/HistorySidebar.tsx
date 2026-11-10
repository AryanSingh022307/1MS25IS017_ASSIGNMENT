import React, { useState } from 'react';
import { History, X, Trash2, Clock, Search, ChevronRight, GraduationCap } from 'lucide-react';
import { ResearchPlan } from '../types/index.ts';

interface HistorySidebarProps {
  history: ResearchPlan[];
  activePlanId: string | null;
  onSelectPlan: (plan: ResearchPlan) => void;
  onDeletePlan: (id: string, e: React.MouseEvent) => void;
  onClearHistory: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
  history,
  activePlanId,
  onSelectPlan,
  onDeletePlan,
  onClearHistory,
  isOpen,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredHistory = history.filter((item) =>
    item.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.level.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-80 max-w-[85vw] flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 transition-transform duration-200 ease-in-out lg:static lg:z-auto lg:h-full lg:w-80 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:hidden'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <History className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Session History
              </h2>
              <p className="text-[11px] text-slate-500">
                {history.length} {history.length === 1 ? 'research plan' : 'research plans'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        {history.length > 0 && (
          <div className="p-3 border-b border-slate-100 dark:border-slate-800/80">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search past topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-2 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>
          </div>
        )}

        {/* List of items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center p-4">
              <Clock className="h-8 w-8 text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                No research topics yet
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                Generated literature plans will appear here during this session.
              </p>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              No topics match "{searchTerm}".
            </div>
          ) : (
            filteredHistory.map((item) => {
              const isActive = item.id === activePlanId;
              const formattedTime = new Date(item.generatedAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectPlan(item);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`group relative flex cursor-pointer flex-col rounded-xl border p-3 transition-all ${
                    isActive
                      ? 'border-indigo-400/80 bg-indigo-50/70 shadow-xs dark:border-indigo-700 dark:bg-indigo-950/40'
                      : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className={`text-xs font-semibold line-clamp-2 ${
                        isActive
                          ? 'text-indigo-900 dark:text-indigo-200'
                          : 'text-slate-800 group-hover:text-indigo-600 dark:text-slate-200 dark:group-hover:text-indigo-400'
                      }`}
                    >
                      {item.topic}
                    </h3>

                    <button
                      type="button"
                      onClick={(e) => onDeletePlan(item.id, e)}
                      title="Delete from history"
                      className="opacity-0 group-hover:opacity-100 rounded-sm p-1 text-slate-400 hover:text-rose-500 transition-opacity shrink-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium">
                      <GraduationCap className="h-3 w-3 text-slate-400" />
                      {item.level}
                    </span>
                    <span className="flex items-center gap-1 text-[10px]">
                      <Clock className="h-2.5 w-2.5 text-slate-400" />
                      {formattedTime}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="border-t border-slate-200 p-3 dark:border-slate-800">
            <button
              type="button"
              onClick={onClearHistory}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-1.5 text-xs font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition dark:border-slate-700 dark:text-slate-400 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear Session History</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
