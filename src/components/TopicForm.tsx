import React, { useState } from 'react';
import { Sparkles, GraduationCap, Compass, BookOpen, Layers } from 'lucide-react';
import { AcademicLevel } from '../types/index.ts';

interface TopicFormProps {
  topic: string;
  setTopic: (t: string) => void;
  level: AcademicLevel;
  setLevel: (l: AcademicLevel) => void;
  focusDetails: string;
  setFocusDetails: (f: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onClear: () => void;
  hasActivePlan: boolean;
}

const SAMPLE_TOPICS = [
  {
    topic: 'Transformer-based reinforcement learning for robotic manipulation',
    level: 'PhD' as AcademicLevel,
    field: 'Robotics & Deep RL',
  },
  {
    topic: 'Retrieval-Augmented Generation (RAG) mitigation of LLM hallucinations',
    level: 'Masters' as AcademicLevel,
    field: 'NLP / Generative AI',
  },
  {
    topic: 'Impact of Microplastics on Freshwater Aquatic Ecosystems',
    level: 'Undergraduate' as AcademicLevel,
    field: 'Environmental Science',
  },
  {
    topic: 'Zero-Knowledge Proofs for Privacy-Preserving Healthcare Data Sharing',
    level: 'Masters' as AcademicLevel,
    field: 'Applied Cryptography',
  },
  {
    topic: 'CRISPR-Cas9 Off-Target Effect Mitigation in Human Gene Therapy',
    level: 'PhD' as AcademicLevel,
    field: 'Biotechnology & Genomics',
  },
];

export const TopicForm: React.FC<TopicFormProps> = ({
  topic,
  setTopic,
  level,
  setLevel,
  focusDetails,
  setFocusDetails,
  onSubmit,
  isLoading,
  onClear,
  hasActivePlan,
}) => {
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const handleSelectSample = (sample: typeof SAMPLE_TOPICS[0]) => {
    setTopic(sample.topic);
    setLevel(sample.level);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="space-y-4">
        {/* Main Topic Input */}
        <div>
          <label
            htmlFor="research-topic-input"
            className="flex items-center justify-between text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
          >
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              Research Topic or Thesis Question
            </span>
            <span className="text-xs font-normal text-slate-500">Required</span>
          </label>
          <div className="relative">
            <textarea
              id="research-topic-input"
              rows={3}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Diffusion models for medical image synthesis, or Transformer-based RL for dexterous robotic manipulation..."
              className="w-full resize-none rounded-xl border border-slate-300 bg-slate-50/50 p-3.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-hidden focus:ring-3 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-indigo-400 dark:focus:bg-slate-900"
              required
            />
          </div>
        </div>

        {/* Level Dropdown and Secondary Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="academic-level-select"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              <GraduationCap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              Academic Level / Target Depth
            </label>
            <select
              id="academic-level-select"
              value={level}
              onChange={(e) => setLevel(e.target.value as AcademicLevel)}
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 px-3 text-sm font-medium text-slate-800 focus:border-indigo-500 focus:outline-hidden focus:ring-3 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="Undergraduate">Undergraduate (Foundations, Surveys, Core Textbooks)</option>
              <option value="Masters">Masters (SOTA Benchmarks, Empirical Synthesis, 3-5 Yr Trends)</option>
              <option value="PhD">PhD (Epistemic Critique, Theory Gaps, Novel RQ Formulations)</option>
            </select>
            <p className="mt-1 text-[11px] text-slate-500">
              {level === 'Undergraduate' && 'Calibrated for seminal overviews and foundational comprehension.'}
              {level === 'Masters' && 'Calibrated for comprehensive state-of-the-art methodology comparisons.'}
              {level === 'PhD' && 'Calibrated for frontier research gaps and epistemic critique.'}
            </p>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 mt-1 mb-1.5"
              >
                <Compass className="h-3.5 w-3.5" />
                {showAdvanced ? 'Hide Additional Focus' : '+ Add Optional Focus / Methodology Scope'}
              </button>
              <p className="text-[11px] text-slate-500">
                Specify constraints like empirical vs theoretical, target conference venues, or geographical scope.
              </p>
            </div>

            {hasActivePlan && (
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={onClear}
                  className="text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 font-medium hover:underline"
                >
                  Clear Active Plan
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Collapsible Advanced Focus details */}
        {showAdvanced && (
          <div className="pt-1">
            <label
              htmlFor="focus-details-input"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
            >
              Methodological or Domain Focus (Optional)
            </label>
            <input
              id="focus-details-input"
              type="text"
              value={focusDetails}
              onChange={(e) => setFocusDetails(e.target.value)}
              placeholder="e.g. Focus on benchmark datasets from 2022-2026, or prioritize qualitative longitudinal studies"
              className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2 px-3 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200"
            />
          </div>
        )}

        {/* Quick Sample Topics */}
        <div className="pt-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Explore Example Topics:
          </span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_TOPICS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/70 px-2.5 py-1 text-xs text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-900 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-indigo-700 dark:hover:text-indigo-200"
              >
                <span className="font-medium truncate max-w-[200px] sm:max-w-xs">{sample.topic}</span>
                <span className="text-[10px] rounded px-1.5 py-0.2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 font-mono">
                  {sample.level}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <button
            type="submit"
            disabled={isLoading || !topic.trim()}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 via-indigo-700 to-indigo-800 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:shadow-lg hover:shadow-indigo-500/30 hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            <span>{isLoading ? 'Generating Literature Plan...' : 'Generate Literature Review Plan'}</span>
          </button>
        </div>
      </div>
    </form>
  );
};
