import mongoose from "mongoose";
import locationSchema from "../location.js";

const individualSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    location: locationSchema,
    amountRequested: { type: Number, required: true },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    category: {
      type: String,
      enum: ["project_devlopment", "land_purchase", "land_selling"],
      required: true,
    },

    individualType: {
      type: String,
      enum: ["agent", "buyer", "seller"],
      required: true,
    },

    projectType: {
      type: String,
      enum: ["residential", "commercial", "agricultural", "mixed"],
    },

    documents: {
      landOwnershipProof: { url: String, public_id: String },
      rera: { type: String, required: true },
      layout: { url: String, public_id: String },
      reraCertificate: { url: String, public_id: String },
      financialModel: { url: String, public_id: String },
    },

    cost: {
      totalProjectCost: Number,
      landCost: Number,
      constructionCost: Number,
      fundingAlreadyDeployed: Number,
    },

    riskDisclosure: {
      executionRisks: String,
      marketRisks: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Individual || mongoose.model("Individual", individualSchema);