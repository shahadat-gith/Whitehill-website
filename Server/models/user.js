import mongoose from "mongoose";

const kycSchema = new mongoose.Schema({
  aadhar: {
    aadharNumber: { type: String },
    frontImageUrl: { 
      url: { type: String},
      public_id: { type: String }
    },
    backImageUrl: { 
      url: { type: String},
      public_id: { type: String }
     },
  },
  
  pan: {
    panNumber: { type: String },
    frontImageUrl: { 
      url: { type: String},
      public_id: { type: String }
    },
  },

  status: {
    type: String,
    enum: ["Pending", "Verified", "Rejected"],
    default: "Pending"
  },
  verifiedAt: { type: Date },
}, {_id: false});

const bankDetailsSchema = new mongoose.Schema({
  accountHolderName: { type: String },
  accountNumber: { type: String },
  ifsc: { type: String },
  bankName: { type: String },
  branch: { type: String },
}, {_id: false});


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

    // KYC & Compliance
    kyc: kycSchema,
    // Bank Details
    bankDetails: bankDetailsSchema,

    // Financial Metrics
    totalInvested: { type: Number, default: 0 },
    portfolioValue: { type: Number, default: 0 },
    totalDistributions: { type: Number, default: 0 },
    nextPayoutDate: { type: Date },

    // Account Management
    accountStatus: {
      type: String,
      enum: ["Active", "Suspended", "Deleted"],
      default: "Active"
    },
    deletionRequested: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
