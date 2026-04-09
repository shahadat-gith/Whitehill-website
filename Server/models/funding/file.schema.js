import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
    resource_type: { type: String, required: true },
    originalName: String,
  },
  { _id: false }
);

export default fileSchema;