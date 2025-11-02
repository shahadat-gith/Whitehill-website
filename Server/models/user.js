import mongoose from "mongoose";

const consentLogSchema = new mongoose.Schema({
  consentText: { type: String },
  ipAddress: { type: String },
  timestamp: { type: Date, default: Date.now },
});

const kycSchema = new mongoose.Schema({
  panNumber: { type: String, uppercase: true, trim: true },
  panDocumentUrl: { type: String },
  addressProofType: { 
    type: String, 
    enum: ["Aadhaar", "Passport", "Utility Bill"], 
    default: "Aadhaar" 
  },
  addressProofUrl: { type: String },
  aadhaarVerified: { type: Boolean, default: false },
  status: { 
    type: String, 
    enum: ["Pending", "Under Review", "Verified", "Rejected"], 
    default: "Pending" 
  },
  verifiedAt: { type: Date },
});

const bankDetailsSchema = new mongoose.Schema({
  accountHolderName: { type: String },
  accountNumber: { type: String },
  ifsc: { type: String },
  bankName: { type: String },
  branch: { type: String },
});

const notificationPrefsSchema = new mongoose.Schema({
  email: { type: Boolean, default: true },
  sms: { type: Boolean, default: false },
  whatsapp: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
  {
    // Basic Info
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String },

    // Authentication
    otp: { type: String },
    otpExpiry: { type: Date },
    isVerified: { type: Boolean, default: false },
    mfaEnabled: { type: Boolean, default: false },

    // Role (optional but useful for Admin CMS)
    role: { 
      type: String, 
      enum: ["Investor", "Admin", "Compliance", "Finance", "Support"], 
      default: "Investor" 
    },

    // KYC & Compliance
    kyc: kycSchema,
    consentLogs: [consentLogSchema],

    // Bank Details
    bankDetails: bankDetailsSchema,

    // Financial Metrics
    totalInvested: { type: Number, default: 0 },
    portfolioValue: { type: Number, default: 0 },
    totalDistributions: { type: Number, default: 0 },
    nextPayoutDate: { type: Date },

    // Preferences
    notificationPrefs: notificationPrefsSchema,

    // Account Management
    accountStatus: { 
      type: String, 
      enum: ["Active", "Suspended", "Deleted"], 
      default: "Active" 
    },
    deletionRequested: { type: Boolean, default: false },

    // Audit
    lastLogin: { type: Date },
  },
  { timestamps: true } 
);

const User = mongoose.model("User", userSchema);

export default User;
