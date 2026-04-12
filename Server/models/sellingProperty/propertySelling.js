import mongoose from "mongoose";


const propertySchema = new mongoose.Schema({
  // ================= BASIC INFO =================
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  description: {
    type: String,
    maxlength: 2000
  },

  propertyType: {
    type: String,
    enum: ["residential", "commercial", "land"],
    required: true
  },

  subType: {
    type: String, // e.g. apartment, villa, plot, office
  },

  // ================= LOCATION =================
  location: {
    addressLine: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
  },

  // ================= PROPERTY DETAILS =================
  details: {
    area: {
      value: Number,
      unit: {
        type: String,
        enum: ["sqft", "sqm", "acre", "bigha"]
      }
    },

    bedrooms: Number,
    bathrooms: Number,
    floors: Number,
    furnishing: {
      type: String,
      enum: ["furnished", "semi-furnished", "unfurnished"]
    },

    ageOfProperty: Number, // years
    facing: String, // east, west etc
  },

  // ================= OWNERSHIP =================
  ownership: {
    ownerName: String,
    contactNumber: String,
    email: String,

    ownershipType: {
      type: String,
      enum: ["individual", "joint", "company"]
    },

    isPrimaryOwner: Boolean,

    documents: [
      {
        type: {
          type: String,
          enum: [
            "sale_deed",
            "title_deed",
            "encumbrance_certificate",
            "tax_receipt",
            "id_proof"
          ]
        },
        url: String,
        verified: {
          type: Boolean,
          default: false
        }
      }
    ]
  },

  // ================= PRICING =================
  pricing: {
    expectedPrice: {
      type: Number,
      required: true
    },
    negotiable: {
      type: Boolean,
      default: true
    },
    governmentValue: Number,
    valuationByAdmin: Number
  },

  // ================= MEDIA =================
  media: {
    images: [
      {
        url: String,
        public_id: String, // for cloud storage reference
        caption: String,
      }
    ],
    video: {
      url: String,   //max 1 min, max 20MB
      public_id: String,
    },
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

  disclosure: {
    hasEncumbrance: Boolean,
    encumbranceDetails: String,
    hasLegalDisputes: Boolean,
    legalDisputeDetails: String,
    hasPendingDues: Boolean,
    pendingDuesDetails: String,
  },

  // ================= VERIFICATION for Admin only=================
  verification: {
    status: {
      type: String,
      enum: [
        "under_review",
        "verified",
        "rejected"
      ],
      default: "under_review"
    },

    remarks: String,
    verifiedAt: Date,
    rejectionReason: String
  },
}, { timestamps: true });


const PropertySelling = mongoose.models.PropertySelling || mongoose.model("PropertySelling", propertySchema);

export default PropertySelling;