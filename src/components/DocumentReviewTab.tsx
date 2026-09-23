import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Download,
  AlertCircle,
  FileCheck,
  ShieldCheck,
} from 'lucide-react';
import { AdvisoryContext } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';

interface DocumentReviewTabProps {
  input: string;
  setInput: (value: string) => void;
  context: AdvisoryContext;
  setContext: React.Dispatch<React.SetStateAction<AdvisoryContext>>;
  onAnalyze: () => void;
  analysis: string | null;
  isLoading: boolean;
  onTransferToMemo: () => void;
}

export const DocumentReviewTab: React.FC<DocumentReviewTabProps> = ({
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
  const [docType, setDocType] = useState('Service Agreement / Contract');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInput(content);
    };
    reader.readAsText(file);
  };

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
    a.download = `VidhiTax_Document_Audit_Report_${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
              Document Audit Desk
            </span>
            <h2 className="text-base font-bold text-slate-100">
              Contract, Invoice &amp; Tax Working Review
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Audit contracts, leases, vendor invoices, or computations for: Fact Extraction, Statutory Compliance, Withholding Exposure, Risk Flags, and Actionable Items.
          </p>
        </div>

        {/* Quick Sample Contract Loader */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setDocType('Cross-border Software Master Agreement');
              setInput(`MASTER SOFTWARE LICENSE & CLOUD SERVICES AGREEMENT (EXTRACT)
Parties:
1. CloudTech International Inc., a company incorporated in Delaware, USA having principal place of business at San Francisco, CA ("Vendor / Licensor")
2. Apex Financial Solutions Private Limited, a company incorporated under Companies Act, 2013, Mumbai, India ("Client / Licensee")

Clause 3: Fees & Payment Terms
3.1 Annual Subscription Fee: Client shall pay Licensor an annual recurring SaaS fee of USD 120,000 for access to the hosted Cloud Analytics Engine.
3.2 Taxes: All payments to be made by Client to Licensor under this Agreement shall be made free and clear of and without deduction for or on account of any taxes, levies, imposts, or withholdings of any nature. If any withholding tax is required by the laws of India, Client shall gross up the payment such that Licensor receives the full invoice amount.
3.3 Intellectual Property: Licensor retains all worldwide right, title, and copyright in the software, algorithms, and documentation. Client is granted a non-exclusive, non-transferable right to access and use the software.

Clause 7: Implementation & Customization
Vendor will deploy specialized engineers remotely to configure client workflows, provide API integrations, and train client staff for an additional professional fee of USD 25,000.

Clause 12: Tax Residency & Documentation
Vendor agrees to furnish US Form 6166 (Certificate of US Tax Residency) upon written request.`);
            }}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition"
          >
            Load Sample Cloud Agreement
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upload / Paste Document Text (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Document Content &amp; Type</span>
            </h3>

            {/* Document Type Selector */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Document Classification
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="Service Agreement / Contract">Service Agreement / Contract</option>
                <option value="Cross-border Software Master Agreement">Cross-border Software License</option>
                <option value="Commercial Lease Deed">Commercial Lease Deed</option>
                <option value="Vendor Tax Invoice / Debit Note">Vendor Tax Invoice / Debit Note</option>
                <option value="GSTR-2B vs 3B Reconciliation Working">GSTR-2B vs 3B Reconciliation</option>
                <option value="TDS Computation & Challan Working">TDS Computation Working</option>
                <option value="Business Transfer Agreement (BTA)">Business Transfer Agreement (BTA)</option>
              </select>
            </div>

            {/* File Upload Option */}
            <div className="border border-dashed border-slate-700 rounded-lg p-3 text-center bg-slate-950/50 hover:bg-slate-950 transition">
              <label className="cursor-pointer flex flex-col items-center justify-center space-y-1">
                <Upload className="w-5 h-5 text-slate-400" />
                <span className="text-xs text-slate-300 font-medium">
                  Upload Text File (.txt, .md, .json)
                </span>
                <span className="text-[10px] text-slate-500">
                  Or paste agreement / computation text below
                </span>
                <input
                  type="file"
                  accept=".txt,.md,.json,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Document Text Area */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-300">
                  Document / Clause Text
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {input.length} chars
                </span>
              </div>
              <textarea
                rows={11}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste the relevant clauses, tax indemnity provisions, payment terms, or computation notes..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500 placeholder-slate-600 leading-relaxed resize-y"
              />
            </div>

            {/* Audit Focus Note */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <span className="font-semibold text-slate-300">Compliance Audit Checks:</span>
              <ul className="list-disc list-inside space-y-0.5 text-slate-400">
                <li>Tax grossing-up exposure u/s 195A (IT Act)</li>
                <li>GST Place of Supply &amp; RCM liability u/s 5(3) IGST</li>
                <li>Copyright vs Copyrighted Article distinction (Engineering Analysis SC)</li>
                <li>Permanent Establishment (PE) / Dependent Agent exposure</li>
              </ul>
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
                onClick={onAnalyze}
                disabled={isLoading || !input.trim()}
                className={`inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition shadow-lg ${
                  isLoading || !input.trim()
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20 active:scale-95'
                }`}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Auditing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run Document Audit</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Audit Findings & Checklist (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {isLoading ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-12 text-center space-y-4">
              <div className="inline-flex p-4 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse">
                <RefreshCw className="w-8 h-8 animate-spin" />
              </div>
              <h3 className="text-base font-bold text-slate-200">
                Auditing Clauses &amp; Extracting Regulatory Implications
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Scanning for withholding obligations, indemnity traps, GST RCM liabilities, and missing statutory documentation...
              </p>
            </div>
          ) : analysis ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
              {/* Output Header */}
              <div className="border-b border-slate-800 bg-slate-950/80 px-4 py-3 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-slate-200">
                    Document Compliance Audit Findings
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold font-mono">
                    5-Point Framework
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

              {/* Rendered Audit Report */}
              <div className="p-6 overflow-y-auto max-h-[750px] leading-relaxed">
                <MarkdownRenderer content={analysis} />
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mx-auto text-emerald-400">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-200">
                Awaiting Document for Compliance Audit
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Paste an agreement, tax computation, or invoice extract on the left to generate a comprehensive 5-point compliance audit report.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
