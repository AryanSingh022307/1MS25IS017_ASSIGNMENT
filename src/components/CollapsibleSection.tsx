import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check, Sparkles } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer.tsx';

interface CollapsibleSectionProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  content: string;
  badge?: string;
  badgeColor?: 'indigo' | 'emerald' | 'amber' | 'slate';
  defaultOpen?: boolean;
  highlightVerify?: boolean;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  subtitle,
  icon,
  content,
  badge,
  badgeColor = 'indigo',
  defaultOpen = true,
  highlightVerify = true,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const badgeColorClasses = {
    indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    amber: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  }[badgeColor];

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-xs transition-all dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex w-full items-center justify-between gap-4 p-4 text-left transition hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className="flex flex-1 items-center gap-3 min-w-0 text-left cursor-pointer focus:outline-hidden"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 shadow-2xs">
            {icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {title}
              </h2>
              {badge && (
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${badgeColorClasses}`}>
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </button>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            title="Copy section content"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-400" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Collapse section' : 'Expand section'}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-slate-200/80 p-5 sm:p-6 bg-slate-50/40 dark:border-slate-800 dark:bg-slate-950/30">
          <MarkdownRenderer content={content} highlightVerify={highlightVerify} />
        </div>
      )}
    </div>
  );
};
