import React, { useMemo } from 'react';
import { marked } from 'marked';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  // Pre-process custom badges and highlight tags before rendering marked HTML
  const processedHtml = useMemo(() => {
    if (!content) return '';

    // Configure marked options for clean tables and breaks
    marked.setOptions({
      gfm: true,
      breaks: true,
    });

    let rawHtml = marked.parse(content) as string;

    // Enhance standard section tags and risk badges
    rawHtml = rawHtml
      // Confirmed statutory position badge
      .replace(
        /\[Confirmed Statutory Position\]/gi,
        '<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 mr-1.5"><svg class="w-3 h-3 mr-1 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>Confirmed Statutory Position</span>'
      )
      // Likely judicial interpretation badge
      .replace(
        /\[Likely Judicial Interpretation\]/gi,
        '<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 mr-1.5"><svg class="w-3 h-3 mr-1 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>Likely Judicial Interpretation</span>'
      )
      // Requires verification badge
      .replace(
        /\[Requires Verification\]|\[Requires professional\/legal verification\]/gi,
        '<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 mr-1.5"><svg class="w-3 h-3 mr-1 text-rose-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>Requires Verification</span>'
      )
      // High Risk badge
      .replace(
        /(###\s*HIGH|\*\*HIGH RISK\*\*|Risk Level:\s*HIGH)/gi,
        '<span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-red-950/70 text-red-300 border border-red-500/50 shadow-sm"><span class="w-2 h-2 rounded-full bg-red-500 animate-pulse mr-1.5"></span>HIGH RISK</span>'
      )
      // Medium Risk badge
      .replace(
        /(###\s*MEDIUM|\*\*MEDIUM RISK\*\*|Risk Level:\s*MEDIUM)/gi,
        '<span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-amber-950/70 text-amber-300 border border-amber-500/50 shadow-sm"><span class="w-2 h-2 rounded-full bg-amber-500 mr-1.5"></span>MEDIUM RISK</span>'
      )
      // Low Risk badge
      .replace(
        /(###\s*LOW|\*\*LOW RISK\*\*|Risk Level:\s*LOW)/gi,
        '<span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-950/70 text-emerald-300 border border-emerald-500/50 shadow-sm"><span class="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>LOW RISK</span>'
      )
      // Confidence: High / Moderate / Low
      .replace(
        /\*\*Confidence:\*\*\s*(High|Moderate|Low)/gi,
        (_match, level) => {
          const colorClass =
            level.toLowerCase() === 'high'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : level.toLowerCase() === 'moderate'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-rose-500/20 text-rose-300 border-rose-500/40';
          return `<div class="my-4 p-3 rounded-lg border ${colorClass} flex items-center justify-between"><div class="flex items-center space-x-2"><span class="font-bold text-xs uppercase tracking-wider">Analytical Confidence:</span> <span class="font-extrabold text-sm">${level}</span></div><span class="text-xs opacity-80">Subject to professional verification</span></div>`;
        }
      );

    return rawHtml;
  }, [content]);

  return (
    <div
      className={`prose prose-invert max-w-none 
        prose-headings:text-slate-100 prose-headings:font-bold prose-headings:tracking-tight
        prose-h1:text-2xl prose-h1:border-b prose-h1:border-slate-800 prose-h1:pb-3 prose-h1:text-amber-300
        prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3 prose-h2:text-amber-200
        prose-h3:text-lg prose-h3:mt-5 prose-h3:mb-2 prose-h3:text-slate-200
        prose-h4:text-base prose-h4:font-semibold prose-h4:text-slate-300
        prose-p:text-slate-300 prose-p:leading-relaxed prose-p:text-sm
        prose-ul:text-slate-300 prose-ul:text-sm prose-ul:my-2
        prose-ol:text-slate-300 prose-ol:text-sm prose-ol:my-2
        prose-li:my-1
        prose-strong:text-slate-100 prose-strong:font-semibold
        prose-table:w-full prose-table:border-collapse prose-table:my-4 prose-table:text-xs prose-table:border prose-table:border-slate-800
        prose-th:bg-slate-900 prose-th:text-amber-300 prose-th:p-2.5 prose-th:text-left prose-th:font-semibold prose-th:border prose-th:border-slate-800
        prose-td:p-2.5 prose-td:border prose-td:border-slate-800/80 prose-td:text-slate-300 prose-td:align-top
        prose-blockquote:border-l-4 prose-blockquote:border-amber-500/60 prose-blockquote:bg-amber-950/20 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:text-amber-100 prose-blockquote:text-xs prose-blockquote:my-4
        prose-code:bg-slate-900 prose-code:text-amber-300 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono
        prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800 prose-pre:p-3 prose-pre:rounded-lg
        ${className}`}
      dangerouslySetInnerHTML={{ __html: processedHtml }}
    />
  );
};
