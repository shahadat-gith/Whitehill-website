import Investment from "../../models/investment.js";
import { sendEmail } from "../../configs/nodemailer.js";

export const updateInvestmentStatus = async (req, res) => {
  try {
    const { investmentId, status, cancelReason = "" } = req.body;

    if (!investmentId || !status) {
      return res.status(400).json({
        success: false,
        message: "investmentId and status are required",
      });
    }

    if (status === "cancelled" && !cancelReason?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Cancel reason is required when cancelling an investment",
      });
    }

    const investment = await Investment.findById(investmentId)
      .populate({ path: "user", select: "fullName email" })
      .populate({ path: "project", select: "name" });

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: "Investment not found",
      });
    }

    investment.status = status;
    investment.cancelReason = status === "cancelled" ? cancelReason.trim() : null;

    await investment.save();

    const recipientEmail = investment?.user?.email;

    let emailSent = false;
    let emailError = null;

    if (recipientEmail) {
      try {
        const userName = investment?.user?.fullName || "Investor";
        const projectName = investment?.project?.name || "your project";
        const statusLabel = String(status).toUpperCase();

        const subject =
          status === "cancelled"
            ? `Investment Cancelled: ${projectName}`
            : `Investment Status Updated: ${statusLabel}`;

        const bodyHtml =
          status === "cancelled"
            ? `
              <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                <h2 style="margin:0 0 10px; color:#991b1b;">Investment Cancelled</h2>
                <p>Hello ${userName},</p>
                <p>Your investment has been <b>cancelled</b>.</p>

                <div style="margin:14px 0; padding:12px; border:1px solid #e5e7eb; border-radius:10px;">
                  <p style="margin:0;"><b>Project:</b> ${projectName}</p>
                  <p style="margin:6px 0 0;"><b>Status:</b> CANCELLED</p>
                  <p style="margin:6px 0 0;"><b>Investment ID:</b> ${investment._id}</p>
                  <p style="margin:10px 0 0;"><b>Reason:</b> ${cancelReason.trim()}</p>
                </div>

                <p style="color:#6b7280; font-size: 13px;">
                  If you believe this is a mistake, please contact support.
                </p>
              </div>
            `
            : `
              <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                <h2 style="margin:0 0 10px;">Investment Status Updated</h2>
                <p>Hello ${userName},</p>
                <p>Your investment status has been updated.</p>

                <div style="margin:14px 0; padding:12px; border:1px solid #e5e7eb; border-radius:10px;">
                  <p style="margin:0;"><b>Project:</b> ${projectName}</p>
                  <p style="margin:6px 0 0;"><b>Status:</b> ${statusLabel}</p>
                  <p style="margin:6px 0 0;"><b>Investment ID:</b> ${investment._id}</p>
                </div>

                <p style="color:#6b7280; font-size: 13px;">
                  If you did not request this update, please contact support.
                </p>
              </div>
            `;

        await sendEmail({
          to: recipientEmail,
          subject,
          html: bodyHtml,
        });

        emailSent = true;
      } catch (err) {
        emailSent = false;
        emailError = err?.message || "Failed to send email";
      }
    }

    return res.status(200).json({
      success: true,
      message: "Investment status updated successfully",
      investment,
      emailSent,
      emailError,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating investment status",
      error: error.message,
    });
  }
};


export const getInvestments = async (req, res) => {
  try {
    const investments = await Investment.find()
      .populate({
        path: "project",
        select: "name targetReturn images",
      })
      .populate({
        path: "transaction",
        select: "amount date razorpay_payment_id",
      })
      .populate({
        path: "user",
        select: "fullName email image",
      })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      investments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving investments",
      error: error.message,
    });
  }
};


export const getInvestmentById = async (req, res) => {
  try {
    const { investmentId } = req.body;

    // Fetch investment with related data
    const investment = await Investment.findById(investmentId)
      .populate({
        path: "project",
        select: "name category city state risk targetReturn",
      })
      .populate({
        path: "transaction",
        select: "amount date razorpay_payment_id razorpay_order_id razorpay_signature",
      })
      .populate({
        path: "user",
        select: "fullName email phone image",
      })
      .lean();

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: "Investment not found",
      });
    }

    // Decrypt user phone number
    if (investment?.user?.phone) {
      try {
        const { decrypt } = await import("../../utils/crypto.js");
        investment.user.phone = decrypt(investment.user.phone);
      } catch (e) {
        investment.user.phone = null;
      }
    }

    // Prepare base response
    const response = {
      success: true,
      investment,
    };

    // Fetch and attach Razorpay payment details if available
    const paymentId = investment?.transaction?.razorpay_payment_id;

    if (paymentId) {
      try {
        const { instance } = await import("../../configs/razorpay.js");
        const razorpayPayment = await instance.payments.fetch(paymentId);
        response.razorpayPayment = razorpayPayment;
      } catch (rzpErr) {
        response.razorpayPayment = null;
        response.razorpayError = {
          message: rzpErr?.error?.description || rzpErr.message || "Failed to fetch Razorpay payment",
          statusCode: rzpErr?.statusCode,
        };
      }
    } else {
      response.razorpayPayment = null;
      response.message = "No razorpay_payment_id found for this investment";
    }

    return res.status(200).json(response);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving investment by ID",
      error: error.message,
    });
  }
};
