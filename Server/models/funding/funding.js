import mongoose from "mongoose";
import { documentsSchema } from "./documents.js";
import { disclosuresSchema } from "./disclosures.js";

const { Schema } = mongoose;

const fundingSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["startup", "business", "property"],
      required: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["under_review", "approved", "rejected"],
      default: "under_review",
    },

    fundDetails: {
      amount: { type: Number, required: true },
      tenureMonths: { type: Number },
      purpose: { type: String, trim: true },
    },

    disclosures: {
      type: disclosuresSchema,
      default: {},
    },

    riskFactors: {
      type: [String],
      default: [],
    },

    documents: {
      type: documentsSchema,
      default: {},
    },

    consent: {
      agreedToTerms: { type: Boolean, required: true },
      agreedToPrivacyPolicy: { type: Boolean, required: true },
      agreedToCreditCheck: { type: Boolean, required: true },
      consentedAt: {
        type: Date,
        default: Date.now,
      },
    },

    // ✅ Reference to separate Verification model
    verification: {
      type: Schema.Types.ObjectId,
      ref: "Verification",
    },
  },
  {
    timestamps: true,
    discriminatorKey: "type",
  }
);

// ✅ INDEXES (optimized for real-world queries)
fundingSchema.index({ createdAt: -1 });
fundingSchema.index({ user: 1, createdAt: -1 });
fundingSchema.index({ status: 1, createdAt: -1 });

// ✅ Prevent empty objects from being saved
fundingSchema.set("minimize", true);

const Funding = mongoose.models.Funding || mongoose.model("Funding", fundingSchema);

export default Funding;