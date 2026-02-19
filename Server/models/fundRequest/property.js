import mongoose from "mongoose";
import locationSchema from "../location.js";

const propertySchema = new mongoose.Schema(
    {
        requester: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        type: {
            type: String,
            enum: ["agent", "individual"],
            required: true,
        },

        location: locationSchema,
        amountRequested: { type: Number, required: true },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },

        rejectionReason: { type: String, default: "" },
        purpose: {
            type: String,
            enum: ["project_development", "land_purchase"],
            required: true
        },

        projectType: {
            type: String,
            enum: ["residential", "commercial", "agricultural", "mixed"],
        },

        //if type = agent reraCertificate, agentLicense , financialModel
        //if type = individual not needed any certificate

        documents: {
            reraCertificate: { url: String, public_id: String },
            agentLicense: { url: String, public_id: String },
            financialModel: { url: String, public_id: String },
        },

        riskDisclosure: {
            executionRisks: String,
            marketRisks: String,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Property || mongoose.model("Property", propertySchema);