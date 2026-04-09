export const DOCUMENT_FIELDS = {
  // Common documents
  common: [
    {
      name: "incomeProof",
      label: "Income Proof",
      required: true,
      accept: ".pdf,.jpg,.jpeg,.png",
      maxSize: 10 * 1024 * 1024, // 10MB
      description: "Salary slip, ITR, or other income proof"
    },
    {
      name: "bankStatement",
      label: "Bank Statement",
      required: true,
      accept: ".pdf,.jpg,.jpeg,.png",
      maxSize: 10 * 1024 * 1024,
      description: "Last 6-12 months bank statements"
    },
    {
      name: "creditReport",
      label: "Credit Report",
      required: true,
      accept: ".pdf,.jpg,.jpeg,.png",
      maxSize: 10 * 1024 * 1024,
      description: "CIBIL, Experian, or other credit report"
    },
    {
      name: "additionalDocs",
      label: "Additional Documents (optional)",
      required: false,
      accept: ".pdf,.jpg,.jpeg,.png,.doc,.docx",
      maxSize: 10 * 1024 * 1024,
      multiple: true,
      maxCount: 5,
      description: "Any additional supporting documents"
    }
  ],

  // Startup specific
  startup: [
    {
      name: "pitchDeck",
      label: "Pitch Deck",
      required: true,
      accept: ".pdf,.ppt,.pptx",
      maxSize: 10 * 1024 * 1024,
      description: "Business presentation and pitch deck"
    },
    {
      name: "financialProjections",
      label: "Financial Projections",
      required: true,
      accept: ".pdf,.xls,.xlsx",
      maxSize: 10 * 1024 * 1024,
      description: "3-5 year financial projections"
    },
    {
      name: "capTable",
      label: "Cap Table",
      required: true,
      accept: ".pdf,.xls,.xlsx",
      maxSize: 10 * 1024 * 1024,
      description: "Capitalization table showing ownership"
    },
    {
      name: "incorporationCertificate",
      label: "Incorporation Certificate",
      required: true,
      accept: ".pdf,.jpg,.jpeg,.png",
      maxSize: 10 * 1024 * 1024,
      description: "Company incorporation certificate"
    },
    {
      name: "startupBankStatement",
      label: "Business Bank Statement",
      required: false,
      accept: ".pdf,.jpg,.jpeg,.png",
      maxSize: 10 * 1024 * 1024,
      description: "Business bank statements (optional)"
    },
    {
      name: "tractionProof",
      label: "Traction Proof",
      required: false,
      accept: ".pdf,.jpg,.jpeg,.png,.doc,.docx",
      maxSize: 10 * 1024 * 1024,
      description: "User analytics, revenue proof, etc. (optional)"
    }
  ],

  // Business specific
  business: [
    {
      name: "cashFlow",
      label: "Cash Flow Statement",
      required: true,
      accept: ".pdf,.xls,.xlsx",
      maxSize: 10 * 1024 * 1024,
      description: "Cash flow statement for the business"
    },
    {
      name: "balanceSheet",
      label: "Balance Sheet",
      required: true,
      accept: ".pdf,.xls,.xlsx",
      maxSize: 10 * 1024 * 1024,
      description: "Balance sheet of the business"
    },
    {
      name: "profitLoss",
      label: "Profit & Loss Statement",
      required: true,
      accept: ".pdf,.xls,.xlsx",
      maxSize: 10 * 1024 * 1024,
      description: "Profit and loss statement"
    },
    {
      name: "gstReturns",
      label: "GST Returns (optional)",
      required: false,
      accept: ".pdf,.jpg,.jpeg,.png",
      maxSize: 10 * 1024 * 1024,
      description: "GST return documents"
    },
    {
      name: "itrReturns",
      label: "ITR Returns (optional)",
      required: false,
      accept: ".pdf,.jpg,.jpeg,.png",
      maxSize: 10 * 1024 * 1024,
      description: "Income tax return documents"
    },
    {
      name: "businessRegistration",
      label: "Business Registration",
      required: true,
      accept: ".pdf,.jpg,.jpeg,.png",
      maxSize: 10 * 1024 * 1024,
      description: "Business registration certificate"
    },
    {
      name: "businessBankStatement",
      label: "Business Bank Statement",
      required: false,
      accept: ".pdf,.jpg,.jpeg,.png",
      maxSize: 10 * 1024 * 1024,
      description: "Business bank statements (optional)"
    },
    {
      name: "invoiceRecords",
      label: "Invoice Records (optional)",
      required: false,
      accept: ".pdf,.jpg,.jpeg,.png,.xls,.xlsx",
      maxSize: 10 * 1024 * 1024,
      description: "Business invoice records"
    }
  ],

  // Property specific
  property: [
    {
      name: "saleDeed",
      label: "Sale Deed",
      required: true,
      accept: ".pdf,.jpg,.jpeg,.png",
      maxSize: 10 * 1024 * 1024,
      description: "Property sale deed document"
    },
    {
      name: "titleDeed",
      label: "Title Deed",
      required: true,
      accept: ".pdf,.jpg,.jpeg,.png",
      maxSize: 10 * 1024 * 1024,
      description: "Property title deed"
    },
    {
      name: "taxReceipt",
      label: "Property Tax Receipt (optional)",
      required: false,
      accept: ".pdf,.jpg,.jpeg,.png",
      maxSize: 10 * 1024 * 1024,
      description: "Property tax payment receipt"
    },
    {
      name: "encumbrance",
      label: "Encumbrance Certificate (optional)",
      required: false,
      accept: ".pdf,.jpg,.jpeg,.png",
      maxSize: 10 * 1024 * 1024,
      description: "Encumbrance certificate"
    },
    {
      name: "landRecords",
      label: "Land Records (optional)",
      required: false,
      accept: ".pdf,.jpg,.jpeg,.png",
      maxSize: 10 * 1024 * 1024,
      description: "Land record documents"
    },
    {
      name: "buildingApproval",
      label: "Building Approval (optional)",
      required: false,
      accept: ".pdf,.jpg,.jpeg,.png",
      maxSize: 10 * 1024 * 1024,
      description: "Building approval documents"
    },
    {
      name: "propertyInsurance",
      label: "Property Insurance (optional)",
      required: false,
      accept: ".pdf,.jpg,.jpeg,.png",
      maxSize: 10 * 1024 * 1024,
      description: "Property insurance documents"
    },
    {
      name: "valuationReport",
      label: "Valuation Report (optional)",
      required: false,
      accept: ".pdf,.jpg,.jpeg,.png",
      maxSize: 10 * 1024 * 1024,
      description: "Third-party property valuation report"
    },
    {
      name: "occupancyCertificate",
      label: "Occupancy Certificate (optional)",
      required: false,
      accept: ".pdf,.jpg,.jpeg,.png",
      maxSize: 10 * 1024 * 1024,
      description: "Property occupancy certificate"
    },
    {
      name: "noObjectionCertificates",
      label: "No Objection Certificates (optional)",
      required: false,
      accept: ".pdf,.jpg,.jpeg,.png",
      multiple: true,
      maxCount: 5,
      maxSize: 10 * 1024 * 1024,
      description: "NOC from relevant authorities"
    }
  ]
};