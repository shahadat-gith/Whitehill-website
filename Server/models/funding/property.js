import mongoose from "mongoose";
import Funding from "./base.js";
import fileSchema from "./file.schema.js";

const { Schema } = mongoose;

const PropertyFunding = Funding.discriminator("property", new Schema({

  property: {
    type: {
      type: String,
      enum: ["residential", "commercial", "land"],
      required: true
    },

    subType: {
      type: String,
      enum: [
        // Residential
        "apartment",
        "independent_house",
        "villa",

        // Land
        "plot",
        "agricultural_land",

        // Commercial
        "office",
        "shop",
        "warehouse"
      ],
      required: true
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

    documents: {
      saleDeed: fileSchema,
      titleDeed: fileSchema,
      taxReceipt: fileSchema,
      encumbrance: fileSchema,
      landRecords: fileSchema,
      buildingApproval: fileSchema,
    }
  }

}));


PropertyFunding.schema.pre("validate", function (next) {
  const { type, subType } = this.property || {};

  if (!type || !subType) return next();

  const map = {
    residential: ["apartment", "independent_house", "villa"],
    commercial: ["office", "shop", "warehouse"],
    land: ["plot", "agricultural_land"]
  };

  const validSubTypes = map[type];
  if (!validSubTypes || !validSubTypes.includes(subType)) {
    return next(new Error("Invalid subType for selected property type"));
  }

  next();
});

export default PropertyFunding;