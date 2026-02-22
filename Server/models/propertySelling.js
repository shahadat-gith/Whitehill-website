import mongoose from "mongoose";



const locationSchema = new mongoose.Schema(
  {
    village: { type: String, trim: true, required: true },
    po: { type: String, trim: true,required: true },
    ps: { type: String, trim: true,required: true },
    mouza: { type: String, trim: true, required: true },
    district: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
  },
  { _id: false }
);


/* ================= LAND DETAILS ================= */

const landDetailsSchema = new mongoose.Schema(
  {
    area: {
      bigha: { type: Number, min: 0, required: true },
      kattha: { type: Number, min: 0, required: true },
      lessa: { type: Number, min: 0, required: true },
     },
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
    bedrooms: { type: Number, min: 0, required: true },
    bathrooms: { type: Number, min: 0, required: true },
    parkingSpaces: { type: Number, min: 0, required: true },

    images: [
      {
        url: String,
        public_id: String,
      },
    ],

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

    description: {
      type: String,
      trim: true,
      required: true,
      maxlength: 1000,
    },

    type: {
      type: String,
      enum: ["land", "property"],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    isCompleted: {
      type: Boolean,
      default: false,
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
