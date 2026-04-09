import mongoose from "mongoose";
import Funding from "./funding.js";

const { Schema } = mongoose;

const StartupFunding = Funding.discriminator("startup",new Schema({
    startup: {
      name: { type: String, required: true },
      sector: String,
      description: String,

      stage: {
        type: String,
        enum: ["idea", "mvp", "growth", "scaling"],
      },

      foundationYear: Number,
      teamSize: Number,

      founders: [
        {
          name: String,
          role: String,
          experience: String,
          linkedin: String,
        },
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
        },
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
    },
  })
);

export default StartupFunding;