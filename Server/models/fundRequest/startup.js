import mongoose from "mongoose";
import locationSchema from "../location.js";

const startupSchema = new mongoose.Schema(
  {
    /* ===== COMMON FIELDS ===== */
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    location: locationSchema,

    amountRequested: { type: Number, required: true, min: 1 },
    amountAlloted: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    processedAt: { type: Date, default: null },
    rejectionReason: { type: String, default: null },

    /* ===== STARTUP SPECIFIC ===== */
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
      projectionStatements: {
        url: String,
        public_id: String,
      },
      legalDocuments: {
        url: String,
        public_id: String,
      },
      pitchDeck: {
        url: String,
        public_id: String,
      },
      shareHoldingPattern: {
        url: String,
        public_id: String,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Startup || mongoose.model("Startup", startupSchema);
