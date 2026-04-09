import mongoose from "mongoose";
import Funding from "./funding.js";

const { Schema } = mongoose;

const BusinessFunding = Funding.discriminator("business",new Schema({
    business: {
      name: { type: String, required: true },
      type: String,
      industry: String,

      yearsInOperation: Number,

      registrationNumber: String,
      gstNumber: String,

      monthlyRevenue: Number,
      monthlyProfit: Number,

      employees: Number,

      assets: [{ name: String, value: Number }],
      liabilities: [{ type: String, amount: Number }],
      businessPlan: String,
      businessModel: String,
      marketAnalysis: String,
      competitiveLandscape: String,
      growthStrategy: String,
    },
  })
);

export default BusinessFunding;