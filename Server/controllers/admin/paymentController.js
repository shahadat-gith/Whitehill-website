import { instance } from "../../configs/razorpay.js";

export const getPaymentHistory = async (req, res) => {
  try {

    const { count = 20, skip = 0 } = req.query;
    const payments = await instance.payments.all({ count, skip });

    return res.status(200).json({
      success: true,
      payments: payments.items,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving payment history",
      error: error.message,
    });
  }
};

export const getPaymentDetails = async (req, res) => {
  try {
    const { paymentId } = req.query;

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: "paymentId query parameter is required",
      });
    }
    const payment = await instance.payments.fetch(paymentId);
    return res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving payment details",
      error: error.message,
    });
  }
};
