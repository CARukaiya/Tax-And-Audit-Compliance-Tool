export type AdvisoryMode =
  | 'scenario'
  | 'notice'
  | 'comparison'
  | 'document_review'
  | 'advisory_memo'
  | 'compliance_query';

export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type ConfidenceLevel = 'High' | 'Moderate' | 'Low';

export interface AdvisoryContext {
  entityType: string;
  industry: string;
  financialYear: string;
  amount: string;
  jurisdiction: string;
  taxStatus: string;
}

export interface ComplianceDeadline {
  id: string;
  title: string;
  authority: 'Income Tax' | 'GST' | 'MCA' | 'TDS/TCS' | 'FEMA' | 'Labour/EPF';
  applicableEntity: string;
  period: string;
  dueDate: string;
  statutoryProvision: string;
  consequenceOfDelay: string;
  source: string;
  category: 'Monthly' | 'Quarterly' | 'Annual' | 'Event-based';
  isImportant?: boolean;
}

export interface TdsSectionRule {
  section: string;
  natureOfPayment: string;
  payeeType: 'Resident' | 'Non-Resident' | 'Both';
  thresholdLimit: string;
  standardRate: number; // in percentage
  reducedRate?: number;
  rateWithoutPan: number; // Section 206AA
  rateNonFiler: number; // Section 206AB
  keyConditions: string;
  statutoryReference: string;
  challanType: string;
  quarterlyReturn: string;
}

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

export interface PresetScenario {
  id: string;
  title: string;
  mode: AdvisoryMode;
  tag: string;
  summary: string;
  context: Partial<AdvisoryContext>;
  promptInput: string;
  options?: Record<string, string>;
}
