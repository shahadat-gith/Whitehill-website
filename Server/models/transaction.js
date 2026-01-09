import mongoose from 'mongoose';


const transactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    razorpay_payment_id: { type: String, unique: true, required: true },
    razorpay_order_id: { type: String, unique: true, required: true },
    razorpay_signature: { type: String, unique: true, required: true },  
})


const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
export default Transaction;