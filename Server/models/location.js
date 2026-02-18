import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
    {
        village: { type: String, default: null },
        block: { type: String, default: null },
        town: { type: String, default: null },
        city: { type: String, required: true },
        district: { type: String, required: true },
        state: { type: String, required: true },
        po: { type: String, default: null },
        ps: { type: String, default: null },
        pincode: { type: String, required: true },
        googleMapLocation: { type: String, default: null },
    },
    { _id: false }
);

export default locationSchema;