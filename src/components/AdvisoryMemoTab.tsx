import React, { useState, useEffect } from 'react';
import {
  FileText,
  Printer,
  Copy,
  Check,
  Download,
  Sparkles,
  RefreshCw,
  Building,
  UserCheck,
  Calendar,
  Layers,
} from 'lucide-react';
import { AdvisoryContext } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { SAMPLE_PRESETS } from '../data/samplePresets';

interface AdvisoryMemoTabProps {
  input: string;
  setInput: (value: string) => void;
  context: AdvisoryContext;
  setContext: React.Dispatch<React.SetStateAction<AdvisoryContext>>;
  onGenerateMemo: (options: { subject: string; client: string }) => void;
  memoContent: string | null;
  isLoading: boolean;
}

export const AdvisoryMemoTab: React.FC<AdvisoryMemoTabProps> = ({
  input,
  setInput,
  context,
  setContext,
  onGenerateMemo,
  memoContent,
  isLoading,
}) => {
  const [subject, setSubject] = useState(
    'Tax & Regulatory Opinion on Cross-Border Remittance & Commercial Restructuring'
  );
  const [client, setClient] = useState('Board of Directors & Audit Committee');
  const [preparedBy, setPreparedBy] = useState('Tax & Regulatory Advisory Practice Group');
  const [memoDate, setMemoDate] = useState(new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }));
  const [copied, setCopied] = useState(false);

  // Print function
  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    if (!memoContent) return;
    navigator.clipboard.writeText(memoContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!memoContent) return;
    const blob = new Blob([memoContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Tax_Regulatory_Advisory_Note_${subject.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerate = () => {
    onGenerateMemo({ subject, client });
  };

  return (
    <div className="space-y-6">
      {/* Memo Desk Header Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-mono">
              Formal Drafting Engine
            </span>
            <h2 className="text-base font-bold text-slate-100">
              Tax &amp; Regulatory Advisory Note Generator
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Publishes standard 11-section formal advisory memoranda for client delivery, board evaluation, and audit committee defense.
          </p>
        </div>

        {/* Action Buttons */}
        {memoContent && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={handleCopy}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Memo'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .MD</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Memo Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-4 print:hidden">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Memorandum Header &amp; Metadata</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Subject / Title</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Tax & Secretarial Implications of Hive-off"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Prepared For (Client / Recipient)</label>
                <input
                  type="text"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  placeholder="e.g. Board of Directors, XYZ Limited"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Prepared By</label>
                  <input
                    type="text"
                    value={preparedBy}
                    onChange={(e) => setPreparedBy(e.target.value)}
                    placeholder="e.g. Tax Practice Group"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Date</label>
                  <input
                    type="text"
                    value={memoDate}
                    onChange={(e) => setMemoDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Facts and Background Text */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-300">
                  Factual Matrix &amp; Key Issues for Advisory
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {input.length} chars
                </span>
              </div>
              <textarea
                rows={11}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter facts, parties, contract terms, amounts, and questions to address in the formal memorandum..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500 placeholder-slate-600 leading-relaxed resize-y"
              />
            </div>

            {/* Standard 11-Section Outline Guarantee */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <span className="font-semibold text-slate-300">11-Point Structured Output:</span>
              <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-400">
                <span>1. Background</span>
                <span>2. Facts Considered</span>
                <span>3. Questions Presented</span>
                <span>4. Applicable Law</span>
                <span>5. Legal Analysis</span>
                <span>6. Tax Implications</span>
                <span>7. Risks &amp; Uncertainties</span>
                <span>8. Recommended Actions</span>
                <span>9. Information Required</span>
                <span>10. Cited Sources</span>
                <span className="col-span-2">11. Important Professional Disclaimer</span>
              </div>
            </div>

            {/* Run Button */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setInput('')}
                className="text-xs text-slate-400 hover:text-slate-200 underline"
              >
                Clear
              </button>

              <button
                onClick={handleGenerate}
                disabled={isLoading || !input.trim()}
                className={`inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition shadow-lg ${
                  isLoading || !input.trim()
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20 active:scale-95'
                }`}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Drafting Memo...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Draft Advisory Note</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Formal Memo Document Preview (7 cols / full on print) */}
        <div className="lg:col-span-7 print:col-span-12 space-y-4">
          {isLoading ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-12 text-center space-y-4">
              <div className="inline-flex p-4 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
                <RefreshCw className="w-8 h-8 animate-spin" />
              </div>
              <h3 className="text-base font-bold text-slate-200">
                Compiling Formal 11-Section Advisory Memorandum
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Synthesizing background, statutory provisions, multi-tier risk analysis, action plan, and professional disclaimers...
              </p>
            </div>
          ) : memoContent ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden print:bg-white print:text-black print:border-none print:shadow-none">
              {/* Formal Paperwork Header in Print */}
              <div className="border-b border-slate-800 bg-slate-950 p-6 print:border-b-2 print:border-black print:bg-white">
                <div className="flex items-center justify-between text-xs text-slate-400 print:text-black font-mono">
                  <span>CONFIDENTIAL &amp; PRIVILEGED</span>
                  <span>{memoDate}</span>
                </div>
                <div className="mt-3">
                  <div className="text-[11px] font-bold text-amber-400 uppercase tracking-widest font-mono print:text-black">
                    FORMAL TAX &amp; REGULATORY ADVISORY MEMORANDUM
                  </div>
                  <h1 className="text-xl font-bold text-slate-100 print:text-black mt-1">
                    {subject}
                  </h1>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4 text-xs pt-3 border-t border-slate-800/80 print:border-black/20">
                  <div>
                    <span className="text-slate-500 print:text-black font-medium">Prepared For:</span>
                    <div className="font-semibold text-slate-200 print:text-black">{client}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 print:text-black font-medium">Prepared By:</span>
                    <div className="font-semibold text-slate-200 print:text-black">{preparedBy}</div>
                  </div>
                </div>
              </div>

              {/* Memo Body */}
              <div className="p-8 overflow-y-auto max-h-[750px] print:max-h-none print:overflow-visible leading-relaxed">
                <MarkdownRenderer content={memoContent} />
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mx-auto text-amber-400">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-200">
                Advisory Note Ready for Composition
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Fill in the memorandum metadata on the left, or transfer any 8-step analysis into this desk to generate a formal, client-ready advisory note.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
