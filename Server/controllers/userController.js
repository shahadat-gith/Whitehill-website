import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { encrypt, decrypt } from "../utils/crypto.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../configs/cloudinary.js";




export const registerUser = async (req, res) => {
  const { fullName, email, password, phone } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Encrypt phone
    const encryptedPhone = encrypt(phone);

    // Create user
    const newUser = new User({
      fullName,
      email,
      phone: encryptedPhone,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET
    );



    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
      token,
    });

  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // Success response (no token exposure)
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user,
      token
    });

  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId).select("-password");

    const decryptedPhone = decrypt(user.phone);
    user.phone = decryptedPhone;

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};




export const updateKYC = async (req, res) => {
  try {
    // ✅ get user id from auth middleware
    const userId = req.userId;

    /* ================= EXTRACT DATA ================= */
    const { aadharNumber, panNumber } = req.body;

    if (!aadharNumber || !panNumber) {
      return res.status(400).json({
        success: false,
        message: "Aadhaar and PAN numbers are required",
      });
    }

    /* ================= VALIDATIONS ================= */
    if (!/^\d{12}$/.test(aadharNumber)) {
      return res.status(400).json({
        success: false,
        message: "Aadhaar number must be 12 digits",
      });
    }

    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(panNumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid PAN number format",
      });
    }

    const existingUser = await User.findById(userId);

    if (existingUser?.kyc?.status === "Verified") {
      return res.status(400).json({
        success: false,
        message: "KYC already verified and cannot be updated",
      });
    }

    /* ================= FILE VALIDATION ================= */
    if (
      !req.files?.aadharFront ||
      !req.files?.aadharBack ||
      !req.files?.panFront
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Aadhaar front & back images and PAN front image are required",
      });
    }

    /* ================= BASE KYC OBJECT ================= */
    const kycData = {
      aadhar: { aadharNumber },
      pan: { panNumber },
      status: "Pending",
      verifiedAt: null,
    };

    /* ================= UPLOAD FILES ================= */
    const aadharFront = await uploadToCloudinary(
      req.files.aadharFront[0].buffer,
      "kyc/aadhar/images"
    );

    const aadharBack = await uploadToCloudinary(
      req.files.aadharBack[0].buffer,
      "kyc/aadhar/images"
    );

    const panFront = await uploadToCloudinary(
      req.files.panFront[0].buffer,
      "kyc/pan/images"
    );

    kycData.aadhar.frontImageUrl = aadharFront;
    kycData.aadhar.backImageUrl = aadharBack;
    kycData.pan.frontImageUrl = panFront;

    /* ================= DELETE OLD FILES ================= */
    if (existingUser?.kyc) {
      const old = existingUser.kyc;
      const deletions = [];

      const pushDelete = (publicId) => {
        if (publicId) {
          deletions.push(
            deleteFromCloudinary(publicId, "image").catch(() => null)
          );
        }
      };

      // Aadhaar
      pushDelete(old.aadhar?.frontImageUrl?.public_id);
      pushDelete(old.aadhar?.backImageUrl?.public_id);

      // PAN
      pushDelete(old.pan?.frontImageUrl?.public_id);

      await Promise.allSettled(deletions);
    }

    /* ================= UPDATE USER ================= */
    const user = await User.findByIdAndUpdate(
      userId,
      { kyc: kycData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // decrypt before sending
    user.phone = decrypt(user.phone);

    /* ================= RESPONSE ================= */
    res.status(200).json({
      success: true,
      message: "KYC submitted successfully. Verification in progress.",
      user,
    });
  } catch (error) {
    console.error("Error updating KYC:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit KYC. Please try again.",
    });
  }
};


// Admin: Verify KYC
export const verifyKYC = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, rejectionReason } = req.body;

    // Validate status
    if (!["Verified", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be 'Verified' or 'Rejected'"
      });
    }

    // If rejecting, reason is required
    if (status === "Rejected" && !rejectionReason) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required"
      });
    }

    const updateData = {
      "kyc.status": status
    };

    if (status === "Verified") {
      updateData["kyc.verifiedAt"] = new Date();
      updateData["kyc.rejectionReason"] = undefined;
    } else {
      updateData["kyc.rejectionReason"] = rejectionReason;
      updateData["kyc.verifiedAt"] = undefined;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select("kyc email name");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (!user.kyc) {
      return res.status(400).json({
        success: false,
        message: "No KYC submitted by this user"
      });
    }

    // TODO: Send email notification to user about KYC status

    res.status(200).json({
      success: true,
      message: `KYC ${status.toLowerCase()} successfully`,
      kyc: {
        status: user.kyc.status,
        verifiedAt: user.kyc.verifiedAt,
        rejectionReason: user.kyc.rejectionReason
      }
    });

  } catch (error) {
    console.error("Error verifying KYC:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify KYC"
    });
  }
};


export const updateBankDetails = async (req, res) => {
  try {
    const userId = req.userId;

    const { accountHolderName, accountNumber, ifsc, bankName, branch } = req.body;

    if (!accountHolderName || !accountNumber || !ifsc || !bankName || !branch) {
      return res.status(400).json({
        success: false,
        message: "All bank details fields are required"
      });
    }
    const user = await User.findByIdAndUpdate(
      userId,
      { bankDetails: { accountHolderName, accountNumber, ifsc, bankName, branch } },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    // decrypt before sending
    user.phone = decrypt(user.phone);
    res.status(200).json({
      success: true,
      message: "Bank details updated successfully",
      user
    });
  } catch (error) {
    console.error("Error updating bank details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update bank details"
    });
  }
}

export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { fullName, phone, email } = req.body;

    // 1️⃣ Find user first
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 2️⃣ Update basic fields if provided
    if (fullName) user.fullName = fullName;
    if (phone) {
      const encryptedPhone = encrypt(phone);
      user.phone = encryptedPhone;
    }
    if (email) user.email = email;

    if (req.file) {
      const newImage = await uploadToCloudinary(
        req.file.buffer,
        "profiles"
      );

      if (user.image?.public_id) {
        await deleteFromCloudinary(user.image.public_id, "image");
      }

      user.image.url = newImage.url;
      user.image.public_id = newImage.public_id;
    }

    // 4️⃣ Save updated user
    await user.save({ validateBeforeSave: true });

    // 5️⃣ Decrypt phone before sending response
    user.phone = decrypt(user.phone);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};
