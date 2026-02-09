import mongoose from "mongoose";

const StartupFundRequestSchema = new mongoose.Schema(
  {
    /* ===== COMMON FIELDS ===== */
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    location: {
      village: { type: String, default: null },
      block: { type: String, default: null },
      town: { type: String, default: null },
      city: { type: String, required: true },
      district: { type: String, required: true },
      state: { type: String, required: true },
      po: { type: String, default: null },
      ps: { type: String, default: null },
      pincode: { type: String, required: true },
      googleMapLocation: { type: String, default: null },
    },

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

export default mongoose.models.StartupFundRequest ||
  mongoose.model("StartupFundRequest", StartupFundRequestSchema);
