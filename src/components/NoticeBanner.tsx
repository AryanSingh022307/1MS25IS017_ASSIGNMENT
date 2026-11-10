import React from 'react';
import { AlertTriangle, ExternalLink, Info } from 'lucide-react';

interface NoticeBannerProps {
  onLearnMore?: () => void;
}

export const NoticeBanner: React.FC<NoticeBannerProps> = () => {
  return (
    <div className="relative overflow-hidden rounded-xl border border-amber-200 bg-linear-to-r from-amber-50/90 via-amber-50/60 to-orange-50/70 p-4 shadow-xs dark:border-amber-900/60 dark:from-amber-950/40 dark:via-amber-950/20 dark:to-orange-950/20">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-white shadow-xs dark:bg-amber-600">
          <AlertTriangle className="h-4.5 w-4.5" />
        </div>
        <div className="flex-1 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-amber-900 dark:text-amber-200">
              Citation Verification Notice:
            </span>
            <span className="inline-flex items-center gap-1 rounded bg-amber-200/80 px-2 py-0.5 font-mono text-xs font-bold text-amber-900 dark:bg-amber-900/70 dark:text-amber-200">
              Papers marked [verify] must be checked on Google Scholar before citing.
            </span>
          </div>
          <p className="mt-1 text-xs text-amber-800/90 dark:text-amber-300/80">
            AI-suggested citations may contain slight bibliographic drift. Always confirm authors, publication years, and venue DOIs directly on academic indexers before including in manuscripts or bibliographies. You can click any <span className="underline decoration-dotted font-medium">[verify]</span> tag below to open Google Scholar.
          </p>
        </div>
        <a
          href="https://scholar.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-amber-900 hover:text-amber-950 underline shrink-0 dark:text-amber-300 dark:hover:text-amber-200"
        >
          Google Scholar <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
};
