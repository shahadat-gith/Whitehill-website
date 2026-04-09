import fileSchema from "./file.schema.js";

export const documentsSchema = {
  /* =========================
     COMMON (ALL FUNDING TYPES)
     ========================= */
  incomeProof: fileSchema,          // Salary slip / ITR
  bankStatement: fileSchema,        // Last 6–12 months
  creditReport: fileSchema,         // CIBIL / Experian
  additionalDocs: [fileSchema],


  /* =========================
     STARTUP FUNDING
     ========================= */

  pitchDeck: fileSchema,            // Mandatory
  financialProjections: fileSchema, // 3–5 year projections
  capTable: fileSchema,             // Ownership structure
  incorporationCertificate: fileSchema,
  startupBankStatement: fileSchema,
  tractionProof: fileSchema,        // Analytics, revenue proof


  /* =========================
     BUSINESS (SME / VENTURE)
     ========================= */

  cashFlow: fileSchema,             // Mandatory
  balanceSheet: fileSchema,         // Mandatory
  profitLoss: fileSchema,           // Mandatory

  gstReturns: fileSchema,
  itrReturns: fileSchema,           // Income Tax Returns
  businessRegistration: fileSchema, // Company registration
  businessBankStatement: fileSchema,
  invoiceRecords: fileSchema,


  /* =========================
     PROPERTY FUNDING
     ========================= */

  saleDeed: fileSchema,             // Mandatory
  titleDeed: fileSchema,            // Mandatory

  taxReceipt: fileSchema,
  encumbrance: fileSchema,
  landRecords: fileSchema,
  buildingApproval: fileSchema,

  propertyInsurance: fileSchema,
  valuationReport: fileSchema,      // Third-party valuation
  occupancyCertificate: fileSchema,
  noObjectionCertificates: [fileSchema],
};