import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  Sparkles,
  RefreshCw,
  BookOpen,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';

interface QuickSectionLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickSectionLookupModal: React.FC<QuickSectionLookupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const [lawType, setLawType] = useState('Income Tax Act, 1961');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keyboard shortcut listener for Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const handleLookup = async (searchTarget?: string) => {
    const target = searchTarget || query;
    if (!target.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/advisory/section-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionQuery: target,
          lawType,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to lookup section');
      }

      setResult(data.result);
    } catch (err: any) {
      setError(err.message || 'Error executing section query.');
    } finally {
      setIsLoading(false);
    }
  };

  const popularSections = [
    { label: 'S. 43B(h) (MSME 45-day payment)', query: 'Section 43B(h) deduction of payment to MSME micro and small enterprises within 45/15 days' },
    { label: 'S. 194R (Perquisites in Business)', query: 'Section 194R TDS on benefit or perquisite in respect of business or profession' },
    { label: 'S. 54F (Capital Gains Exemption)', query: 'Section 54F long term capital gains exemption on purchase of residential house' },
    { label: 'S. 17(5) (GST Blocked Credits)', query: 'Section 17(5) of CGST Act blocked input tax credit on motor vehicles and food' },
    { label: 'S. 185/186 (Loans to Directors)', query: 'Companies Act 2013 Section 185 loans to directors and Section 186 inter-corporate loans' },
    { label: 'S. 50B (Slump Sale & Rule 11UAE)', query: 'Section 50B computation of capital gains in case of slump sale and Rule 11UAE' },
    { label: 'S. 194Q vs 206C(1H)', query: 'Interplay of Section 194Q TDS on goods and Section 206C(1H) TCS on goods' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/90 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Statutory Section &amp; Rule Researcher
              </h3>
              <p className="text-xs text-slate-400">
                Verified Indian statutory thresholds, circulars, and disallowances
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Search Bar */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleLookup();
                }}
                placeholder="Enter section number or topic (e.g. 43B(h), 194R, 54F, 17(5))..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 font-mono focus:outline-none focus:border-amber-500"
                autoFocus
              />
            </div>

            <select
              value={lawType}
              onChange={(e) => setLawType(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="Income Tax Act, 1961">Income Tax Act, 1961</option>
              <option value="CGST / IGST Act, 2017">GST Acts, 2017</option>
              <option value="Companies Act, 2013">Companies Act, 2013</option>
              <option value="FEMA / RBI Regulations">FEMA 1999 &amp; RBI</option>
            </select>

            <button
              onClick={() => handleLookup()}
              disabled={isLoading || !query.trim()}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex items-center space-x-1.5 disabled:opacity-50"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>Lookup</span>
            </button>
          </div>

          {/* Popular Section Quick Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] text-slate-400 font-medium mr-1">Quick:</span>
            {popularSections.map((sec, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(sec.label);
                  handleLookup(sec.query);
                }}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              >
                {sec.label}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Results Body */}
        <div className="p-5 overflow-y-auto flex-1 max-h-[60vh]">
          {isLoading ? (
            <div className="py-12 text-center space-y-3">
              <RefreshCw className="w-6 h-6 animate-spin text-amber-400 mx-auto" />
              <p className="text-xs text-slate-400">
                Retrieving verified statutory text, current threshold, and notifications...
              </p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-900 text-rose-300 text-xs">
              {error}
            </div>
          ) : result ? (
            <div className="space-y-4">
              <MarkdownRenderer content={result} />
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs space-y-2">
              <p>Type any section number or click a quick chip above to retrieve the current statutory position.</p>
              <p className="text-[11px] text-slate-500">
                Grounds in Income-tax Act, 1961 (as amended up to Finance (No. 2) Act 2024), CGST Act 2017, and Companies Act 2013.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-[11px] text-slate-400">
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px]">Esc</kbd> to close</span>
          <span className="text-amber-400/80">Source verification required before relying on statutory conclusions</span>
        </div>
      </div>
    </div>
  );
};
