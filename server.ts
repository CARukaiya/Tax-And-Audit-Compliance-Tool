import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '20mb' }));

// Server-side Gemini AI client initialization
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SYSTEM_INSTRUCTION = `
You are an expert India Tax & Regulatory Advisory Copilot designed to assist Chartered Accountants, CFOs, corporate tax lawyers, and finance professionals with preliminary tax, accounting, and regulatory research.

YOUR CORE THINKING PARADIGM:
Facts → Applicable law → Applicability → Analysis → Tax/Regulatory impact → Compliance requirement → Risk → Recommended next steps → Sources

CRITICAL COMPLIANCE RULES:
1. Never invent or hallucinate a section number, notification, circular, case law, deadline, threshold, exemption, rate, or regulatory requirement.
2. If authoritative information is unavailable or unverified, explicitly state:
   "Authoritative source not verified — professional verification required."
3. Distinguish sharply between:
   - Statutory provisions (Acts)
   - Rules
   - CBDT/CBIC Circulars and Notifications
   - Judicial interpretations (Supreme Court, High Courts, ITAT, AAR)
   - Practical market interpretations
   - Stated assumptions
4. Under substantive answers, provide a confidence indicator:
   Confidence: High / Moderate / Low (with concise rationale).
5. For Risks, classify as HIGH, MEDIUM, or LOW with clear exposure reasons.
6. Provide structured, source-grounded, practical advisory analysis.

MODES OF ANALYSIS:

[MODE A: SCENARIO / 8-STEP WORKFLOW]
Follow this exact 8-step structure:
### STEP 1 — FACT PATTERN
- Entity type, industry, transaction description, counterparty details, transaction value, jurisdiction/location, tax status, available documents.
### STEP 2 — FACT GAPS
- "Additional information required" (missing facts that could materially alter taxability/compliance) & "Explicit assumptions made".
### STEP 3 — ISSUE IDENTIFICATION
- Numbered core legal/tax/regulatory questions framed precisely.
### STEP 4 — APPLICABLE LAW
- Specific Acts, Sections, Rules, Notifications, Circulars, and Precedents with brief relevance explanation.
### STEP 5 — ANALYSIS
- Detailed Rule → Facts → Application → Result.
- Clearly tag: [Confirmed Statutory Position], [Likely Judicial Interpretation], or [Requires Verification].
### STEP 6 — TAX & REGULATORY IMPACT
- Direct taxability, withholding/TDS/TCS rates & thresholds, GST supply/RCM/ITC eligibility, ROC/MCA filings, accounting disclosure, potential interest & penalty liabilities.
### STEP 7 — RISK FLAGS
- HIGH / MEDIUM / LOW risk breakdown with detailed exposure rationale.
### STEP 8 — ACTION PLAN
- Immediate Actions, Before Filing / Return Due Date, If Challenged / Scrutiny Defense.
### SOURCES & CITATIONS
- Detailed list of Act, Section/Rule/Notification, and authoritative rationale.

[MODE B: NOTICE & ASSESSMENT MODE]
When reviewing a tax or regulatory notice:
1. Notice Summary: Authority, Notice type, Date, AY / FY, DIN / Reference number (if provided), Issue raised, Disputed amount, Sections invoked, Response statutory deadline.
2. Core Issues Raised: Breakdown of the officer's allegations.
3. Legal Provisions Cited: Strict statutory analysis of invoked sections (e.g. S. 148 / 148A, S. 143(2), S. 142(1), S. 68/69, S. 133(6), DRC-01, ASMT-10).
4. Evidentiary & Reconciled Documents Required: Concrete checklist of proof (bank statements, ledgers, e-way bills, 2B recos, agreements).
5. Defence & Response Strategy: Procedural objections (jurisdiction, limitation, sanction u/s 151) + Merits defense.
6. Information Gaps & Urgent Queries.
7. Structured Draft Response Outline: Formal paragraph-by-paragraph reply template ready for CA customization.

[MODE C: COMPARISON MODE]
When comparing two legal options (e.g. Slump Sale u/s 50B vs Asset Sale; Old Tax Regime vs New Regime; Section 194Q vs 206C(1H); Job Work vs Works Contract):
Produce an exhaustive markdown comparison table with:
- Issue / Parameter
- Treatment A
- Treatment B
- Statutory Legal Basis
- Mandatory Conditions
- Direct Tax Impact
- GST / Indirect Tax Impact
- Secretarial / MCA Compliance
- Key Risks & Exposure
- Practical CA Recommendation

[MODE D: DOCUMENT REVIEW MODE]
When reviewing contracts, invoices, board resolutions, or computation notes:
A. Fact & Clause Extraction
B. Statutory Compliance & Withholding Check (TDS, GST RCM, Place of supply)
C. Risk Flags & Ambiguous Clauses (e.g., indemnity, Make-Available clause, PE exposure, missing GSTIN or TRC)
D. Financial & Regulatory Implications
E. Actionable Remediation Checklist

[MODE E: ADVISORY MEMO MODE]
Generate a formal, publication-ready:
# TAX / REGULATORY ADVISORY NOTE
Subject:
Date:
Prepared for:
Issue:
1. Background
2. Facts Considered
3. Questions Presented
4. Applicable Law & Regulatory Framework
5. In-depth Legal Analysis
6. Tax / Regulatory Implications & Calculations
7. Risks and Uncertainties (High / Medium / Low)
8. Recommended Actions (Immediate, Filing, Long-term)
9. Documents / Information Required
10. Official Sources & Authorities Cited
11. Professional Disclaimer

Always maintain utmost professionalism, rigor, clarity, and precision. Never encourage tax evasion or artificial transactions.
`;

// Resilient model caller with retry and cluster fallback
const CANDIDATE_MODELS = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];

async function generateWithFallback(params: any): Promise<any> {
  let lastError: any = null;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      return await ai.models.generateContent({
        ...params,
        model: modelName,
      });
    } catch (err: any) {
      lastError = err;
      const isUnavailable =
        err?.message?.includes('503') ||
        err?.message?.includes('high demand') ||
        err?.message?.includes('UNAVAILABLE') ||
        err?.status === 503 ||
        err?.code === 503;

      if (isUnavailable) {
        console.warn(`[Gemini API] Model ${modelName} unavailable (503/high demand). Trying fallback candidate...`);
        // Brief 400ms pause before trying next model
        await new Promise((res) => setTimeout(res, 400));
        continue;
      }
      // If it's a non-503 fatal error, throw immediately
      throw err;
    }
  }

  throw lastError;
}

// Advisory generation endpoint
app.post('/api/advisory/analyze', async (req: Request, res: Response) => {
  try {
    const { mode, input, context, options } = req.body;

    if (!input || typeof input !== 'string') {
      res.status(400).json({ error: 'Input query or scenario text is required.' });
      return;
    }

    let userPrompt = '';
    const contextDetails = context
      ? `\n\nADDITIONAL CONTEXT:\n- Entity Type: ${context.entityType || 'Not specified'}\n- Industry: ${context.industry || 'Not specified'}\n- Relevant FY/AY: ${context.financialYear || 'Current FY 2024-25 / AY 2025-26'}\n- Turnover / Amount: ${context.amount || 'Not specified'}\n- Counterparty Jurisdiction: ${context.jurisdiction || 'Domestic (India)'}\n- Tax Status: ${context.taxStatus || 'Standard Corporate/Business'}`
      : '';

    switch (mode) {
      case 'notice':
        userPrompt = `Please analyze the following Indian tax or regulatory notice in NOTICE / ASSESSMENT MODE:\n\n"""\n${input}\n"""${contextDetails}`;
        break;
      case 'comparison':
        userPrompt = `Please compare the following tax or regulatory treatments in COMPARISON MODE:\n\nTreatments / Options to Compare: ${options?.treatments || 'Treatment A vs Treatment B'}\n\nScenario / Details:\n"""\n${input}\n"""${contextDetails}`;
        break;
      case 'document_review':
        userPrompt = `Please perform a thorough professional review of the following document / agreement / computation in DOCUMENT REVIEW MODE:\n\n"""\n${input}\n"""${contextDetails}`;
        break;
      case 'advisory_memo':
        userPrompt = `Please draft a formal, comprehensive TAX / REGULATORY ADVISORY NOTE in ADVISORY MEMO MODE for the following scenario:\n\nSubject: ${options?.subject || 'Tax & Regulatory Position Analysis'}\nClient / Prepared for: ${options?.client || 'Senior Management / Board of Directors'}\n\nFacts & Details:\n"""\n${input}\n"""${contextDetails}`;
        break;
      case 'compliance_query':
        userPrompt = `Please answer the following Indian compliance deadline and regulatory query:\n\n"""\n${input}\n"""${contextDetails}`;
        break;
      case 'scenario':
      default:
        userPrompt = `Please analyze the following business transaction or tax scenario using the full 8-STEP ADVISORY WORKFLOW:\n\n"""\n${input}\n"""${contextDetails}`;
        break;
    }

    const response = await generateWithFallback({
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2, // Low temperature for high analytical accuracy and consistency
      },
    });

    const analysisText = response.text || 'Unable to generate analysis. Please try again.';

    res.json({
      success: true,
      analysis: analysisText,
      mode,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error generating advisory analysis:', error);
    res.status(500).json({
      error: error.message || 'Internal server error processing advisory request.',
    });
  }
});

// Quick statutory query endpoint for targeted section research
app.post('/api/advisory/section-lookup', async (req: Request, res: Response) => {
  try {
    const { sectionQuery, lawType } = req.body;

    if (!sectionQuery) {
      res.status(400).json({ error: 'Section query is required.' });
      return;
    }

    const prompt = `Provide an authoritative, strictly verified analysis of the following statutory provision in Indian law:
Query / Provision: "${sectionQuery}"
Law Domain: ${lawType || 'Income Tax / GST / Companies Act'}

Provide:
1. Exact Section / Rule title & Act
2. Current statutory threshold, rate, or mandate (AY 2025-26 / FY 2024-25)
3. Key conditions for applicability
4. Relevant Circulars / Notifications
5. Common pitfalls, disallowances (e.g. S. 40(a)(ia)), or penalties
6. Authoritative source citation
Remember: If any rate or threshold is subject to conditions or not verified, state "Authoritative source not verified — professional verification required."`;

    const response = await generateWithFallback({
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.1,
      },
    });

    res.json({
      success: true,
      result: response.text || 'No results found.',
    });
  } catch (error: any) {
    console.error('Error in section lookup:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'VidhiTax Copilot Backend' });
});

// Setup Vite in development or static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`VidhiTax Copilot server running on port ${port}`);
  });
}

startServer();
