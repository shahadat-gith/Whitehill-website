import mongoose from "mongoose";
import locationSchema from "./location.js";

/* ================= LAND DETAILS ================= */

const landDetailsSchema = new mongoose.Schema(
  {
    area: { type: Number, required: true, min: 1 },
    dagNumber: { type: String, required: true, trim: true },
    pattaNumber: { type: String, required: true, trim: true },

    documents: {
      ownershipProof: {
        url: String,
        public_id: String,
      },
      khajnaReceipt: {
        url: String,
        public_id: String,
      },
    },

    landType: {
      type: String,
      enum: ["residential", "commercial", "agricultural"],
      required: true,
    },

    images: [
      {
        url: String,
        public_id: String,
      },
    ],
  },
  { _id: false }
);

/* ================= PROPERTY DETAILS ================= */

const propertyDetailsSchema = new mongoose.Schema(
  {
    bedrooms: { type: Number, min: 0 },
    bathrooms: { type: Number, min: 0 },
    parkingSpaces: { type: Number, min: 0 },

    images: [
      {
        url: String,
        public_id: String,
      },
    ],

    video: {
      outsideView: { url: String, public_id: String },
      insideView: { url: String, public_id: String },
    },

    documents: {
      ownershipProof: { url: String, public_id: String },
      buildingPlan: { url: String, public_id: String },
    },
  },
  { _id: false }
);

/* ================= MAIN SCHEMA ================= */

const propertySellingSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    priceAsked: {
      type: Number,
      required: true,
      min: 1,
    },

    type: {
      type: String,
      enum: ["land", "property"],
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    landDetails: landDetailsSchema,
    propertyDetails: propertyDetailsSchema,

    location: {
      type: locationSchema,
      required: true,
    },

    costPrice: { type: Number, default: 0 },
    sellingPrice: { type: Number, default: 0 },
  },
  { timestamps: true }
);

/* ================= CONDITIONAL VALIDATION ================= */

propertySellingSchema.pre("validate", function (next) {
  if (this.type === "land" && !this.landDetails) {
    return next(new Error("Land Details required for land type"));
  }

  if (this.type === "property" && !this.propertyDetails) {
    return next(new Error("Property Details required for property type"));
  }

  next();
});



export default mongoose.models.PropertySelling || mongoose.model("PropertySelling", propertySellingSchema);
