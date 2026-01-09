import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            required: true,
        },
        public_id: {
            type: String,
            required: true,
        },
    },
    { _id: false }
);

// Highlights Schema
const highlightSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
        },
    },
    { _id: false }
);


/* ================= MAIN SCHEMA ================= */

const projectSchema = new mongoose.Schema(
    {
        category: {
            type: String,
            enum: ["real_estate", "startup"],
            required: true,
            index: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        type: {
            type: String,
            required: true,
        },

        city: {
            type: String,
            required: true,
            index: true,
        },

        state: {
            type: String,
            required: true,
            index: true,
        },

        rera: {
            type: String,
            default: null, // only for real estate
        },

        stage: {
            type: String,
            required: true,
            index: true,
        },

        targetHold: {
            type: String,
            required: true,
        },

        minCommitment: {
            type: Number,
            required: true,
            min: 0,
        },

        targetReturn: {
            type: String, // "14-16%", "25-30%"
            required: true,
        },

        risk: {
            type: String,
            enum: ["low", "medium", "high"],
            required: true,
        },

        description: {
            type: String,
            required: true,
        },

        images: {
            type: [imageSchema],
            default: [],
        },

        highlights: {
            type: [highlightSchema],
            default: [],
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    });


const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);

export default Project;
