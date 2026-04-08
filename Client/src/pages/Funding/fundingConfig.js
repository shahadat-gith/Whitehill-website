export const fundTypes = {
  startup: {
    label: "Startup Funding",
    description:
      "Seed capital for early-stage ventures, including product development, team growth, and market launch.",
    endpoint: "startup",
    fields: [
      { name: "companyName", label: "Company / Startup Name", placeholder: "Enter your company name" },
      { name: "sector", label: "Sector", placeholder: "E.g. fintech, healthtech" },
      { name: "description", label: "Description", placeholder: "Describe your product or service", type: "textarea" },
      { name: "stage", label: "Business Stage", placeholder: "E.g. pre-seed, growth" },
      { name: "foundationYear", label: "Foundation Year", placeholder: "E.g. 2023", type: "number" },
      { name: "teamSize", label: "Team Size", placeholder: "Number of full-time team members", type: "number" },
      { name: "businessModel", label: "Business Model", placeholder: "E.g. subscription, marketplace" },
      { name: "website", label: "Company Website", placeholder: "https://" },
    ],
    uploads: [
      { name: "incomeProof", label: "Income Proof" },
      { name: "bankStatement", label: "Bank Statement" },
      { name: "pitchDeck", label: "Pitch Deck", optional: true },
      { name: "additionalDocs", label: "Additional Documents", multiple: true, optional: true },
    ],
  },
  businessVenture: {
    label: "Business Funding",
    description:
      "Growth and working capital to expand operations, strengthen cash flow, and accelerate business performance.",
    endpoint: "business",
    fields: [
      { name: "businessName", label: "Business Name", placeholder: "Enter your business name" },
      { name: "type", label: "Business Type", placeholder: "E.g. service, manufacturing" },
      { name: "industry", label: "Industry", placeholder: "E.g. retail, manufacturing" },
      { name: "yearsInOperation", label: "Years in Operation", placeholder: "E.g. 3", type: "number" },
      { name: "registrationNumber", label: "Registration Number", placeholder: "Enter registration number" },
      { name: "gstNumber", label: "GST Number", placeholder: "Enter GST number" },
      { name: "monthlyRevenue", label: "Monthly Revenue", placeholder: "E.g. 1200000", type: "number" },
      { name: "monthlyProfit", label: "Monthly Profit", placeholder: "E.g. 250000", type: "number" },
      { name: "employees", label: "Employee Count", placeholder: "Total employee count", type: "number" },
      { name: "purposeOfLoan", label: "Purpose of Loan", placeholder: "Describe what you will use the funds for", type: "textarea" },
    ],
    uploads: [
      { name: "cashFlow", label: "Cash Flow Statement" },
      { name: "balanceSheet", label: "Balance Sheet" },
      { name: "profitLoss", label: "Profit & Loss Statement" },
    ],
  },
  property: {
    label: "Property Funding",
    description:
      "Finance secured by land, development projects or title assets with documentary verification and asset-grade evaluation.",
    endpoint: "property",
    fields: [
      { name: "propertyType", label: "Property Type", placeholder: "residential, commercial, land" },
      { name: "subType", label: "Sub-Type", placeholder: "apartment, office, plot" },
      { name: "value", label: "Market Value", placeholder: "Estimated property value", type: "number" },
      { name: "builder", label: "Builder / Developer", placeholder: "Builder or developer name" },
    ],
    uploads: [
      { name: "saleDeed", label: "Sale Deed" },
      { name: "titleDeed", label: "Title Deed" },
      { name: "taxReceipt", label: "Tax Receipt" },
      { name: "encumbrance", label: "Encumbrance Certificate" },
      { name: "landRecords", label: "Land Records" },
      { name: "buildingApproval", label: "Building Approval" },
    ],
  },
};
