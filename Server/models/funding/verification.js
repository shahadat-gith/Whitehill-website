import mongoose from "mongoose";

const { Schema } = mongoose;

const verificationSchema = new Schema(
    {
        funding: {
            type: Schema.Types.ObjectId,
            ref: "Funding",
            required: true,
            unique: true,
        },

        extraRequests: [
            {
                message: { type: String, required: true },
                requestedAt: {
                    type: Date,
                    default: Date.now,
                },
                files: [
                    {
                        url: String,
                        public_id: String,
                        resource_type: String,
                        originalName: String,
                    },
                ],
                status: {
                    type: String,
                    enum: ["pending", "submitted"],
                    default: "pending"
                },
                submittedAt: Date,
            },
        ],

        approvedAmount: {
            type: Number,
            min: 0,
        },

        interestRate: {
            type: Number,
            min: 0,
        },

        notes: {
            type: String,
            trim: true,
        },

        rejectionReason: {
            type: String,
            trim: true,
        },

        reviewedAt: Date,
    },
    {
        timestamps: true,
    }
);

// ✅ INDEXES
verificationSchema.index({ createdAt: -1 });

const Verification = mongoose.models.Verification || mongoose.model("Verification", verificationSchema);

export default Verification;