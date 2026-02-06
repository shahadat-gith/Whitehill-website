import mongoose from "mongoose";


const fileSchema = new mongoose.Schema({
  url: { type: String },
  public_id: { type: String }
}, { _id: false });

const kycSchema = new mongoose.Schema({
  aadhar: {
    aadharNumber: { type: String },
    frontImageUrl: fileSchema,
    backImageUrl: fileSchema,
  },

  pan: {
    panNumber: { type: String },
    frontImageUrl: fileSchema,
    backImageUrl: fileSchema,
  },

  adress:{
    village: { type: String },
    town: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    country: { type: String },
  },

  status: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending"
  },
  rejectionReason: { type: String, default: null },
  verifiedAt: { type: Date, default: null },
  rejectedAt: { type: Date, default: null },
}, { _id: false });

const bankDetailsSchema = new mongoose.Schema({
  accountHolderName: { type: String },
  accountNumber: { type: String },
  ifsc: { type: String },
  bankName: { type: String },
  branch: { type: String },
}, { _id: false });


const userSchema = new mongoose.Schema(
  {
    // Basic Info
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: fileSchema,
    // Authentication
    otp: { type: String },
    otpExpiry: { type: Date },

    // KYC & Compliance
    kyc: kycSchema,
    // Bank Details
    bankDetails: bankDetailsSchema,

    totalInvested: { type: Number, default: 0 },
    portfolioValue: { type: Number, default: 0 },
    totalDistributions: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
