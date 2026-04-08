import mongoose from "mongoose";
import Funding from "./base.js";
import fileSchema from "./file.schema.js";

const { Schema } = mongoose;

const StartupFunding = Funding.discriminator("startup", new Schema({

  startup: {
    name: String,
    sector: String,
    description: String,

    stage: String,
    foundationYear: Number,
    teamSize: Number,

    founders: [
      {
        name: String,
        role: String,
        experience: String,
        linkedin: String,
      }
    ],

    businessModel: String,

    traction: {
      users: Number,
      revenue: Number,
      growthRate: Number,
    },

    previousFunding: [
      {
        investor: String,
        amount: Number,
        year: Number,
      }
    ],

    fundUsage: {
      product: Number,
      marketing: Number,
      hiring: Number,
      operations: Number,
    },

    competitors: [String],
    risks: [String],

    website: String,
    pitchDeck: fileSchema,
  }

}));

export default StartupFunding;