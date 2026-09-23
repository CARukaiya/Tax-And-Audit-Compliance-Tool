import { PresetScenario } from '../types';

export const SAMPLE_PRESETS: PresetScenario[] = [
  {
    id: 'preset-uae-design',
    title: 'UAE Design Services Cross-Border Remittance (₹50 Lakh)',
    mode: 'scenario',
    tag: 'International Tax & GST',
    summary: 'Indian private limited company pays ₹50,00,000 to a Dubai LLC for specialized architectural & CAD design services.',
    context: {
      entityType: 'Private Limited Company',
      industry: 'Real Estate Infrastructure & Engineering',
      financialYear: 'FY 2024-25 (AY 2025-26)',
      amount: '₹50,00,000',
      jurisdiction: 'United Arab Emirates (UAE)',
      taxStatus: 'Resident Corporate Entity',
    },
    promptInput: `An Indian private limited company engaged in infrastructure development has engaged a Dubai (UAE) based architectural engineering company to provide specialized 3D BIM design, CAD structural drawings, and architectural renderings for a commercial tower project in Mumbai, India.
The agreed contract fee is ₹50,00,000 (approx. USD 60,000).
The UAE company does not have an office, branch, or personnel physically present in India; all design work is performed remotely from their Dubai studio and transmitted digitally over cloud storage.
The UAE entity is willing to furnish a Tax Residency Certificate (TRC) issued by the UAE Federal Tax Authority, electronically generated Form 10F, and a No-PE declaration.
Please advise:
1. Domestic law characterization as Fees for Technical Services (FTS) / Royalty under Section 9(1)(vii) / Section 9(1)(vi) of the Income-tax Act, 1961.
2. Applicability of the India-UAE Double Tax Avoidance Agreement (DTAA) — specifically whether the India-UAE DTAA has an FTS Article, and applicability of Article 7 (Business Profits) in absence of a Permanent Establishment (PE).
3. Withholding tax obligation under Section 195, requirement of Form 15CA (Part D / Part C) and Form 15CB by a CA.
4. GST implications: whether this constitutes 'Import of Services' under Section 2(11) of the IGST Act, 2017, applicability of Reverse Charge Mechanism (RCM) under Section 5(3) of IGST Act read with Notification No. 10/2017-IT(R), and Input Tax Credit (ITC) eligibility.
5. FEMA reporting and documentation checklist prior to bank wire transfer.`,
  },
  {
    id: 'preset-slump-sale',
    title: 'Slump Sale (S. 50B) vs Itemized Asset Sale (S. 50)',
    mode: 'comparison',
    tag: 'M&A & Corporate Tax',
    summary: 'Selling an operational manufacturing division for ₹15 Crore lump sum vs cherry-picking assets.',
    context: {
      entityType: 'Public Limited Company',
      industry: 'Chemical & Polymer Manufacturing',
      financialYear: 'FY 2024-25',
      amount: '₹15,00,000,000',
      jurisdiction: 'Domestic (Gujarat, India)',
      taxStatus: 'Audited Company',
    },
    options: {
      treatments: 'Slump Sale as a Going Concern u/s 50B vs Itemized Asset-by-Asset Sale u/s 50',
    },
    promptInput: `A Gujarat-based chemical manufacturer wishes to divest its specialty coating manufacturing undertaking to a strategic buyer for a lump-sum monetary consideration of ₹15 Crore.
The undertaking includes freehold factory land, RCC industrial buildings, imported machinery (written down value ₹4.2 Crore, fair market value ₹7.5 Crore), raw material inventory (book value ₹1.1 Crore), customer contracts, patents, and transfer of 45 permanent factory workers with continuous service.
Please compare:
Treatment A: Transfer as a 'Slump Sale' of an entire business undertaking as a going concern under Section 2(42C) read with Section 50B of the Income-tax Act, 1961 and Rule 11UAE for Fair Market Value (FMV) computation.
Treatment B: Itemized asset-by-asset sale with individual price allocation for land, plant & machinery (Section 50 short term capital gain on block of assets), inventory (business income), and intellectual property.
Compare statutory conditions, calculation of Net Worth, short-term vs long-term capital gains period (whether held > 36 months), applicability of indexation, GST treatment (Schedule II Para 4(c) going concern exemption via Notification 12/2017-CT(R)), Stamp Duty implications, and ROC filing requirements under Section 180(1)(a) of Companies Act, 2013.`,
  },
  {
    id: 'preset-it-notice-148a',
    title: 'Income Tax Notice u/s 148A(b) - SFT Cash Deposits (AY 2021-22)',
    mode: 'notice',
    tag: 'Litigation & Notice Defense',
    summary: 'Notice issued by NeAC alleging ₹1.25 Crore unexplained cash deposits during demonetization / COVID period under S. 68.',
    context: {
      entityType: 'Partnership Firm',
      industry: 'Wholesale Food Grain Distribution',
      financialYear: 'AY 2021-22 (FY 2020-21)',
      amount: '₹1,25,00,000',
      jurisdiction: 'Delhi, India',
      taxStatus: 'Regular Assessee',
    },
    promptInput: `NOTICE SUMMARY & REPRODUCED EXTRACT:
Authority: National Faceless Assessment Centre (NeAC) / Income Tax Officer, Ward 24(1), New Delhi
Notice Type: Notice under clause (b) of Section 148A of the Income-tax Act, 1961
Date of Notice: 18th March 2024
DIN: ITBA/AST/F/148A(b)/2023-24/1061928472
Assessment Year: 2021-22
Subject: Show Cause Notice under Section 148A(b) of the Income-tax Act, 1961 for reopening of assessment.

Text of Notice Allegations:
"1. Information has been flagged and made available to this office in accordance with the risk management strategy formulated by the CBDT under Section 148 of the Act, revealing that during Financial Year 2020-21 (AY 2021-22), you have made cash deposits aggregating to ₹1,25,40,000 in Current Account No. XXXXXXXXXX5412 maintained with HDFC Bank, Chandni Chowk Branch.
2. On perusal of the ITR filed by you for AY 2021-22 under acknowledgment no. 88392019482, total returned income is declared at ₹8,40,200 on gross turnover of ₹2,10,00,000.
3. The huge cash deposits of ₹1,25,40,000 are completely disproportionate to the returned business income and appear to be unexplained cash credits / undisclosed income chargeable to tax that has escaped assessment within the meaning of Section 147.
4. You are hereby required to show cause within 14 days of receipt of this notice as to why an order under Section 148A(d) should not be passed and why a notice under Section 148 should not be issued.
5. Failure to submit reply on the e-filing portal on or before 1st April 2024 shall result in an ex-parte order on the basis of available material."

Please formulate:
1. Notice summary with critical deadlines and limitation analysis.
2. Statutory test under amended Section 148 / 148A (Finance Act 2021) — necessity of specified approval u/s 151, 'information with the AO' criteria.
3. Evidentiary rebuttal strategy: reconciling cash sales with VAT/GST returns (GSTR-1 & 3B), cash book, bank statements, stock register, and audited financial statements.
4. Distinction between gross receipts/turnover vs taxable income (taxing entire cash deposit vs peak credit / gross profit rate under judicial precedents like CIT v. President Industries).
5. Comprehensive paragraph-wise draft reply ready for e-filing.`,
  },
  {
    id: 'preset-gst-drc01',
    title: 'GST SCN Form DRC-01 - 2B Mismatch & S. 17(5) Disallowance',
    mode: 'notice',
    tag: 'GST Audit & DRC-01',
    summary: 'Show cause notice u/s 73 demanding ₹14.5 Lakhs ITC on motor vehicles and vendor 2B mismatches.',
    context: {
      entityType: 'Private Limited Company',
      industry: 'IT Hardware & Facilities Management',
      financialYear: 'FY 2019-20 / FY 2020-21',
      amount: '₹14,50,000 + Interest & Penalty',
      jurisdiction: 'Karnataka State GST',
      taxStatus: 'Regular GST Registered',
    },
    promptInput: `GST NOTICE DETAILS:
Authority: Assistant Commissioner of Commercial Taxes, LGSTO-085, Bengaluru, Karnataka
Form: GST DRC-01 (Show Cause Notice under Section 73(1) of the CGST / KGST Act, 2017)
Notice Reference: ACCT/LGSTO-85/DRC-01/2023-24/T-992
Date: 22nd November 2023
Tax Period: FY 2019-20
Amount Demanded:
- CGST: ₹7,25,000 | SGST: ₹7,25,000 (Total ITC Disallowance: ₹14,50,000)
- Interest under Section 50: ₹5,22,000
- Penalty under Section 73(9): ₹1,45,000 (10% of tax)

Allegations:
Issue 1: Excess Input Tax Credit claimed in GSTR-3B amounting to ₹9,80,000 as compared to auto-populated GSTR-2A/2B. Notice alleges violation of Section 16(2)(c) read with Rule 36(4).
Issue 2: Ineligible ITC of ₹4,70,000 availed on purchase of Toyota Innova passenger vehicles used for executive staff transport and commercial building annual maintenance contracts with food catering, alleged to be strictly blocked credits under Section 17(5)(a) and Section 17(5)(b)(i) of the CGST Act.

Please analyze:
1. Legal validity of DRC-01 on 2A vs 3B mismatch for FY 2019-20 in light of CBIC Circular No. 183/15/2022-GST and Supreme Court / High Court rulings (e.g., Bharti Airtel, Suncraft Energy).
2. Defense for motor vehicle ITC (seating capacity check u/s 17(5)(a) vs commercial transport).
3. Statutory documentation checklist required from suppliers (CA certificate for supplier tax deposit, payment proof u/s 16(2)(b)).
4. Interest liability calculation under amended Section 50(3) (leviable only on ITC wrongly availed AND utilized, not merely availed).
5. Comprehensive response strategy and draft submission template.`,
  },
  {
    id: 'preset-tds-194q-vs-206c',
    title: 'Interplay of Section 194Q (TDS) vs Section 206C(1H) (TCS)',
    mode: 'comparison',
    tag: 'Direct Tax Compliance',
    summary: 'High-volume business transactions > ₹50 Lakhs between two entities each having turnover > ₹10 Crore.',
    context: {
      entityType: 'Private Limited Company',
      industry: 'Steel & Construction Materials Trading',
      financialYear: 'FY 2024-25',
      amount: '₹1,80,00,000',
      jurisdiction: 'Domestic (Maharashtra)',
      taxStatus: 'Corporate Buyer & Seller',
    },
    options: {
      treatments: 'Section 194Q TDS by Buyer vs Section 206C(1H) TCS by Seller',
    },
    promptInput: `Company Alpha (Buyer) purchases hot rolled steel coils worth ₹1.80 Crore during FY 2024-25 from Company Beta (Seller).
Both Company Alpha and Company Beta had gross business turnover of ₹45 Crore and ₹70 Crore respectively in the preceding FY 2023-24.
Both parties are unsure who has the primary statutory obligation to deduct or collect tax:
- Should Buyer deduct TDS @ 0.1% under Section 194Q at the time of credit or payment?
- Or should Seller collect TCS @ 0.1% under Section 206C(1H) upon receiving consideration?
- What is the statutory tie-breaking mechanism provided under Section 194Q(5) and Section 206C(1H) second proviso?
- What happens if the buyer fails to deduct TDS u/s 194Q: can the seller collect TCS? What is the disallowance consequence under Section 40(a)(ia) (30% disallowance of purchase expense)?
- Provide a clear workflow and contract clause recommendation to prevent double withholding/collection and disallowances.`,
  },
  {
    id: 'preset-advisory-memo-subsidiary',
    title: 'Advisory Note: Transfer of Business to Wholly-Owned Subsidiary',
    mode: 'advisory_memo',
    tag: 'Corporate Restructuring',
    summary: 'Formal Tax & Regulatory Advisory Note for transferring an IT SaaS division into a newly formed Indian subsidiary.',
    context: {
      entityType: 'Public Listed Company',
      industry: 'Enterprise Software & Cloud Platforms',
      financialYear: 'FY 2024-25 / FY 2025-26',
      amount: '₹35,00,00,000',
      jurisdiction: 'India (Pan-India)',
      taxStatus: 'Listed Parent Company',
    },
    options: {
      subject: 'Tax, Secretarial & GST Implications of Transferring SaaS Product Division to Wholly-Owned Subsidiary (WoS)',
      client: 'Board of Directors & Audit Committee, TechVentures India Limited',
    },
    promptInput: `TechVentures India Limited (a listed Indian entity) proposes to hive off its enterprise HR-tech SaaS software division to a newly incorporated wholly-owned subsidiary (WoS) named Talenta Technologies Private Limited.
Transaction consideration will be settled entirely through the issuance of 100% equity shares by the WoS to the parent company.
The net book value of assets (servers, software code, intellectual property, unamortized R&D) is ₹18 Crore; the independent valuation for share swap is ₹35 Crore.
The management requires a comprehensive, formal Tax and Regulatory Advisory Note analyzing:
1. Exemption from capital gains under Section 47(iv) of the Income-tax Act, 1961 (transfer of capital asset by parent to 100% Indian subsidiary) and the 8-year holding condition under Section 47A.
2. Treatment of Intellectual Property, brand transfer, and accumulated tax losses/depreciation under Section 72A.
3. GST implications: whether transfer of division as going concern is exempt under Notification 12/2017-CT(R), and ITC transfer in Form GST ITC-02 under Section 18(3) read with Rule 41.
4. Companies Act 2013 compliances: Board approval, shareholder approval under Section 180(1)(a) (undertaking test), related party transaction under Section 188 / SEBI LODR Regulation 23.
5. Stamp duty on business transfer agreement and share issuance.
Please generate the complete 11-section formal Tax & Regulatory Advisory Note with all required professional sections.`,
  },
];
