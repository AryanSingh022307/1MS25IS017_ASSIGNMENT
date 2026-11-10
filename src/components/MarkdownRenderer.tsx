import React, { useMemo } from 'react';
import { marked } from 'marked';
import { ExternalLink } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  highlightVerify?: boolean;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = '',
  highlightVerify = true,
}) => {
  const htmlContent = useMemo(() => {
    if (!content) return '';

    // Configure marked options
    marked.setOptions({
      gfm: true,
      breaks: true,
    });

    let processedText = content;

    // Convert [verify] to a styled badge with scholar search link if highlightVerify is true
    if (highlightVerify) {
      // Matches [verify] or [Verify]
      processedText = processedText.replace(/\[verify\]/gi, (match) => {
        return `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700/50 shadow-xs cursor-pointer hover:bg-amber-200 transition-colors" data-verify-tag="true" title="Must be checked on Google Scholar before citing">${match}</span>`;
      });
    }

    const rawHtml = marked.parse(processedText) as string;
    return rawHtml;
  }, [content, highlightVerify]);

  // Handle click on verify badges to open Google Scholar search
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const verifySpan = target.closest('[data-verify-tag="true"]');
    if (verifySpan) {
      // Find the surrounding line / paper text
      const parentLiOrP = verifySpan.closest('li, p, tr');
      let searchQuery = '';
      if (parentLiOrP) {
        // Extract text and strip out [verify]
        searchQuery = (parentLiOrP.textContent || '').replace(/\[verify\]/gi, '').trim();
        // Keep first 120 chars if too long
        if (searchQuery.length > 120) {
          searchQuery = searchQuery.substring(0, 120);
        }
      }
      if (!searchQuery) {
        searchQuery = 'literature review';
      }
      const url = `https://scholar.google.com/scholar?q=${encodeURIComponent(searchQuery)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`prose prose-slate dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 
        prose-headings:text-slate-900 dark:prose-headings:text-slate-100 
        prose-h1:text-2xl prose-h1:font-bold prose-h1:tracking-tight prose-h1:border-b prose-h1:border-slate-200 dark:prose-h1:border-slate-800 prose-h1:pb-3 prose-h1:mb-5
        prose-h2:text-xl prose-h2:font-semibold prose-h2:mt-6 prose-h2:mb-3 prose-h2:text-indigo-900 dark:prose-h2:text-indigo-300
        prose-h3:text-lg prose-h3:font-medium prose-h3:mt-4 prose-h3:mb-2 prose-h3:text-slate-800 dark:prose-h3:text-slate-200
        prose-p:leading-relaxed prose-p:my-2
        prose-ul:my-2 prose-ul:list-disc prose-ul:pl-5
        prose-ol:my-2 prose-ol:list-decimal prose-ol:pl-5
        prose-li:my-1
        prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-50/50 dark:prose-blockquote:bg-indigo-950/20 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r prose-blockquote:italic
        prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:text-indigo-600 dark:prose-code:text-indigo-400
        prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
        prose-table:w-full prose-table:border-collapse prose-table:my-4 prose-table:text-sm
        prose-th:bg-slate-100 dark:prose-th:bg-slate-800/80 prose-th:p-2.5 prose-th:border prose-th:border-slate-200 dark:prose-th:border-slate-700 prose-th:text-left prose-th:font-semibold
        prose-td:p-2.5 prose-td:border prose-td:border-slate-200 dark:prose-td:border-slate-700
        ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};
