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
      tenureMonths: Number,
      purpose: String,
    },

    disclosures: disclosuresSchema,

    riskFactors: [String],

    documents: documentsSchema,

    consent: {
      agreedToTerms: { type: Boolean, required: true },
      agreedToPrivacyPolicy: { type: Boolean, required: true },
      agreedToCreditCheck: { type: Boolean, required: true },
      consentedAt: {
        type: Date,
        default: Date.now,
      },
    },


    //for admin verification process

    verification: {
      //in case any document is missing or needs clarification, admin can request additional documents or information from the user
      extraRequests: [
        {
          message: String,
          requestedAt: {
            type: Date,
            default: Date.now,
          },

          files: [
            {
              url: String,
              public_id: String,
            }
          ]
        },
      ],

      approvedAmount: Number,
      interestRate: Number,
      notes: String,
      rejectionReason: String,
      reviewedAt: Date,
    },
  },
  {
    timestamps: true,
    discriminatorKey: "type",
  });



// ✅ INDEXES
fundingSchema.index({ createdAt: -1 });

const Funding = mongoose.models.Funding || mongoose.model("Funding", fundingSchema);

export default Funding;