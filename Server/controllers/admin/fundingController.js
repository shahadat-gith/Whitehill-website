import mongoose from "mongoose";
import { Funding, Verification } from "../../models/funding/index.js";
import { decrypt } from "../../utils/crypto.js";

export const verifyFunding = async (req, res) => {
  try {
    const {
      fundingId,
      status,
      approvedAmount,
      interestRate,
      notes,
      rejectionReason,
    } = req.body;

    // 🔹 Basic validation
    if (!fundingId || !status) {
      return res.status(400).json({
        success: false,
        message: "fundingId and status are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(fundingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid fundingId",
      });
    }

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be 'approved' or 'rejected'",
      });
    }

    const funding = await Funding.findById(fundingId);

    if (!funding) {
      return res.status(404).json({
        success: false,
        message: "Funding not found",
      });
    }

    // 🔹 Get or create verification record
    let verification = await Verification.findOne({ funding: fundingId });
    if (!verification) {
      verification = new Verification({ funding: fundingId });
    }

    // 🔹 Update verification
    verification.reviewedAt = new Date();

    if (status === "approved") {
      if (approvedAmount == null || interestRate == null) {
        return res.status(400).json({
          success: false,
          message: "Approved amount and interest rate are required",
        });
      }

      verification.approvedAmount = Number(approvedAmount);
      verification.interestRate = Number(interestRate);
      verification.notes = notes?.trim() || "";

      // remove rejection fields
      verification.rejectionReason = undefined;
    }

    if (status === "rejected") {
      if (!rejectionReason) {
        return res.status(400).json({
          success: false,
          message: "Rejection reason is required",
        });
      }

      verification.rejectionReason = rejectionReason.trim();
      verification.notes = notes?.trim() || "";

      // remove approval fields
      verification.approvedAmount = undefined;
      verification.interestRate = undefined;
    }

    await verification.save();

    // 🔹 Update funding status and reference
    funding.status = status;
    funding.verification = verification._id;

    await funding.save();

    return res.status(200).json({
      success: true,
      message: `Funding request ${status} successfully`,
      data: funding,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const requestAdditionalDocuments = async (req, res) => {
  try {
    const { fundingId, message } = req.body;

    // 🔹 Validation
    if (!fundingId || !message) {
      return res.status(400).json({
        success: false,
        message: "fundingId and message are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(fundingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid fundingId",
      });
    }

    const funding = await Funding.findById(fundingId);

    if (!funding) {
      return res.status(404).json({
        success: false,
        message: "Funding not found",
      });
    }

    // 🔹 Get or create verification record
    let verification = await Verification.findOne({ funding: fundingId });
    if (!verification) {
      verification = new Verification({ funding: fundingId });
    }

    // 🔹 Push request
    verification.extraRequests.push({
      message: message.trim(),
      requestedAt: new Date(),
      files: [],
    });

    await verification.save();

    // 🔹 Update funding reference if not set
    if (!funding.verification) {
      funding.verification = verification._id;
      await funding.save();
    }

    // 🔹 Optional: move status back to review
    funding.status = "under_review";
    await funding.save();

    return res.status(200).json({
      success: true,
      message: "Additional documents requested successfully",
      data: funding,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getFundingById = async (req, res) => {
  try {
    const funding = await Funding.findById(req.params.id)
      .populate("user", "fullName email image phone city address")
      .populate("verification");

    if (!funding) {
      return res.status(404).json({
        success: false,
        message: "Funding not found",
      });
    }

    const decryptedPhone = decrypt(funding.user.phone);
    funding.user.phone = decryptedPhone;

    res.status(200).json({
      success: true,
      data: funding,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getAllFundingsForAdmin = async (req, res) => {
  try {
    const { type, status } = req.query;

    const query = {};
    if (type) query.type = type;
    if (status) query.status = status;

    const data = await Funding.find(query)
      .populate("user", "fullName email image phone city address panNumber")
      .populate("verification")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
