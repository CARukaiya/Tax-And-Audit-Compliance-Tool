import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Percent,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ShieldAlert,
  ArrowRight,
  Info,
} from 'lucide-react';
import { TDS_SECTIONS_DATABASE, GST_RCM_DATABASE } from '../data/tdsMatrixData';
import { TdsSectionRule, GstRcmCategory } from '../types';

export const TdsGstCalculatorTab: React.FC = () => {
  const [selectedSectionCode, setSelectedSectionCode] = useState<string>('194J(b)');
  const [amountStr, setAmountStr] = useState<string>('500000');
  const [payeeIsCompany, setPayeeIsCompany] = useState<boolean>(true);
  const [hasPan, setHasPan] = useState<boolean>(true);
  const [isNonFiler206AB, setIsNonFiler206AB] = useState<boolean>(false);
  const [hasLowerCertificate, setHasLowerCertificate] = useState<boolean>(false);
  const [customCertRate, setCustomCertRate] = useState<string>('1.0');

  // Active section data
  const activeSection: TdsSectionRule = useMemo(() => {
    return (
      TDS_SECTIONS_DATABASE.find((s) => s.section === selectedSectionCode) ||
      TDS_SECTIONS_DATABASE[0]
    );
  }, [selectedSectionCode]);

  // Numeric amount
  const grossAmount = useMemo(() => {
    const parsed = parseFloat(amountStr.replace(/[^0-9.]/g, ''));
    return isNaN(parsed) ? 0 : parsed;
  }, [amountStr]);

  // Effective TDS Rate calculation
  const { effectiveRate, rateReason } = useMemo(() => {
    if (hasLowerCertificate) {
      const parsedCert = parseFloat(customCertRate);
      return {
        effectiveRate: isNaN(parsedCert) ? 0 : parsedCert,
        rateReason: 'Certificate for lower/Nil deduction u/s 197 furnished',
      };
    }

    if (!hasPan) {
      return {
        effectiveRate: activeSection.rateWithoutPan,
        rateReason: 'Higher rate u/s 206AA due to non-furnishing of valid PAN (20% or statutory rate whichever is higher)',
      };
    }

    if (isNonFiler206AB) {
      return {
        effectiveRate: Math.max(activeSection.standardRate * 2, 5.0),
        rateReason: 'Higher rate u/s 206AB for specified non-filer of Income Tax Return (twice the rate or 5%, whichever is higher)',
      };
    }

    // Special case for 194C (1% individual, 2% company/firm)
    if (activeSection.section === '194C') {
      const rate = payeeIsCompany ? 2.0 : 1.0;
      return {
        effectiveRate: rate,
        rateReason: payeeIsCompany ? '2% for Company / Firm / Body Corporate' : '1% for Individual / HUF contractor',
      };
    }

    return {
      effectiveRate: activeSection.standardRate,
      rateReason: 'Standard statutory rate under Income-tax Act, 1961',
    };
  }, [activeSection, hasPan, isNonFiler206AB, hasLowerCertificate, customCertRate, payeeIsCompany]);

  // Tax and Net Amount
  const tdsAmount = (grossAmount * effectiveRate) / 100;
  const netPayable = grossAmount - tdsAmount;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-mono">
              Deterministic Tax Engines
            </span>
            <h2 className="text-base font-bold text-slate-100">
              TDS Withholding Calculator &amp; GST RCM Decision Matrix
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Instant calculation with Section 206AA (No PAN), Section 206AB (Non-filers), and Section 40(a)(ia) disallowance assessment.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: TDS Calculator Inputs (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-amber-400" />
              <span>Withholding Parameters</span>
            </h3>

            {/* Section Selector */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Select Income-tax Section
              </label>
              <select
                value={selectedSectionCode}
                onChange={(e) => setSelectedSectionCode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 font-medium focus:outline-none focus:border-amber-500"
              >
                {TDS_SECTIONS_DATABASE.map((sec) => (
                  <option key={sec.section} value={sec.section}>
                    Section {sec.section} — {sec.natureOfPayment.slice(0, 45)}...
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Amount */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Gross Transaction / Invoice Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">
                  ₹
                </span>
                <input
                  type="text"
                  value={amountStr}
                  onChange={(e) => setAmountStr(e.target.value)}
                  placeholder="500000"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500 font-bold"
                />
              </div>
            </div>

            {/* Payee Type toggle (for 194C) */}
            {selectedSectionCode === '194C' && (
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2 text-xs">
                <span className="font-semibold text-slate-300">Payee Constitution:</span>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      checked={!payeeIsCompany}
                      onChange={() => setPayeeIsCompany(false)}
                      className="accent-amber-500"
                    />
                    <span>Individual / HUF (1%)</span>
                  </label>
                  <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      checked={payeeIsCompany}
                      onChange={() => setPayeeIsCompany(true)}
                      className="accent-amber-500"
                    />
                    <span>Company / Firm / LLP (2%)</span>
                  </label>
                </div>
              </div>
            )}

            {/* Compliance Flags */}
            <div className="space-y-2.5 pt-1 text-xs">
              <label className="flex items-start space-x-2.5 p-2 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                <input
                  type="checkbox"
                  checked={hasPan}
                  onChange={(e) => setHasPan(e.target.checked)}
                  className="mt-0.5 rounded accent-amber-500"
                />
                <div>
                  <span className="font-semibold text-slate-200">Valid PAN Furnished</span>
                  <p className="text-[11px] text-slate-400">
                    If unchecked, Section 206AA mandates TDS at maximum marginal rate (20%).
                  </p>
                </div>
              </label>

              <label className="flex items-start space-x-2.5 p-2 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                <input
                  type="checkbox"
                  checked={isNonFiler206AB}
                  onChange={(e) => setIsNonFiler206AB(e.target.checked)}
                  className="mt-0.5 rounded accent-amber-500"
                />
                <div>
                  <span className="font-semibold text-slate-200">Specified Non-Filer u/s 206AB</span>
                  <p className="text-[11px] text-slate-400">
                    Payee has not filed ITR for relevant preceding year and TDS/TCS was &ge; ₹50,000.
                  </p>
                </div>
              </label>

              <label className="flex items-start space-x-2.5 p-2 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                <input
                  type="checkbox"
                  checked={hasLowerCertificate}
                  onChange={(e) => setHasLowerCertificate(e.target.checked)}
                  className="mt-0.5 rounded accent-amber-500"
                />
                <div>
                  <span className="font-semibold text-slate-200">Certificate u/s 197 (Lower / Nil TDS)</span>
                  {hasLowerCertificate && (
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="text-[11px] text-slate-400">Certified Rate:</span>
                      <input
                        type="number"
                        step="0.1"
                        value={customCertRate}
                        onChange={(e) => setCustomCertRate(e.target.value)}
                        className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs text-amber-300 font-mono"
                      />
                      <span className="text-slate-400">%</span>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Instant Calculation Breakdown (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                  Calculation Result
                </span>
                <h3 className="text-base font-bold text-slate-100">
                  Section {activeSection.section} Computation
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 text-xs font-mono font-semibold border border-slate-700">
                {activeSection.payeeType} Payee
              </span>
            </div>

            {/* Primary KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 font-medium">Gross Consideration</span>
                <div className="text-lg font-bold text-slate-100 font-mono mt-1">
                  ₹{grossAmount.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-amber-500/30 bg-amber-950/10">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-amber-300 font-medium">TDS to Deduct</span>
                  <span className="text-xs font-bold text-amber-400 font-mono">{effectiveRate}%</span>
                </div>
                <div className="text-lg font-bold text-amber-400 font-mono mt-1">
                  ₹{tdsAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/10">
                <span className="text-[11px] text-emerald-300 font-medium">Net Payable to Payee</span>
                <div className="text-lg font-bold text-emerald-400 font-mono mt-1">
                  ₹{netPayable.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            {/* Rate Basis Explanation Callout */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-start space-x-2 text-xs">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-300">Rate Basis Applied: </span>
                <span className="text-slate-400">{rateReason}</span>
              </div>
            </div>

            {/* Statutory Compliance Checklist & Challan Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-400 font-medium">Statutory Due Date of Deposit:</span>
                <div className="font-semibold text-slate-200">
                  7th of the following month (30th April for March deductions)
                </div>
                <div className="text-[11px] text-slate-500">
                  Delay triggers mandatory interest @ 1.5% p.m. u/s 201(1A)(ii)
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-400 font-medium">Deposit Challan &amp; Quarterly Return:</span>
                <div className="font-semibold text-slate-200">
                  {activeSection.challanType} • {activeSection.quarterlyReturn}
                </div>
                <div className="text-[11px] text-slate-500">
                  Form 16A TDS Certificate due within 15 days of return filing
                </div>
              </div>
            </div>

            {/* Section 40(a)(ia) Disallowance Warning */}
            <div className="p-3 rounded-lg bg-red-950/20 border border-red-900/40 text-xs text-red-200 flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="font-semibold text-red-300">Section 40(a)(ia) Exposure: </strong>
                Failure to deduct TDS, or failure to deposit deducted tax on or before the due date of filing ITR u/s 139(1), will result in{' '}
                <span className="font-bold underline text-red-200">30% disallowance</span> of this expense in the computation of business income (100% disallowance u/s 40(a)(i) for non-residents).
              </div>
            </div>

            {/* Section Threshold & Statutory Description */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-300">Statutory Threshold:</span>
                <span className="font-mono text-amber-300">{activeSection.thresholdLimit}</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                {activeSection.keyConditions}
              </p>
              <div className="text-[10px] text-slate-500 font-mono pt-1">
                Source: {activeSection.statutoryReference}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GST Reverse Charge Mechanism (RCM) Reference Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
              Indirect Tax Framework
            </span>
            <h3 className="text-base font-bold text-slate-100">
              GST Reverse Charge Mechanism (RCM) Reference Matrix
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Section 9(3) CGST Act &amp; Section 5(3) IGST Act
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 uppercase font-mono text-[11px]">
                <th className="p-3">Category of Supply</th>
                <th className="p-3">Supplier</th>
                <th className="p-3">Recipient Obligation</th>
                <th className="p-3">Rate</th>
                <th className="p-3">ITC Eligibility</th>
                <th className="p-3">Cash Ledger Rule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {GST_RCM_DATABASE.map((rcm, idx) => (
                <tr key={idx} className="hover:bg-slate-800/50 transition">
                  <td className="p-3 font-semibold text-slate-200 max-w-xs">
                    {rcm.serviceName}
                    <div className="text-[10px] text-amber-400/80 font-mono mt-0.5">
                      {rcm.notification}
                    </div>
                  </td>
                  <td className="p-3 text-slate-400 max-w-[200px]">
                    {rcm.supplier}
                  </td>
                  <td className="p-3 text-slate-300 max-w-[200px]">
                    {rcm.recipient}
                  </td>
                  <td className="p-3 font-mono text-amber-300 whitespace-nowrap">
                    {rcm.igstRate}
                  </td>
                  <td className="p-3 text-emerald-300/90 max-w-[200px]">
                    {rcm.itcAvailable}
                  </td>
                  <td className="p-3 text-slate-400 max-w-[220px] text-[11px]">
                    {rcm.mandatoryCondition}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
