import dotenv from "dotenv";
dotenv.config();
import Transaction from "../models/transactions.js";
import User from "../models/user.js";
import crypto from "crypto";
import Razorpay from 'razorpay';

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100, 
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const key = instance.key_id;
    const order = await instance.orders.create(options);
    res.status(201).json({ success: true, order, key });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, err: error });
  }
};


export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = req.body;
    const userId =  req.userId;

    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');
    if (generated_signature === razorpay_signature) {
      const transaction = new Transaction({
        user: userId,
        amount,
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
      });
      await transaction.save();

      const user = await User.findById(userId);
      user.totalInvested += amount;
      await user.save();

      res.status(200).json({ success: true, message: "Payment Successful." });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature. Payment verification failed." });
    }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


export const getTransactions = async (req, res) => {
  try {
    const userId = req.userId;
    const transactions = await Transaction.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};