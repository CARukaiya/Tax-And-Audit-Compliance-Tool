import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock,
  Sparkles,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { COMPLIANCE_DEADLINES } from '../data/complianceData';
import { ComplianceDeadline } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';

interface ComplianceCalendarTabProps {
  onRunCustomQuery: (query: string) => void;
  customAnalysis: string | null;
  isLoading: boolean;
}

export const ComplianceCalendarTab: React.FC<ComplianceCalendarTabProps> = ({
  onRunCustomQuery,
  customAnalysis,
  isLoading,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAuthority, setSelectedAuthority] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [customQuestion, setCustomQuestion] = useState('');
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleComplete = (id: string) => {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredDeadlines = useMemo(() => {
    return COMPLIANCE_DEADLINES.filter((item) => {
      const matchesAuthority =
        selectedAuthority === 'All' || item.authority === selectedAuthority;
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.applicableEntity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.statutoryProvision.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.consequenceOfDelay.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesAuthority && matchesCategory && matchesSearch;
    });
  }, [selectedAuthority, selectedCategory, searchQuery]);

  const handleAskDeadline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;
    onRunCustomQuery(
      `Please provide the precise statutory compliance deadline, applicable entity, statutory section, and consequences of delay for the following scenario under Indian law:\n\nQuery: "${customQuestion}"\n\nEnsure to format as a structured compliance table and cite the exact statutory provision, circular, or notification.`
    );
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-mono">
              Statutory Calendar
            </span>
            <h2 className="text-base font-bold text-slate-100">
              Indian Tax, Corporate &amp; Regulatory Compliance Matrix
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Verified statutory due dates, consequences of delay (interest &amp; penalties), and authoritative sections for FY 2024-25 &amp; AY 2025-26.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-slate-300 font-medium">Completed: {completedIds.size}</span>
          </div>
          <div className="flex items-center space-x-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span className="text-slate-300 font-medium">Pending: {COMPLIANCE_DEADLINES.length - completedIds.size}</span>
          </div>
        </div>
      </div>

      {/* AI Statutory Deadline Researcher Assistant */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Statutory Deadline &amp; Extension Researcher</span>
          </h3>
          <span className="text-[11px] text-slate-400">
            Check recent extensions, judicial stays, or specific entity rules
          </span>
        </div>

        <form onSubmit={handleAskDeadline} className="flex gap-2">
          <input
            type="text"
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            placeholder="e.g. What is the due date for filing ITR-6 for a company with international transfer pricing u/s 92E?"
            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 placeholder-slate-500 font-mono"
          />
          <button
            type="submit"
            disabled={isLoading || !customQuestion.trim()}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition shrink-0 flex items-center space-x-1.5 disabled:opacity-50"
          >
            {isLoading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>Verify Deadline</span>
          </button>
        </form>

        {customAnalysis && (
          <div className="mt-3 p-4 bg-slate-950 border border-slate-800 rounded-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <span className="text-xs font-bold text-amber-300">
                Statutory Due Date Analysis
              </span>
            </div>
            <MarkdownRenderer content={customAnalysis} />
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search deadline, section, penalty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 placeholder-slate-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto">
          {/* Authority Filter */}
          <div className="flex items-center space-x-1 shrink-0">
            <span className="text-slate-400 text-[11px] font-medium">Authority:</span>
            {['All', 'Income Tax', 'GST', 'MCA', 'TDS/TCS'].map((auth) => (
              <button
                key={auth}
                onClick={() => setSelectedAuthority(auth)}
                className={`px-2 py-1 rounded text-xs transition ${
                  selectedAuthority === auth
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {auth}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-1 shrink-0 ml-2">
            <span className="text-slate-400 text-[11px] font-medium">Period:</span>
            {['All', 'Monthly', 'Quarterly', 'Annual'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-1 rounded text-xs transition ${
                  selectedCategory === cat
                    ? 'bg-slate-200 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Deadlines Table / Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 uppercase font-mono text-[11px]">
                <th className="p-3 w-10">Status</th>
                <th className="p-3">Compliance &amp; Description</th>
                <th className="p-3">Applicable Assessee</th>
                <th className="p-3">Period</th>
                <th className="p-3">Due Date</th>
                <th className="p-3">Statutory Provision</th>
                <th className="p-3">Consequence of Delay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredDeadlines.map((item) => {
                const isCompleted = completedIds.has(item.id);
                const isExpanded = expandedId === item.id;

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-800/50 transition ${
                      isCompleted ? 'bg-emerald-950/10 opacity-75' : ''
                    }`}
                  >
                    <td className="p-3 text-center">
                      <button
                        onClick={() => toggleComplete(item.id)}
                        className={`w-5 h-5 rounded flex items-center justify-center border transition ${
                          isCompleted
                            ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                            : 'border-slate-700 bg-slate-950 text-transparent hover:border-amber-400'
                        }`}
                        title={isCompleted ? 'Mark Pending' : 'Mark Completed'}
                      >
                        <CheckCircle className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </td>

                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`font-semibold ${
                            isCompleted
                              ? 'line-through text-slate-400'
                              : 'text-slate-100'
                          }`}
                        >
                          {item.title}
                        </span>
                        {item.isImportant && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-mono">
                            Critical
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {item.authority}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {item.category}
                        </span>
                      </div>
                    </td>

                    <td className="p-3 text-slate-300 max-w-xs leading-relaxed">
                      {item.applicableEntity}
                    </td>

                    <td className="p-3 text-slate-400 font-mono">
                      {item.period}
                    </td>

                    <td className="p-3 font-semibold text-amber-300 font-mono whitespace-nowrap">
                      {item.dueDate}
                    </td>

                    <td className="p-3 text-slate-300 font-mono text-[11px]">
                      {item.statutoryProvision}
                    </td>

                    <td className="p-3 text-rose-300/90 max-w-xs leading-relaxed">
                      <div className="flex items-start space-x-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <span>{item.consequenceOfDelay}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
