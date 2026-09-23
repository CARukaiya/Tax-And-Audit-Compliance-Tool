import React, { useState } from 'react';
import {
  GitCompare,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Download,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { AdvisoryContext } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { SAMPLE_PRESETS } from '../data/samplePresets';

interface ComparisonTabProps {
  input: string;
  setInput: (value: string) => void;
  context: AdvisoryContext;
  setContext: React.Dispatch<React.SetStateAction<AdvisoryContext>>;
  onAnalyze: (options?: { treatments: string }) => void;
  analysis: string | null;
  isLoading: boolean;
  onTransferToMemo: () => void;
}

export const ComparisonTab: React.FC<ComparisonTabProps> = ({
  input,
  setInput,
  context,
  setContext,
  onAnalyze,
  analysis,
  isLoading,
  onTransferToMemo,
}) => {
  const [treatmentA, setTreatmentA] = useState('Slump Sale of Business Undertaking u/s 50B');
  const [treatmentB, setTreatmentB] = useState('Itemized Asset-by-Asset Sale under Section 50');
  const [copied, setCopied] = useState(false);

  const comparisonPresets = SAMPLE_PRESETS.filter((p) => p.mode === 'comparison');

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
    a.download = `VidhiTax_Tax_Comparison_Matrix_${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRunComparison = () => {
    onAnalyze({ treatments: `${treatmentA} vs ${treatmentB}` });
  };

  return (
    <div className="space-y-6">
      {/* Comparison Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-mono">
              Treatment Comparison Desk
            </span>
            <h2 className="text-base font-bold text-slate-100">
              Dual-Option Statutory &amp; Financial Comparison
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Produce an exhaustive side-by-side legal matrix: Legal Basis, Statutory Conditions, Tax Impact, Compliance, Documentation, Risks, and Practical Recommendations.
          </p>
        </div>

        {/* Quick Comparison Presets */}
        <div className="flex items-center space-x-2">
          {comparisonPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                setInput(preset.promptInput);
                if (preset.options?.treatments) {
                  const parts = preset.options.treatments.split(' vs ');
                  if (parts[0]) setTreatmentA(parts[0]);
                  if (parts[1]) setTreatmentB(parts[1]);
                }
                if (preset.context) {
                  setContext((prev) => ({ ...prev, ...preset.context }));
                }
              }}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition"
            >
              {preset.title.slice(0, 24)}...
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Dual Treatment Setup & Facts (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <GitCompare className="w-4 h-4 text-amber-400" />
              <span>Define Treatments to Compare</span>
            </h3>

            {/* Treatment A & B inputs */}
            <div className="space-y-3">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <label className="block text-xs font-bold text-amber-300 mb-1">
                  Treatment / Option A
                </label>
                <input
                  type="text"
                  value={treatmentA}
                  onChange={(e) => setTreatmentA(e.target.value)}
                  placeholder="e.g. Slump Sale under Section 50B"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <label className="block text-xs font-bold text-blue-300 mb-1">
                  Treatment / Option B
                </label>
                <input
                  type="text"
                  value={treatmentB}
                  onChange={(e) => setTreatmentB(e.target.value)}
                  placeholder="e.g. Itemized Asset Sale under Section 50"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>
            </div>

            {/* Transaction Facts */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Transaction Facts, Asset Composition &amp; Consideration
              </label>
              <textarea
                rows={9}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Provide transaction details, amounts, asset values, period of holding, GST registrations, or contractual conditions..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500 placeholder-slate-600 leading-relaxed resize-y"
              />
            </div>

            {/* Quick Comparisons List */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5 text-xs">
              <span className="font-semibold text-slate-400">Common Comparative Decisions:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setTreatmentA('Old Tax Regime (Section 115BA)');
                    setTreatmentB('New Tax Regime (Section 115BAC / 115BAA)');
                    setInput('Evaluate corporate / individual tax liability considering Chapter VI-A deductions, 80-IA, MAT u/s 115JB vs concessional rate of 22% / 15% without exemptions.');
                  }}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                >
                  Old vs New Regime
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTreatmentA('Section 194Q TDS by Buyer');
                    setTreatmentB('Section 206C(1H) TCS by Seller');
                    setInput('Buyer and seller both have turnover exceeding ₹10 Crore; transaction value is ₹1.8 Crore for purchase of industrial goods.');
                  }}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                >
                  194Q vs 206C(1H)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTreatmentA('Job Work under GST (Section 143)');
                    setTreatmentB('Works Contract Composite Supply (Section 2(119))');
                    setInput('Subcontractor undertakes fabrication of steel structures using raw materials supplied by principal with minor consumable inputs.');
                  }}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                >
                  Job Work vs Works Contract
                </button>
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
                onClick={handleRunComparison}
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
                    <span>Comparing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Comparison Matrix</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Comparison Matrix Display (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {isLoading ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-12 text-center space-y-4">
              <div className="inline-flex p-4 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
                <RefreshCw className="w-8 h-8 animate-spin" />
              </div>
              <h3 className="text-base font-bold text-slate-200">
                Evaluating Treatments &amp; Building Comparative Matrix
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Analyzing direct tax, indirect tax, secretarial compliance, judicial positions, and practical implementation costs...
              </p>
            </div>
          ) : analysis ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
              {/* Output Header */}
              <div className="border-b border-slate-800 bg-slate-950/80 px-4 py-3 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <GitCompare className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-slate-200">
                    Comparative Legal Evaluation
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold font-mono">
                    Structured Table
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

              {/* Rendered Comparison */}
              <div className="p-6 overflow-y-auto max-h-[750px] leading-relaxed">
                <MarkdownRenderer content={analysis} />
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mx-auto text-amber-400">
                <GitCompare className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-200">
                Awaiting Comparison Parameters
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Define Treatment A and Treatment B, provide transaction details, and click Generate Comparison Matrix.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
