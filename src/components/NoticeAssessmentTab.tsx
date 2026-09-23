import React, { useState } from 'react';
import {
  ShieldAlert,
  FileText,
  Clock,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Download,
  AlertTriangle,
  FolderOpen,
  ArrowRight,
} from 'lucide-react';
import { AdvisoryContext } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { SAMPLE_PRESETS } from '../data/samplePresets';

interface NoticeAssessmentTabProps {
  input: string;
  setInput: (value: string) => void;
  context: AdvisoryContext;
  setContext: React.Dispatch<React.SetStateAction<AdvisoryContext>>;
  onAnalyze: () => void;
  analysis: string | null;
  isLoading: boolean;
  onTransferToMemo: () => void;
}

export const NoticeAssessmentTab: React.FC<NoticeAssessmentTabProps> = ({
  input,
  setInput,
  context,
  setContext,
  onAnalyze,
  analysis,
  isLoading,
  onTransferToMemo,
}) => {
  const [copied, setCopied] = useState(false);

  const noticePresets = SAMPLE_PRESETS.filter((p) => p.mode === 'notice');

  const handleCopy = () => {
    if (!analysis) return;
    navigator.clipboard.writeText(analysis);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!analysis) return;
    const blob = new Blob([analysis], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VidhiTax_Notice_Defense_Strategy_${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Notice Desk Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 font-mono">
              Notice &amp; Assessment Desk
            </span>
            <h2 className="text-base font-bold text-slate-100">
              Tax Litigation &amp; Regulatory SCN Defense
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automated extraction of DIN, sections cited, response limitation, defense strategy, reconciliation checklist, and formal draft response.
          </p>
        </div>

        {/* Quick Notice Sample Picker */}
        <div className="flex items-center space-x-2">
          {noticePresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                setInput(preset.promptInput);
                if (preset.context) {
                  setContext((prev) => ({ ...prev, ...preset.context }));
                }
              }}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition"
            >
              Load: {preset.title.slice(0, 26)}...
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Notice Text Input & Metadata (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Paste Notice Text or Scrutiny Summons</span>
            </h3>

            {/* Quick Context for Notice */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Notice Authority</label>
                <select
                  value={context.taxStatus}
                  onChange={(e) => setContext({ ...context, taxStatus: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="Income Tax NeAC / JAO">Income Tax (NeAC / JAO)</option>
                  <option value="GST State / Central Authority">GST (State / Central)</option>
                  <option value="Directorate of Enforcement (ED)">Directorate of Enforcement (ED)</option>
                  <option value="Registrar of Companies (ROC/MCA)">MCA / ROC Inquiry</option>
                  <option value="Customs / DRI">Customs / DRI</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Assessment Year / Period</label>
                <input
                  type="text"
                  placeholder="e.g. AY 2021-22 or FY 2019-20"
                  value={context.financialYear}
                  onChange={(e) => setContext({ ...context, financialYear: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Notice Raw Text Area */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-300">
                  Notice Extract, DIN, Allegations &amp; Section References
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {input.length} chars
                </span>
              </div>
              <textarea
                rows={11}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste the text from the notice or order received from Income Tax (148A, 143(2), 142(1), 133(6)), GST (DRC-01, ASMT-10), or ROC..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-rose-500 placeholder-slate-600 leading-relaxed resize-y"
              />
            </div>

            {/* Legal Notice Checklist Hints */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <span className="font-semibold text-slate-300">Notice Evaluation Protocol:</span>
              <ul className="list-disc list-inside space-y-0.5 text-slate-400">
                <li>Check statutory limitation under Section 149 / Section 73(10)</li>
                <li>Verify DIN validity on official portal (CBDT Circular 19/2019)</li>
                <li>Assess sanction of Specified Authority u/s 151</li>
                <li>Compile bank ledgers, GSTR-2B vs 3B recos, and third-party confirmations</li>
              </ul>
            </div>

            {/* Action Button */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setInput('')}
                className="text-xs text-slate-400 hover:text-slate-200 underline"
              >
                Clear
              </button>

              <button
                onClick={onAnalyze}
                disabled={isLoading || !input.trim()}
                className={`inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition shadow-lg ${
                  isLoading || !input.trim()
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : 'bg-rose-500 hover:bg-rose-400 text-slate-950 shadow-rose-500/20 active:scale-95'
                }`}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing Notice...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze Notice &amp; Draft Reply</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Notice Defense Analysis & Reply Template (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {isLoading ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-12 text-center space-y-4">
              <div className="inline-flex p-4 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse">
                <RefreshCw className="w-8 h-8 animate-spin" />
              </div>
              <h3 className="text-base font-bold text-slate-200">
                Analyzing Notice Legality &amp; Formulation of Defense
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Verifying jurisdiction, limitation periods, approval u/s 151, cross-referencing GST/ITR circulars, and framing paragraph-wise reply...
              </p>
            </div>
          ) : analysis ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
              {/* Output Header */}
              <div className="border-b border-slate-800 bg-slate-950/80 px-4 py-3 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span className="text-xs font-bold text-slate-200">
                    Statutory Notice Defense Dossier
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 font-semibold font-mono">
                    Limitation &amp; Merits Rebuttal
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>

                  <button
                    onClick={onTransferToMemo}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-xs font-semibold text-amber-300 border border-amber-500/40 transition"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Send to Memo</span>
                  </button>
                </div>
              </div>

              {/* Rendered Notice Defense Output */}
              <div className="p-6 overflow-y-auto max-h-[750px] leading-relaxed">
                <MarkdownRenderer content={analysis} />
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mx-auto text-rose-400">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-200">
                Notice &amp; Scrutiny Assistant Awaiting Input
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Paste any notice issued under the Income-tax Act, 1961 (S. 148A, 143(2), 142(1), 133(6)) or CGST Act (DRC-01, ASMT-10) to generate a complete legal defense dossier.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
