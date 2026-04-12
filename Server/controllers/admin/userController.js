import mongoose from "mongoose";
import User from "../../models/user.js";
import { decrypt } from "../../utils/crypto.js";
import { sendEmail } from "../../configs/nodemailer.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving users",
      error: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const decryptedPhone = decrypt(user.phone);
    user.phone = decryptedPhone;
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving user",
      error: error.message,
    });
  }
};


export const verifyKYC = async (req, res) => {
  try {
    const { userId, status, rejectionReason } = req.body;

    // ✅ validate userId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Valid userId is required",
      });
    }

    // ✅ validate status
    const st = String(status || "").toLowerCase();
    if (!["verified", "rejected"].includes(st)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be 'verified' or 'rejected'",
      });
    }

    // ✅ reason required if rejected
    if (st === "rejected" && !String(rejectionReason || "").trim()) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required",
      });
    }

    // ✅ fetch user first (to ensure kyc submitted + get email/name)
    const existingUser = await User.findById(userId).select("kyc email fullName");
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ verify user submitted kyc (basic check)
    const kyc = existingUser.kyc;
    const hasKyc =
      kyc &&
      (kyc?.aadhar?.aadharNumber ||
        kyc?.aadhar?.frontImageUrl?.url ||
        kyc?.aadhar?.backImageUrl?.url ||
        kyc?.pan?.panNumber ||
        kyc?.pan?.frontImageUrl?.url);

    if (!hasKyc) {
      return res.status(400).json({
        success: false,
        message: "KYC is not completed by this user",
      });
    }

    // ✅ build update (use $set / $unset — don't set undefined)
    const update = { $set: { "kyc.status": st } };

    if (st === "verified") {
      update.$set["kyc.verifiedAt"] = new Date();
      update.$set["kyc.rejectionReason"] = null;
    } else {
      update.$set["kyc.rejectionReason"] = String(rejectionReason).trim();
      update.$set["kyc.rejectedAt"] = new Date();
    }

    const user = await User.findByIdAndUpdate(userId, update, {
      new: true,
      runValidators: true,
    }).select("kyc email fullName");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ send email (best-effort)
    let emailSent = false;
    let emailError = null;

    try {
      const userName = user.fullName || "User";

      if (st === "verified") {
        await sendEmail({
          to: user.email,
          subject: "Whitehilll Capital : KYC Verified ✅",
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2 style="margin:0 0 10px;">KYC Verified</h2>
              <p>Hello ${userName},</p>
              <p>Your KYC has been successfully <b>verified</b>.</p>
              <div style="margin:14px 0; padding:12px; border:1px solid #e5e7eb; border-radius:10px;">
                <p style="margin:0;"><b>Status:</b> VERIFIED</p>
                <p style="margin:6px 0 0;"><b>Verified At:</b> ${user.kyc?.verifiedAt ? new Date(user.kyc.verifiedAt).toLocaleString() : "-"}</p>
              </div>
              <p style="color:#6b7280; font-size: 13px;">
                If you have any questions, please contact support.
              </p>
            </div>
          `,
        });
      } else {
        await sendEmail({
          to: user.email,
          subject: "Whitehilll Capital : KYC Rejected ❌ (Action Required)",
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2 style="margin:0 0 10px;">KYC Rejected</h2>
              <p>Hello ${userName},</p>
              <p>Your KYC submission has been <b>rejected</b>.</p>

              <div style="margin:14px 0; padding:12px; border:1px solid #e5e7eb; border-radius:10px;">
                <p style="margin:0;"><b>Status:</b> REJECTED</p>
                <p style="margin:6px 0 0;"><b>Reason:</b> ${String(user.kyc?.rejectionReason || rejectionReason)}</p>
              </div>

              <p>Please re-submit your KYC with correct details.</p>
              <p style="color:#6b7280; font-size: 13px;">
                If you think this is a mistake, contact support.
              </p>
            </div>
          `,
        });
      }

      emailSent = true;
    } catch (err) {
      emailSent = false;
      emailError = err?.message || "Failed to send email";
    }

    return res.status(200).json({
      success: true,
      message: `KYC ${st} successfully`,
      user,
      emailSent,
      emailError,
    });
  } catch (error) {
    console.error("Error verifying KYC:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify KYC",
      error: error.message,
    });
  }
};
