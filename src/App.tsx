import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { AdvisoryWorkflowTab } from './components/AdvisoryWorkflowTab';
import { NoticeAssessmentTab } from './components/NoticeAssessmentTab';
import { ComplianceCalendarTab } from './components/ComplianceCalendarTab';
import { TdsGstCalculatorTab } from './components/TdsGstCalculatorTab';
import { ComparisonTab } from './components/ComparisonTab';
import { DocumentReviewTab } from './components/DocumentReviewTab';
import { AdvisoryMemoTab } from './components/AdvisoryMemoTab';
import { QuickSectionLookupModal } from './components/QuickSectionLookupModal';
import { AdvisoryMode, AdvisoryContext, PresetScenario } from './types';
import { SAMPLE_PRESETS } from './data/samplePresets';
import { AlertCircle, Scale, Shield, Sparkles, FileText, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeMode, setActiveMode] = useState<AdvisoryMode>('scenario');
  const [isLookupOpen, setIsLookupOpen] = useState(false);

  // Common Context
  const [context, setContext] = useState<AdvisoryContext>({
    entityType: 'Private Limited Company',
    industry: 'Technology & Enterprise SaaS',
    financialYear: 'FY 2024-25 (AY 2025-26)',
    amount: '₹50,00,000',
    jurisdiction: 'United Arab Emirates (UAE)',
    taxStatus: 'Resident Corporate Entity',
  });

  // Mode inputs
  const [scenarioInput, setScenarioInput] = useState<string>(SAMPLE_PRESETS[0].promptInput);
  const [noticeInput, setNoticeInput] = useState<string>(SAMPLE_PRESETS[2].promptInput);
  const [comparisonInput, setComparisonInput] = useState<string>(SAMPLE_PRESETS[1].promptInput);
  const [docReviewInput, setDocReviewInput] = useState<string>('');
  const [memoInput, setMemoInput] = useState<string>(SAMPLE_PRESETS[5].promptInput);

  // Mode outputs
  const [scenarioAnalysis, setScenarioAnalysis] = useState<string | null>(null);
  const [noticeAnalysis, setNoticeAnalysis] = useState<string | null>(null);
  const [comparisonAnalysis, setComparisonAnalysis] = useState<string | null>(null);
  const [docReviewAnalysis, setDocReviewAnalysis] = useState<string | null>(null);
  const [memoContent, setMemoContent] = useState<string | null>(null);
  const [complianceQueryAnalysis, setComplianceQueryAnalysis] = useState<string | null>(null);

  // Loading and error states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Global keyboard shortcut for Cmd/Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsLookupOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Preset Selector handler
  const handleSelectPreset = (preset: PresetScenario) => {
    setActiveMode(preset.mode);
    if (preset.context) {
      setContext((prev) => ({ ...prev, ...preset.context }));
    }

    switch (preset.mode) {
      case 'scenario':
        setScenarioInput(preset.promptInput);
        break;
      case 'notice':
        setNoticeInput(preset.promptInput);
        break;
      case 'comparison':
        setComparisonInput(preset.promptInput);
        break;
      case 'document_review':
        setDocReviewInput(preset.promptInput);
        break;
      case 'advisory_memo':
        setMemoInput(preset.promptInput);
        break;
    }
  };

  // Generalized API caller
  const executeAnalysis = async (
    modeToCall: AdvisoryMode,
    inputText: string,
    options?: Record<string, any>
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/advisory/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: modeToCall,
          input: inputText,
          context,
          options,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate advisory analysis');
      }

      switch (modeToCall) {
        case 'scenario':
          setScenarioAnalysis(data.analysis);
          break;
        case 'notice':
          setNoticeAnalysis(data.analysis);
          break;
        case 'comparison':
          setComparisonAnalysis(data.analysis);
          break;
        case 'document_review':
          setDocReviewAnalysis(data.analysis);
          break;
        case 'advisory_memo':
          setMemoContent(data.analysis);
          break;
        case 'compliance_query':
          setComplianceQueryAnalysis(data.analysis);
          break;
      }
    } catch (err: any) {
      console.error('Advisory execution failed:', err);
      setError(err.message || 'An unexpected error occurred during advisory analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  // Convert current analysis to formal Advisory Note
  const handleTransferToMemo = () => {
    let sourceContent = '';
    if (activeMode === 'scenario' && scenarioAnalysis) {
      sourceContent = `ADVISORY WORKFLOW FINDINGS TO CONVERT INTO FORMAL NOTE:\n\nFacts Input: ${scenarioInput}\n\nAnalysis Findings:\n${scenarioAnalysis}`;
    } else if (activeMode === 'notice' && noticeAnalysis) {
      sourceContent = `NOTICE ASSESSMENT & DEFENSE DOSSIER TO FORMALIZE:\n\nNotice Details: ${noticeInput}\n\nDefense Strategy:\n${noticeAnalysis}`;
    } else if (activeMode === 'comparison' && comparisonAnalysis) {
      sourceContent = `TREATMENT COMPARISON MATRIX TO FORMALIZE:\n\nComparison Details: ${comparisonInput}\n\nComparative Matrix:\n${comparisonAnalysis}`;
    } else if (activeMode === 'document_review' && docReviewAnalysis) {
      sourceContent = `DOCUMENT AUDIT FINDINGS TO FORMALIZE:\n\nDocument Text: ${docReviewInput}\n\nAudit Findings:\n${docReviewAnalysis}`;
    } else {
      sourceContent = scenarioInput || noticeInput || comparisonInput;
    }

    setMemoInput(sourceContent);
    setActiveMode('advisory_memo');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Header */}
      <Header
        activeMode={activeMode}
        onSelectMode={(mode) => setActiveMode(mode)}
        onOpenLookup={() => setIsLookupOpen(true)}
        onSelectPreset={handleSelectPreset}
        hasActiveAnalysis={Boolean(
          scenarioAnalysis || noticeAnalysis || comparisonAnalysis || memoContent
        )}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Error Toast if any */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-900/60 text-rose-300 text-xs flex items-center justify-between shadow-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-xs font-semibold px-2 py-1 rounded bg-rose-900/50 hover:bg-rose-900 text-rose-200 transition"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Tab Content Switches */}
        {activeMode === 'scenario' && (
          <AdvisoryWorkflowTab
            input={scenarioInput}
            setInput={setScenarioInput}
            context={context}
            setContext={setContext}
            onAnalyze={() => executeAnalysis('scenario', scenarioInput)}
            analysis={scenarioAnalysis}
            isLoading={isLoading}
            onTransferToMemo={handleTransferToMemo}
          />
        )}

        {activeMode === 'notice' && (
          <NoticeAssessmentTab
            input={noticeInput}
            setInput={setNoticeInput}
            context={context}
            setContext={setContext}
            onAnalyze={() => executeAnalysis('notice', noticeInput)}
            analysis={noticeAnalysis}
            isLoading={isLoading}
            onTransferToMemo={handleTransferToMemo}
          />
        )}

        {activeMode === 'compliance_query' && (
          <ComplianceCalendarTab
            onRunCustomQuery={(query) => executeAnalysis('compliance_query', query)}
            customAnalysis={complianceQueryAnalysis}
            isLoading={isLoading}
          />
        )}

        {activeMode === 'comparison' && (
          <ComparisonTab
            input={comparisonInput}
            setInput={setComparisonInput}
            context={context}
            setContext={setContext}
            onAnalyze={(options) =>
              executeAnalysis('comparison', comparisonInput, options)
            }
            analysis={comparisonAnalysis}
            isLoading={isLoading}
            onTransferToMemo={handleTransferToMemo}
          />
        )}

        {activeMode === 'document_review' && (
          <DocumentReviewTab
            input={docReviewInput}
            setInput={setDocReviewInput}
            context={context}
            setContext={setContext}
            onAnalyze={() => executeAnalysis('document_review', docReviewInput)}
            analysis={docReviewAnalysis}
            isLoading={isLoading}
            onTransferToMemo={handleTransferToMemo}
          />
        )}

        {activeMode === 'advisory_memo' && (
          <AdvisoryMemoTab
            input={memoInput}
            setInput={setMemoInput}
            context={context}
            setContext={setContext}
            onGenerateMemo={(options) =>
              executeAnalysis('advisory_memo', memoInput, options)
            }
            memoContent={memoContent}
            isLoading={isLoading}
          />
        )}

        {/* Persistent Statutory Matrix Tool Card at Bottom */}
        <section className="mt-12 pt-8 border-t border-slate-800/80">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-400" />
                <span>Quick Statutory Computation Matrix</span>
              </h2>
              <p className="text-xs text-slate-400">
                Interactive calculation for Sections 194C, 194J, 194Q, 206C(1H), 195, 194I, 194IA, and GST RCM
              </p>
            </div>
          </div>
          <TdsGstCalculatorTab />
        </section>
      </main>

      {/* Floating Section Lookup Modal */}
      <QuickSectionLookupModal
        isOpen={isLookupOpen}
        onClose={() => setIsLookupOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 px-4 text-center text-xs text-slate-400 print:hidden">
        <div className="max-w-5xl mx-auto space-y-2">
          <div className="flex items-center justify-center space-x-2 text-slate-400">
            <Scale className="w-4 h-4 text-amber-500" />
            <span className="font-semibold text-slate-300">VidhiTax</span>
            <span>— India Tax &amp; Regulatory Advisory Research Engine</span>
          </div>
          <p className="text-[11px] text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Statutory grounding: Income-tax Act, 1961, CGST Act, 2017, IGST Act, 2017, Companies Act, 2013, FEMA 1999, and authoritative CBDT/CBIC notifications. All generated memos, calculations, and strategies must be independently reviewed by a qualified Chartered Accountant, Advocate, or tax professional before client delivery or statutory filing.
          </p>
        </div>
      </footer>
    </div>
  );
}
