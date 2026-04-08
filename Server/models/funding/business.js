import mongoose from "mongoose";
import Funding from "./base.js";
import fileSchema from "./file.schema.js";

const { Schema } = mongoose;

const BusinessFunding = Funding.discriminator("business", new Schema({

  business: {
    name: String,
    type: String,
    industry: String,

    yearsInOperation: Number,

    registrationNumber: String,
    gstNumber: String,

    monthlyRevenue: Number,
    monthlyProfit: Number,

    employees: Number,

    assets: [
      { name: String, value: Number }
    ],

    liabilities: [
      { type: String, amount: Number }
    ],

    purposeOfLoan: String,

    financialDocs: {
      cashFlow: fileSchema,
      balanceSheet: fileSchema,
      profitLoss: fileSchema,
    }
  }

}));

export default BusinessFunding;