import React, { useState } from 'react';
import {
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Download,
  AlertCircle,
  FileCheck,
  Building,
  Globe,
  Coins,
  ChevronRight,
  BookOpen,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { AdvisoryContext } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';

interface AdvisoryWorkflowTabProps {
  input: string;
  setInput: (value: string) => void;
  context: AdvisoryContext;
  setContext: React.Dispatch<React.SetStateAction<AdvisoryContext>>;
  onAnalyze: () => void;
  analysis: string | null;
  isLoading: boolean;
  onTransferToMemo: () => void;
}

export const AdvisoryWorkflowTab: React.FC<AdvisoryWorkflowTabProps> = ({
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
  const [activeStepTab, setActiveStepTab] = useState<'all' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'>('all');

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
    a.download = `VidhiTax_Advisory_Analysis_${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner explaining the 8-step workflow */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-mono">
              Statutory 8-Step Engine
            </span>
            <h2 className="text-base font-bold text-slate-100">
              India Tax &amp; Regulatory Analytical Framework
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Rigorously adheres to: <strong className="text-slate-300">Facts → Applicable Law → Applicability → Analysis → Tax Impact → Compliance → Risk Flags → Action Plan</strong>
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-[11px] text-slate-400">Jurisdictions:</span>
          <span className="text-xs font-semibold px-2 py-1 bg-slate-800 rounded text-slate-200 border border-slate-700">
            Income Tax (IT Act 1961)
          </span>
          <span className="text-xs font-semibold px-2 py-1 bg-slate-800 rounded text-slate-200 border border-slate-700">
            GST (CGST/IGST 2017)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Context & Input Form (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Building className="w-4 h-4 text-amber-400" />
              <span>Assessee &amp; Transaction Context</span>
            </h3>

            {/* Context Inputs Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Entity Type</label>
                <select
                  value={context.entityType}
                  onChange={(e) => setContext({ ...context, entityType: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="Private Limited Company">Private Limited Company</option>
                  <option value="Public Limited Company">Public Limited Company</option>
                  <option value="Listed Company">Listed Corporate Entity</option>
                  <option value="Limited Liability Partnership (LLP)">LLP</option>
                  <option value="Partnership Firm">Partnership Firm</option>
                  <option value="Resident Individual / HUF">Individual / HUF</option>
                  <option value="Non-Resident / Foreign Entity">Non-Resident / Foreign Co</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Financial Year</label>
                <select
                  value={context.financialYear}
                  onChange={(e) => setContext({ ...context, financialYear: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="FY 2024-25 (AY 2025-26)">FY 2024-25 (AY 2025-26)</option>
                  <option value="FY 2025-26 (AY 2026-27)">FY 2025-26 (AY 2026-27)</option>
                  <option value="FY 2023-24 (AY 2024-25)">FY 2023-24 (AY 2024-25)</option>
                  <option value="FY 2022-23 (AY 2023-24)">FY 2022-23 (AY 2023-24)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Industry / Sector</label>
                <input
                  type="text"
                  placeholder="e.g. IT & Software, Real Estate"
                  value={context.industry}
                  onChange={(e) => setContext({ ...context, industry: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Transaction Value</label>
                <input
                  type="text"
                  placeholder="e.g. ₹50,00,000"
                  value={context.amount}
                  onChange={(e) => setContext({ ...context, amount: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Counterparty Jurisdiction</label>
                <input
                  type="text"
                  placeholder="e.g. Domestic / UAE / USA / Singapore"
                  value={context.jurisdiction}
                  onChange={(e) => setContext({ ...context, jurisdiction: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Tax Audit / Status</label>
                <select
                  value={context.taxStatus}
                  onChange={(e) => setContext({ ...context, taxStatus: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="Audited under Section 44AB">Liable to Tax Audit (S. 44AB)</option>
                  <option value="Non-Audit Business">Non-Audit Business</option>
                  <option value="Presumptive (44AD/44ADA)">Presumptive Taxation</option>
                  <option value="Start-up with 80-IAC approval">DPIIT Approved Startup</option>
                </select>
              </div>
            </div>

            {/* Scenario Description Text Area */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-300">
                  Transaction Facts, Contract Terms &amp; Tax Queries
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {input.length} chars
                </span>
              </div>
              <textarea
                rows={9}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter facts, parties, nature of payment, invoices, DTAA aspects, or specific tax issues to examine..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500 placeholder-slate-600 leading-relaxed resize-y"
              />
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setInput('')}
                className="text-xs text-slate-400 hover:text-slate-200 underline"
              >
                Clear Input
              </button>

              <button
                onClick={onAnalyze}
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
                    <span>Analyzing Law...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Advisory Analysis</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: 8-Step Output Display (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {isLoading ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-12 text-center space-y-4">
              <div className="inline-flex p-4 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
                <RefreshCw className="w-8 h-8 animate-spin" />
              </div>
              <h3 className="text-base font-bold text-slate-200">
                Executing 8-Step Regulatory Analysis
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Evaluating statutory provisions under Income-tax Act, 1961, CGST/IGST Act, 2017, relevant circulars, and judicial precedents...
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-2 text-[11px] text-amber-300/80 font-mono">
                <span className="px-2 py-0.5 bg-slate-800 rounded">Extracting Facts</span>
                <span>→</span>
                <span className="px-2 py-0.5 bg-slate-800 rounded">Identifying Missing Gaps</span>
                <span>→</span>
                <span className="px-2 py-0.5 bg-slate-800 rounded">Checking Sections</span>
                <span>→</span>
                <span className="px-2 py-0.5 bg-slate-800 rounded">Evaluating Risk Matrix</span>
              </div>
            </div>
          ) : analysis ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
              {/* Output Header with Action Tools */}
              <div className="border-b border-slate-800 bg-slate-950/80 px-4 py-3 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-slate-200">
                    Preliminary Advisory Opinion
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold font-mono">
                    8 Steps Structured
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
                    title="Export Markdown file"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>

                  <button
                    onClick={onTransferToMemo}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-xs font-semibold text-amber-300 border border-amber-500/40 transition"
                    title="Generate Formal CA Advisory Note"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Convert to Memo</span>
                  </button>
                </div>
              </div>

              {/* Step Navigation Pill Filter */}
              <div className="border-b border-slate-800/80 bg-slate-950/40 px-4 py-2 flex items-center space-x-1 overflow-x-auto text-[11px] scrollbar-none">
                <span className="text-slate-400 mr-1 shrink-0 font-medium">Jump:</span>
                <a
                  href="#step1"
                  className="px-2 py-0.5 rounded bg-slate-800/70 hover:bg-slate-700 text-slate-300 shrink-0"
                >
                  Step 1: Facts
                </a>
                <a
                  href="#step2"
                  className="px-2 py-0.5 rounded bg-amber-950/40 hover:bg-amber-900/40 text-amber-300 border border-amber-900/40 shrink-0"
                >
                  Step 2: Fact Gaps
                </a>
                <a
                  href="#step4"
                  className="px-2 py-0.5 rounded bg-slate-800/70 hover:bg-slate-700 text-slate-300 shrink-0"
                >
                  Step 4: Law
                </a>
                <a
                  href="#step6"
                  className="px-2 py-0.5 rounded bg-slate-800/70 hover:bg-slate-700 text-slate-300 shrink-0"
                >
                  Step 6: Tax Impact
                </a>
                <a
                  href="#step7"
                  className="px-2 py-0.5 rounded bg-red-950/40 hover:bg-red-900/40 text-red-300 border border-red-900/40 shrink-0"
                >
                  Step 7: Risks
                </a>
                <a
                  href="#step8"
                  className="px-2 py-0.5 rounded bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-300 border border-emerald-900/40 shrink-0"
                >
                  Step 8: Action Plan
                </a>
              </div>

              {/* Rendered Advisory Content */}
              <div className="p-6 overflow-y-auto max-h-[750px] leading-relaxed">
                <MarkdownRenderer content={analysis} />
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mx-auto text-amber-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-200">
                Ready for Tax &amp; Regulatory Research
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Select a sample case from above or describe your business transaction, notice, cross-border payment, or restructuring query.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setInput(
                      'An Indian company pays ₹50 lakh to a UAE company for design services. Please analyze domestic tax (Section 195, Section 9(1)(vii)), India-UAE DTAA, GST RCM, Form 15CA/15CB, and documentation requirements.'
                    );
                  }}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-amber-300 transition"
                >
                  <span>Try UAE Design Remittance Example</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
