import React from 'react';
import {
  Scale,
  Search,
  BookOpen,
  AlertTriangle,
  FileText,
  Calendar,
  Layers,
  Calculator,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { AdvisoryMode, PresetScenario } from '../types';
import { SAMPLE_PRESETS } from '../data/samplePresets';

interface HeaderProps {
  activeMode: AdvisoryMode;
  onSelectMode: (mode: AdvisoryMode) => void;
  onOpenLookup: () => void;
  onSelectPreset: (preset: PresetScenario) => void;
  hasActiveAnalysis: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeMode,
  onSelectMode,
  onOpenLookup,
  onSelectPreset,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950 sticky top-0 z-30">
      {/* Statutory Disclaimer Alert Bar */}
      <div className="bg-amber-950/40 border-b border-amber-900/40 px-4 py-1.5 text-xs text-amber-300 flex items-center justify-between">
        <div className="flex items-center space-x-2 max-w-5xl mx-auto w-full">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate">
            <strong className="font-semibold text-amber-200">Statutory Notice:</strong> Preliminary research & drafting assistant for Chartered Accountants & Finance Professionals. Responses are source-grounded and must be independently verified by a qualified professional before client delivery or statutory filing.
          </span>
        </div>
        <div className="hidden lg:flex items-center space-x-3 shrink-0 text-[11px] text-amber-400/80 font-mono">
          <span>FY 2024-25 | AY 2025-26</span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>Income-tax • GST • MCA • FEMA</span>
        </div>
      </div>

      {/* Main Workbench Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo & App Info */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-900/30 border border-amber-400/30">
              <Scale className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-white font-sans flex items-center gap-1.5">
                  VidhiTax
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-medium font-mono">
                    CA Copilot
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400">
                India Tax &amp; Regulatory Advisory Research Engine
              </p>
            </div>
          </div>

          {/* Quick Tools & Preset Trigger */}
          <div className="flex items-center space-x-2.5">
            {/* Quick Statutory Section Lookup Button */}
            <button
              onClick={onOpenLookup}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 hover:text-white transition shadow-sm"
              title="Look up Indian Tax & Regulatory Sections (e.g. 54F, 194Q, 43B(h), 17(5))"
            >
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span>Section Lookup</span>
              <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.2 rounded bg-slate-800 text-[10px] text-slate-400 border border-slate-700">
                ⌘K
              </kbd>
            </button>

            {/* Presets Dropdown */}
            <div className="relative group">
              <button className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-medium text-amber-300 transition">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>Load Sample Case</span>
                <span className="text-[10px] text-amber-400/80">▼</span>
              </button>

              <div className="absolute right-0 mt-1 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 hidden group-hover:block hover:block z-50">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
                  High-Stakes Advisory Cases
                </div>
                <div className="divide-y divide-slate-800">
                  {SAMPLE_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => onSelectPreset(preset)}
                      className="w-full text-left p-2 hover:bg-slate-800/80 rounded-lg transition group/item"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-200 group-hover/item:text-amber-300">
                          {preset.title}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                          {preset.tag}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                        {preset.summary}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 sm:space-x-2 mt-4 overflow-x-auto pb-1 scrollbar-none border-t border-slate-800/60 pt-2">
          <button
            onClick={() => onSelectMode('scenario')}
            className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition shrink-0 ${
              activeMode === 'scenario'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>8-Step Advisory Engine</span>
          </button>

          <button
            onClick={() => onSelectMode('notice')}
            className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition shrink-0 ${
              activeMode === 'notice'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Notice &amp; Assessment Desk</span>
          </button>

          <button
            onClick={() => onSelectMode('compliance_query')}
            className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition shrink-0 ${
              activeMode === 'compliance_query'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Compliance Calendar</span>
          </button>

          <button
            onClick={() => onSelectMode('comparison')}
            className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition shrink-0 ${
              activeMode === 'comparison'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Treatment Comparison</span>
          </button>

          <button
            onClick={() => onSelectMode('document_review')}
            className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition shrink-0 ${
              activeMode === 'document_review'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Document &amp; Contract Audit</span>
          </button>

          <button
            onClick={() => onSelectMode('advisory_memo')}
            className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition shrink-0 ${
              activeMode === 'advisory_memo'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-amber-300" />
            <span>Advisory Memo Generator</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
