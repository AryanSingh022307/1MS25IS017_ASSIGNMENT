import React from 'react';
import { AlertCircle, RotateCcw, X } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onRetry, onDismiss }) => {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-4 shadow-xs dark:border-rose-900/60 dark:bg-rose-950/40">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-600 text-white shadow-xs">
          <AlertCircle className="h-5 w-5" />
        </div>
        <div className="flex-1 text-sm">
          <h4 className="font-semibold text-rose-900 dark:text-rose-200">
            Literature Plan Generation Notice
          </h4>
          <p className="mt-1 text-xs text-rose-800 dark:text-rose-300">
            {message}
          </p>

          {onRetry && (
            <div className="mt-3">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 transition active:scale-95"
              >
                <RotateCcw className="h-3 w-3" />
                Retry Generation
              </button>
            </div>
          )}
        </div>

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="text-rose-400 hover:text-rose-600 dark:hover:text-rose-200 p-1"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};
