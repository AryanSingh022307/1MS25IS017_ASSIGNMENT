import React, { useEffect, useState } from 'react';
import { Loader2, Brain, Compass, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { AcademicLevel } from '../types/index.ts';

interface LoadingStateProps {
  topic: string;
  level: AcademicLevel;
}

const STEPS = [
  { label: 'Deconstructing core variables and research scope', icon: Brain },
  { label: 'Calibrating depth and theoretical rigor for academic level', icon: BookOpen },
  { label: 'Formulating Boolean database search strings & indexers', icon: Compass },
  { label: 'Taxonomizing seminal milestones vs. contemporary frontier', icon: Layers },
  { label: 'Synthesizing literature review matrix & research gaps', icon: CheckCircle2 },
];

export const LoadingState: React.FC<LoadingStateProps> = ({ topic, level }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="rounded-2xl border border-indigo-100 bg-linear-to-b from-indigo-50/60 to-white p-8 sm:p-10 text-center shadow-xs dark:border-indigo-900/40 dark:from-indigo-950/20 dark:to-slate-900">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 animate-pulse">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>

      <div className="mt-5 max-w-lg mx-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
          <Brain className="h-3.5 w-3.5" />
          Chain-of-Thought Literature Review Synthesis
        </span>

        <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
          Analyzing: "{topic}"
        </h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Target Level: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{level}</span> • Applying academic few-shot reasoning models
        </p>

        {/* Step Progression */}
        <div className="mt-6 space-y-2.5 text-left bg-white/80 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200/80 dark:border-slate-700/60 shadow-2xs">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 text-xs transition-colors duration-300 ${
                  isCurrent
                    ? 'font-semibold text-indigo-600 dark:text-indigo-400'
                    : isCompleted
                    ? 'text-slate-600 dark:text-slate-400 line-through opacity-70'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    isCurrent
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 ring-2 ring-indigo-500'
                      : isCompleted
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                  }`}
                >
                  {isCompleted ? '✓' : <Icon className="h-3 w-3" />}
                </div>
                <span className="truncate">{step.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
