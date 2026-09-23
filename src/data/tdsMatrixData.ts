import { TdsSectionRule } from '../types';

export const TDS_SECTIONS_DATABASE: TdsSectionRule[] = [
  {
    section: '194C',
    natureOfPayment: 'Payment to Contractors & Sub-contractors (Works Contract, Advertising, Transport, Catering)',
    payeeType: 'Resident',
    thresholdLimit: '₹30,000 (single contract) or ₹1,00,000 (aggregate during FY)',
    standardRate: 1.0, // 1% for Individual/HUF, 2% for others
    reducedRate: 2.0, // Used for other than Ind/HUF
    rateWithoutPan: 20.0,
    rateNonFiler: 5.0,
    keyConditions:
      '1% if payee is Individual/HUF; 2% for Company/Firm/LLP. No TDS on transport contractor if they own <= 10 goods carriages and furnish PAN with declaration u/s 194C(6). Does not apply to personal purpose contracts by Ind/HUF.',
    statutoryReference: 'Section 194C of Income-tax Act, 1961',
    challanType: 'ITNS 281',
    quarterlyReturn: 'Form 26Q',
  },
  {
    section: '194J(a)',
    natureOfPayment: 'Fees for Technical Services (FTS) / Royalty for Sale/Distribution of Computer Software',
    payeeType: 'Resident',
    thresholdLimit: '₹30,000 aggregate during FY',
    standardRate: 2.0,
    rateWithoutPan: 20.0,
    rateNonFiler: 5.0,
    keyConditions:
      'Reduced rate of 2% specifically applies to Fees for Technical Services (not professional services) and royalty for sale, distribution, or exhibition of cinematographic films or computer software (Finance Act 2020 amendment).',
    statutoryReference: 'Section 194J(1) first proviso (a) of Income-tax Act, 1961',
    challanType: 'ITNS 281',
    quarterlyReturn: 'Form 26Q',
  },
  {
    section: '194J(b)',
    natureOfPayment: 'Fees for Professional Services, Royalty (general), Non-Compete Fees, Director Remuneration',
    payeeType: 'Resident',
    thresholdLimit: '₹30,000 aggregate during FY (No threshold for Director Remuneration/Sitting Fees)',
    standardRate: 10.0,
    rateWithoutPan: 20.0,
    rateNonFiler: 20.0,
    keyConditions:
      '10% applies to legal, medical, engineering, architectural, accountancy, technical consultancy, interior decoration, or notified professions. For Director remuneration/sitting fees not taxable as salary, TDS @ 10% applies with ZERO threshold.',
    statutoryReference: 'Section 194J(1) & (1)(ba) of Income-tax Act, 1961',
    challanType: 'ITNS 281',
    quarterlyReturn: 'Form 26Q',
  },
  {
    section: '194Q',
    natureOfPayment: 'TDS on Purchase of Goods exceeding ₹50 Lakhs',
    payeeType: 'Resident',
    thresholdLimit: 'Value or aggregate purchase of goods exceeding ₹50 Lakhs in the FY',
    standardRate: 0.1,
    rateWithoutPan: 5.0,
    rateNonFiler: 5.0,
    keyConditions:
      'Applicable ONLY if buyer’s total sales/turnover from business exceeded ₹10 Crore in immediately preceding FY. TDS @ 0.1% on value exceeding ₹50 Lakhs. If transaction is covered under 194Q, TCS u/s 206C(1H) shall NOT apply.',
    statutoryReference: 'Section 194Q of Income-tax Act, 1961 (inserted w.e.f. 01-07-2021) read with Circular 13/2021',
    challanType: 'ITNS 281',
    quarterlyReturn: 'Form 26Q',
  },
  {
    section: '206C(1H)',
    natureOfPayment: 'TCS on Receipt of Sale Consideration for Goods exceeding ₹50 Lakhs',
    payeeType: 'Resident',
    thresholdLimit: 'Receipt of consideration exceeding ₹50 Lakhs in the FY',
    standardRate: 0.1,
    rateWithoutPan: 1.0,
    rateNonFiler: 5.0,
    keyConditions:
      'Seller’s turnover must exceed ₹10 Crore in preceding FY. Secondary to Section 194Q: if buyer is liable to deduct TDS u/s 194Q and has deducted it, seller shall not collect TCS u/s 206C(1H).',
    statutoryReference: 'Section 206C(1H) of Income-tax Act, 1961',
    challanType: 'ITNS 281',
    quarterlyReturn: 'Form 27EQ',
  },
  {
    section: '194I(a)',
    natureOfPayment: 'Rent on Plant, Machinery or Equipment',
    payeeType: 'Resident',
    thresholdLimit: '₹2,40,000 aggregate during FY',
    standardRate: 2.0,
    rateWithoutPan: 20.0,
    rateNonFiler: 5.0,
    keyConditions:
      'Deductible by all persons except Ind/HUF not liable to audit u/s 44AB. Composite lease must be bifurcated where feasible.',
    statutoryReference: 'Section 194-I(a) of Income-tax Act, 1961',
    challanType: 'ITNS 281',
    quarterlyReturn: 'Form 26Q',
  },
  {
    section: '194I(b)',
    natureOfPayment: 'Rent on Land, Building (including factory building) or Furniture/Fittings',
    payeeType: 'Resident',
    thresholdLimit: '₹2,40,000 aggregate during FY',
    standardRate: 10.0,
    rateWithoutPan: 20.0,
    rateNonFiler: 20.0,
    keyConditions:
      'Advance rent is subject to TDS in the year of payment. Refundable security deposit does not attract TDS unless adjusted against rent.',
    statutoryReference: 'Section 194-I(b) of Income-tax Act, 1961',
    challanType: 'ITNS 281',
    quarterlyReturn: 'Form 26Q',
  },
  {
    section: '194IA',
    natureOfPayment: 'TDS on Transfer of Immovable Property (other than agricultural land)',
    payeeType: 'Resident',
    thresholdLimit: 'Consideration or Stamp Duty Value (SDV) >= ₹50 Lakhs',
    standardRate: 1.0,
    rateWithoutPan: 20.0,
    rateNonFiler: 5.0,
    keyConditions:
      'TDS @ 1% on higher of actual consideration or Stamp Duty Value (amended by Finance Act 2022). Deductor does not need TAN; uses Form 26QB (challan-cum-statement) within 30 days from end of month.',
    statutoryReference: 'Section 194-IA read with Rule 30(2A) & 31A(4A)',
    challanType: 'Form 26QB (Challan-cum-statement)',
    quarterlyReturn: 'Form 26QB directly generates Form 16B',
  },
  {
    section: '194H',
    natureOfPayment: 'Commission or Brokerage',
    payeeType: 'Resident',
    thresholdLimit: '₹15,000 aggregate during FY',
    standardRate: 2.0, // Reduced from 5% to 2% w.e.f. 01.10.2024 by Finance (No. 2) Act 2024
    rateWithoutPan: 20.0,
    rateNonFiler: 5.0,
    keyConditions:
      'Statutory rate reduced to 2% effective 1st October 2024 by Finance (No. 2) Act, 2024. Does not include insurance commission covered u/s 194D.',
    statutoryReference: 'Section 194H as amended by Finance (No. 2) Act, 2024',
    challanType: 'ITNS 281',
    quarterlyReturn: 'Form 26Q',
  },
  {
    section: '195',
    natureOfPayment: 'Payments to Non-Resident / Foreign Company (Interest, Royalty, FTS, Capital Gains, Other Sums)',
    payeeType: 'Non-Resident',
    thresholdLimit: 'NIL (Any sum chargeable to tax under the provisions of the Act)',
    standardRate: 20.0, // Domestic rate for FTS/Royalty (plus applicable surcharge & 4% cess) or DTAA rate
    rateWithoutPan: 20.0,
    rateNonFiler: 20.0,
    keyConditions:
      'Payer can apply DTAA rate under Section 90(2) if more beneficial, provided Non-Resident furnishes Tax Residency Certificate (TRC), Form 10F (electronically via IT portal), and No-PE Declaration. Remittance requires Form 15CA (Part A/B/C/D) and Form 15CB certification from a Chartered Accountant.',
    statutoryReference: 'Section 195 read with Section 90(2), 115A & Rules 21AB, 37BB',
    challanType: 'ITNS 281',
    quarterlyReturn: 'Form 27Q & Forms 15CA/15CB',
  },
];

export interface GstRcmCategory {
  serviceName: string;
  supplier: string;
  recipient: string;
  notification: string;
  cgstRate: string;
  igstRate: string;
  itcAvailable: string;
  mandatoryCondition: string;
}

export const GST_RCM_DATABASE: GstRcmCategory[] = [
  {
    serviceName: 'Goods Transport Agency (GTA) Services (opting 5% without ITC)',
    supplier: 'Goods Transport Agency (GTA) who has not issued invoice with 12% forward charge declaration',
    recipient: 'Factory, Registered Society, Cooperative Society, Body Corporate, Partnership Firm, Registered Person',
    notification: 'Notification No. 13/2017-Central Tax (Rate) Entry 1',
    cgstRate: '2.5% CGST + 2.5% SGST',
    igstRate: '5% IGST',
    itcAvailable: 'Yes, full ITC available to recipient in GSTR-3B if used in furtherance of business',
    mandatoryCondition: 'Tax must be discharged in CASH ledger (electronic credit ledger cannot pay RCM liability u/s 49(4)).',
  },
  {
    serviceName: 'Legal Services provided by an Individual Advocate or Senior Advocate or Firm of Advocates',
    supplier: 'Individual advocate (including senior advocate) or firm of advocates',
    recipient: 'Any business entity with aggregate turnover exceeding threshold exemption in preceding FY',
    notification: 'Notification No. 13/2017-Central Tax (Rate) Entry 2',
    cgstRate: '9% CGST + 9% SGST',
    igstRate: '18% IGST',
    itcAvailable: 'Yes, recipient can claim 100% ITC subject to normal section 16/17 conditions',
    mandatoryCondition: 'Business entity must pay via electronic cash ledger and self-invoice u/s 31(3)(f).',
  },
  {
    serviceName: 'Services supplied by a Director of a Company/Body Corporate to the said Company',
    supplier: 'Director (in director capacity, sitting fees, commission not subject to salary TDS u/s 192)',
    recipient: 'The Company or Body Corporate',
    notification: 'Notification No. 13/2017-Central Tax (Rate) Entry 6 read with Circular No. 140/10/2020-GST',
    cgstRate: '9% CGST + 9% SGST',
    igstRate: '18% IGST',
    itcAvailable: 'Yes, company is entitled to full ITC as legitimate business overhead',
    mandatoryCondition: 'Salary payments having employer-employee relationship covered under Schedule III are exempt.',
  },
  {
    serviceName: 'Import of Services (Supply from person outside India to person in India)',
    supplier: 'Person located in non-taxable territory (overseas supplier)',
    recipient: 'Any person located in the taxable territory other than non-taxable online recipient',
    notification: 'Section 5(3) of IGST Act, 2017 read with Notification No. 10/2017-Integrated Tax (Rate) Entry 1',
    cgstRate: 'N/A (Inter-State supply)',
    igstRate: '18% IGST (or applicable rate based on HSN/SAC)',
    itcAvailable: 'Yes, eligible for ITC under Section 16(1) of CGST Act in the month of payment',
    mandatoryCondition: 'Supplier outside India, recipient in India, place of supply in India u/s 13 of IGST Act.',
  },
  {
    serviceName: 'Renting of Residential Dwelling to a Registered Person',
    supplier: 'Any person (registered or unregistered)',
    recipient: 'Any person registered under GST (business entity)',
    notification: 'Notification No. 05/2022-Central Tax (Rate) amending Notification No. 13/2017-CT(R)',
    cgstRate: '9% CGST + 9% SGST',
    igstRate: '18% IGST',
    itcAvailable: 'Blocked u/s 17(5)(g) if used as residence by proprietary proprietor; available if guest house for business',
    mandatoryCondition: 'Exempt if proprietor uses it for own personal residential purpose and not business expense.',
  },
];
