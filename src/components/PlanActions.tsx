import React, { useState } from 'react';
import { Copy, Download, Trash2, Check, FileText } from 'lucide-react';
import { ResearchPlan } from '../types/index.ts';

interface PlanActionsProps {
  plan: ResearchPlan;
  onClear: () => void;
}

export const PlanActions: React.FC<PlanActionsProps> = ({ plan, onClear }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const formatTextExport = () => {
    return `================================================================================
PAPERPILOT - RESEARCH PAPER AGENT
STRUCTURED LITERATURE REVIEW PLAN
================================================================================
Topic: ${plan.topic}
Academic Level: ${plan.level}
${plan.focusDetails ? `Focus Scope: ${plan.focusDetails}\n` : ''}Generated: ${new Date(plan.generatedAt).toLocaleString()}
Note: Papers marked [verify] must be checked on Google Scholar before citing.
================================================================================

--------------------------------------------------------------------------------
1. CHAIN-OF-THOUGHT REASONING STEPS
--------------------------------------------------------------------------------
${plan.reasoningSteps}

--------------------------------------------------------------------------------
2. FINAL LITERATURE REVIEW PLAN
--------------------------------------------------------------------------------
${plan.finalAnswer}

================================================================================
Generated with PaperPilot Research Agent.
`;
  };

  const handleCopy = () => {
    const text = formatTextExport();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadTxt = () => {
    const text = formatTextExport();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeTopic = plan.topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
    link.href = url;
    link.download = `paperpilot-${safeTopic || 'plan'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadMd = () => {
    const mdContent = `# Literature Review Plan: ${plan.topic}

> **Academic Level:** ${plan.level}
> **Generated:** ${new Date(plan.generatedAt).toLocaleString()}
> **Notice:** Papers marked \`[verify]\` must be checked on Google Scholar before citing.

---

## Reasoning Steps (Chain-of-Thought)
${plan.reasoningSteps}

---

## Final Literature Review Plan
${plan.finalAnswer}
`;

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeTopic = plan.topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
    link.href = url;
    link.download = `paperpilot-${safeTopic || 'plan'}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Plan Actions:
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Copy to clipboard */}
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 hover:text-slate-900 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-600 dark:text-emerald-400">Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-slate-500" />
              <span>Copy to Clipboard</span>
            </>
          )}
        </button>

        {/* Download as .txt */}
        <button
          type="button"
          onClick={handleDownloadTxt}
          title="Download plain text file"
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 hover:text-slate-900 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          <Download className="h-3.5 w-3.5 text-slate-500" />
          <span>Download as .txt</span>
        </button>

        {/* Download as .md */}
        <button
          type="button"
          onClick={handleDownloadMd}
          title="Download markdown file"
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 hover:text-slate-900 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          <FileText className="h-3.5 w-3.5 text-slate-500" />
          <span>Download as .md</span>
        </button>

        {/* Clear Button */}
        <button
          type="button"
          onClick={onClear}
          title="Clear current plan"
          className="flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50/60 px-3 py-1.5 text-xs font-semibold text-rose-700 shadow-2xs transition hover:bg-rose-100 hover:text-rose-800 active:scale-95 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/50"
        >
          <Trash2 className="h-3.5 w-3.5 text-rose-500" />
          <span>Clear</span>
        </button>
      </div>
    </div>
  );
};
