import mongoose from "mongoose";

const BusinessVentureFundRequestSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    location: {
      village: String,
      block: String,
      town: String,
      city: { type: String, required: true },
      district: { type: String, required: true },
      state: { type: String, required: true },
      po: String,
      ps: String,
      pincode: { type: String, required: true },
      googleMapLocation: String,
    },

    amountRequested: { type: Number, required: true },
    amountAlloted: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },


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
      workingCapital: { type: Boolean, default: false },
      expansion: { type: Boolean, default: false },
      assetPurchase: { type: Boolean, default: false },
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
        name: String,
        role: String,
        share: Number,
      },
    ],

    documents: {
      businessPlan: { url: String, public_id: String },
      bankStatements: { url: String, public_id: String },
      financialStatements: { url: String, public_id: String },
      gstReturns: { url: String, public_id: String },
      legalDocuments: { url: String, public_id: String },
      cashFlowStatement: { url: String, public_id: String },
    },
  },
  { timestamps: true }
);

export default mongoose.models.BusinessVentureFundRequest ||
  mongoose.model(
    "BusinessVentureFundRequest",
    BusinessVentureFundRequestSchema
  );
