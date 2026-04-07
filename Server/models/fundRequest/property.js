import mongoose from "mongoose";


const locationSchema = new mongoose.Schema(
    {
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
    { _id: false }
);

const propertySchema = new mongoose.Schema(
    {
        requester: {
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
            enum: ["agent", "individual"],
            required: true,
        },

        projectType: {
            type: String,
            enum: ["residential", "commercial", "agricultural", "mixed"],
            required: true,
        },

        rera: { type: String, default: null },

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

        cost: {
            totalProjectCost: { type: Number, default: 0 },
            landCost: { type: Number, default: 0 },
            constructionCost: { type: Number, default: 0 },
            fundingAlreadyDeployed: { type: Number, default: 0 },
        },

        riskDisclosure: {
            executionRisks: { type: String, required: true },
            marketRisks: { type: String, required: true },
        },

        documents: {
            landOwnershipProof: { url: String, public_id: String },
            layout: { url: String, public_id: String },
            reraCertificate: { url: String, public_id: String },
            financialModel: { url: String, public_id: String },
        },
    },
    { timestamps: true }
);

export default mongoose.models.Property || mongoose.model("Property", propertySchema);