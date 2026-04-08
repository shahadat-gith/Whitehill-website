import mongoose from "mongoose";
import fileSchema from "./file.schema.js";

const { Schema } = mongoose;

const baseOptions = {
  timestamps: true,
  discriminatorKey: "type"
};

const baseFundingSchema = new Schema({

  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  fundingRequest: {
    amount: { type: Number, required: true },
    tenureMonths: Number,
    purpose: String,
  },

  disclosures: {
    hasExistingLoans: Boolean,
    hasDefaultedBefore: Boolean,
    hasLegalCases: Boolean,
    hasCriminalRecord: Boolean,
    politicallyExposed: Boolean,
    details: String,
  },

  riskFactors: [String],

  documents: {
    incomeProof: fileSchema,
    bankStatement: fileSchema,
    additionalDocs: [fileSchema],
  },

  consent: {
    agreedToTerms: { type: Boolean, required: true },
    agreedToPrivacyPolicy: { type: Boolean, required: true },
    agreedToCreditCheck: { type: Boolean, required: true },
    consentedAt: Date,
  },

  adminReview: {
    reviewedBy: {
      name: String,
      role: String,
      email: String,
    },

    decision: {
      type: String,
      enum: ["approved", "rejected", "needs_more_info"],
    },

    approvedAmount: Number,
    interestRate: Number,
    notes: String,
    rejectionReason: String,
    reviewedAt: Date,
  }

}, baseOptions);

const Funding = mongoose.models.Funding || mongoose.model("Funding", baseFundingSchema);

export default Funding;