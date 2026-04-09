import mongoose from "mongoose";
import Funding from "./funding.js";

const { Schema } = mongoose;

const PropertyFunding = Funding.discriminator("property",new Schema({
    property: {
      type: {
        type: String,
        enum: ["residential", "commercial", "land"],
        required: true,
      },

      subType: {
        type: String,
        enum: [
          "apartment",
          "independent_house",
          "villa",
          "plot",
          "agricultural_land",
          "office",
          "shop",
          "warehouse",
        ],
        required: true,
      },

      value: Number,

      location: {
        address: String,
        city: String,
        state: String,
        pincode: String,
      },

      builtUpArea: Number,
      carpetArea: Number,
      propertyAge: Number,
      builder: String,

      landArea: Number,
      landType: String,

      ownershipType: String,

      legal: {
        isDisputed: Boolean,
        titleClear: Boolean,
        approvals: [String],
      },
    },
  })
);


export default PropertyFunding;