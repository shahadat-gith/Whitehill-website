import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  url: String,
  public_id: String
}, { _id: false });

export default fileSchema;