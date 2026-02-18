import mongoose from "mongoose";
import locationSchema from "./location.js";


const propertySellingSchema = new mongoose.Schema(
    {
        seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        location: locationSchema,
        priceAsked: { type: Number, required: true },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        soldPrice: { type: Number, default: null },
        documents: {
            landOwnershipProof: { url: String, public_id: String },
            reraCertificate: { url: String, public_id: String }
        },
        media: {
            images: [{ url: String, public_id: String }],
            video: {
                outsideView: { url: String, public_id: String },
                insideView: { url: String, public_id: String },
            },
        },
        cost: {
            totalProjectCost: Number,
            landCost: Number,
        },
    },
    { timestamps: true }
);

export default mongoose.models.PropertySelling || mongoose.model("PropertySelling", propertySellingSchema);