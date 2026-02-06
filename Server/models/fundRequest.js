import mongoose from "mongoose";

/* ===================== COMMON FILE SCHEMA ===================== */

const fileSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
  },
  { _id: false }
);

/* ===================== LOCATION SCHEMA ===================== */

const locationSchema = new mongoose.Schema(
  {
    village: { type: String, default: null },
    block: { type: String, default: null },
    town: { type: String, default: null },
    city: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    po: { type: String, default: null }, // Post Office
    ps: { type: String, default: null }, // Police Station
    pincode: { type: String, required: true },
    googleMapLocation: { type: String, default: null },
  },
  { _id: false }
);

/* ===================== STARTUP SCHEMA ===================== */

const startupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sector: { type: String, required: true },
    description: { type: String, required: true },

    stage: {
      type: String,
      enum: ["idea", "mvp", "growth", "scale"],
      required: true,
    },

    teamSize: { type: Number, required: true },
    foundationYear: { type: Number, required: true },
    currentRevenue: { type: Number, default: 0 },
    website: { type: String, default: null },

    foundingTeam: [
      {
        name: { type: String, required: true },
        role: { type: String, required: true },
        equityStake: { type: Number, required: true },
        linkedinProfile: { type: String, default: null },
      },
    ],

    businessModel: {
      problemDescription: { type: String, required: true },
      solutionDescription: { type: String, required: true },
      productDescription: { type: String, required: true },
      targetCustomer: { type: String, required: true },
      revenueModel: { type: String, required: true },
      currentTraction: {
        type: String,
        enum: [
          "revenue",
          "user_growth",
          "engagement_and_return",
          "strategic_partnerships",
        ],
        required: true,
      },
    },

    fundingType: {
      type: String,
      enum: ["equity", "profitSharing", "revenueSharing"],
      required: true,
    },

    fundUsageBreakdown: { type: String, required: true },
    keyRisks: { type: String, required: true },

    documents: {
      projectionStatements: { type: fileSchema, required: true },
      legalDocuments: { type: fileSchema, required: true },
      pitchDeck: { type: fileSchema, required: true },
      shareHoldingPattern: { type: fileSchema, required: true },
    },
  },
  { _id: false }
);

/* ===================== BUSINESS VENTURE SCHEMA ===================== */

const businessVentureSchema = new mongoose.Schema(
  {
    stage: {
      type: String,
      enum: ["idea", "mvp", "growth", "scale"],
      required: true,
    },

    name: { type: String, required: true },
    industry: { type: String, required: true },
    businessModel: { type: String, required: true },
    description: { type: String, required: true },
    teamSize: { type: Number, required: true },
    website: { type: String, default: null },
    turnOver: { type: Number, default: 0 },
    profitMargin: { type: String, required: true },
    outStandingLoan: { type: Number, default: 0 },
    purpose: {
      workingCapital: { type: String, default: false },
      expansion: { type: String, default: false },
      assetPurchase: { type: String, default: false },
      other: { type: String, default: null },
    },

    fundingType: {
      type: String,
      enum: ["equity", "profitSharing", "revenueSharing"],
      required: true,
    },

    riskDisclosure: {
      regulatoryRisks: { type: String, required: true },
      marketRisks: { type: String, required: true },
      seasonalityRisks: { type: String, required: true },
      operationalRisks: { type: String, required: true },
      dependencyRisks: { type: String, required: true },
    },

    businessPartners: [
      {
        name: { type: String, required: true },
        role: { type: String, required: true },
        share: { type: Number, required: true },
      },
    ],

    documents: {
      businessPlan: { type: fileSchema, required: true },
      bankStatements: { type: fileSchema, required: true },
      financialStatements: { type: fileSchema, required: true },
      gstReturns: { type: fileSchema, required: true },
      legalDocuments: { type: fileSchema, required: true },
      cashFlowStatement: { type: fileSchema, required: true },
    },
  },
  { _id: false }
);

/* ===================== INDIVIDUAL FUND REQUEST SCHEMA ===================== */

const individualFundRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    category: {
      type: String,
      enum: ["project_devlopment", "land_purchase", "land_selling"],
      required: true,
    },

    individualType: {
      type: String,
      enum: ["agent", "buyer", "seller"],
    },

    projectType: {
      type: String,
      enum: ["residential", "commercial", "agricultural", "mixed"],
    },

    documents: {
      landOwnershipProof: { type: fileSchema, required: true },
      rera: { type: String, required: true },
      layout: { type: fileSchema, required: true },
      reraCertificate: { type: fileSchema, required: true },
      financialModel: { type: fileSchema, required: true },
    },

    cost: {
      totalProjectCost: {type: Number, required: true },
      landCost: { type: Number, required: true },
      construCtionCost: { type: Number, required: true },
      fundingAlreadyDeployed: { type: Number, required: true },
    },

    riskDisclosure: {
      executionRisks: { type: String, required: true },
      marketRisks: { type: String, required: true },
    },
  },
  { _id: false }
);

/* ===================== MAIN FUND REQUEST SCHEMA ===================== */

const fundRequestSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["startup", "business_venture", "individual"],
      required: true,
    },

    startupDetails: {
      type: startupSchema,
      required: function () {
        return this.type === "startup";
      },
      default: null,
    },

    businessVentureDetails: {
      type: businessVentureSchema,
      required: function () {
        return this.type === "business_venture";
      },
      default: null,
    },

    individualDetails: {
      type: individualFundRequestSchema,
      required: function () {
        return this.type === "individual";
      },
      default: null,
    },

    location: {
      type: locationSchema,
      required: true,
    },

    amountShouted: {
      type: Number,
      required: true,
      min: 1,
    },

    amountAlloted: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    processedAt: {
      type: Date,
      default: null,
    },

    rejectionReason: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

/* ===================== MODEL EXPORT ===================== */

const FundRequest = mongoose.models.FundRequest || mongoose.model("FundRequest", fundRequestSchema);
export default FundRequest;
