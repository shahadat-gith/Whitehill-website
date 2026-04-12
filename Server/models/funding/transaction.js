import mongoose from "mongoose";


const fundingTransactionSchema = new mongoose.Schema({
    funding: { type: mongoose.Schema.Types.ObjectId, ref: 'Funding', required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    invoiceId: { type: String, default: null },
    transactionId: { type: String, default: null },
    method: { type: String, default: null },
    razorpay_payment_id: { type: String, unique: true, default: null },
    razorpay_order_id: { type: String, unique: true, default: null },
    razorpay_signature: { type: String, unique: true, default: null },
    status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending"
    },
    paidAt: { type: Date, default: null },
})

const FundingTransaction = mongoose.models.FundingTransaction || mongoose.model('FundingTransaction', fundingTransactionSchema);

export default FundingTransaction;