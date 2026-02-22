import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { uploadImageToCloudinary } from "../configs/cloudinary.js";
import { decrypt } from "../utils/crypto.js";
import { instance } from "../configs/razorpay.js";
import { sendEmail } from "../configs/nodemailer.js";

import Project from "../models/project.js";
import Investment from "../models/investment.js";
import User from "../models/user.js";
import Query from "../models/query.js";




//auth 

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (email === adminEmail && password === adminPassword) {
            const token = jwt.sign(
                { key: process.env.ADMIN_KEY },
                process.env.ADMIN_JWT_SECRET
            );

            return res.status(200).json({ success: true, message: "Login successful", token });
        } else {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

//Queries

export const createQuery = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        const query = await Query.create({ name, email, phone, message });
        return res.status(200).json({ success: true, query });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export const getQueries = async (req, res) => {
    try {
        const queries = await Query.find();
        return res.status(200).json({ success: true, queries });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export const replyToQuery = async (req, res) => {
    try {
        const { queryId, reply } = req.body;
        const query = await Query.findById(queryId);
        if (!query) {
            return res.status(404).json({ success: false, message: "Query not found" });
        }

        //send mail to user
        await sendEmail({
            to: query.email,
            subject: "Reply to your query",
            html: `<p>Hello ${query.name},</p><p>Thank you for your query. Here is our reply:</p><p>${reply}</p>`
        });
        query.reply = reply;
        await query.save();
        return res.status(200).json({ success: true, message: "Reply sent successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};



//Projects 

export const createProject = async (req, res) => {
    try {
        const {
            category,
            name,
            type,
            city,
            state,
            stage,
            targetHold,
            minCommitment,
            targetReturn,
            risk,
            description,
            rera,
        } = req.body;

        /* ================= BASIC VALIDATION ================= */
        if (
            !category ||
            !name ||
            !type ||
            !city ||
            !state ||
            !stage ||
            !targetHold ||
            !minCommitment ||
            !targetReturn ||
            !risk ||
            !description
        ) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided",
            });
        }

        /* ================= CATEGORY VALIDATION ================= */
        if (category === "real_estate" && !rera) {
            return res.status(400).json({
                success: false,
                message: "RERA number is required for real estate projects",
            });
        }

        if (category === "startup" && rera) {
            return res.status(400).json({
                success: false,
                message: "RERA is not applicable for startup projects",
            });
        }

        /* ================= IMAGE UPLOAD ================= */
        let images = [];

        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map((file) =>
                uploadImageToCloudinary(file.buffer, "projects")
            );

            const uploadResults = await Promise.all(uploadPromises);

            images = uploadResults.map((img) => ({
                url: img.url,
                public_id: img.public_id,
            }));
        }

        /* ================= HIGHLIGHTS ================= */
        const highlights = req.body.highlights
            ? JSON.parse(req.body.highlights)
            : [];

        /* ================= CREATE PROJECT ================= */
        const project = await Project.create({
            category,
            name,
            type,
            city,
            state,
            rera: rera || null,
            stage,
            targetHold,
            minCommitment,
            targetReturn,
            risk,
            description,
            images,
            highlights,
        });

        return res.status(201).json({
            success: true,
            message: "Project created successfully",
            project,
        });
    } catch (error) {
        console.error("Create Project Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create project",
            error: error.message,
        });
    }
};

export const updateProject = async (req, res) => {
    try {
        const { projectId } = req.params;

        /* ================= FIND PROJECT ================= */
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        const {
            category,
            name,
            type,
            city,
            state,
            stage,
            targetHold,
            minCommitment,
            targetReturn,
            risk,
            description,
            rera,
        } = req.body || {};


        /* ================= CATEGORY VALIDATION ================= */
        const finalCategory = category || project.category;

        if (finalCategory === "real_estate" && !rera && !project.rera) {
            return res.status(400).json({
                success: false,
                message: "RERA number is required for real estate projects",
            });
        }

        if (finalCategory === "startup" && rera) {
            return res.status(400).json({
                success: false,
                message: "RERA is not applicable for startup projects",
            });
        }

        /* ================= UPDATE FIELDS ================= */
        const updatableFields = {
            category,
            name,
            type,
            city,
            state,
            stage,
            targetHold,
            minCommitment,
            targetReturn,
            risk,
            description,
        };

        Object.keys(updatableFields).forEach((key) => {
            if (updatableFields[key] !== undefined) {
                project[key] = updatableFields[key];
            }
        });

        /* ================= RERA ================= */
        if (finalCategory === "real_estate") {
            project.rera = rera ?? project.rera;
        } else {
            project.rera = null;
        }

        /* ================= HIGHLIGHTS ================= */
        if (req.body.highlights) {
            project.highlights = JSON.parse(req.body.highlights);
        }

        /* ================= SAVE ================= */
        await project.save();

        return res.status(200).json({
            success: true,
            message: "Project updated successfully",
            project,
        });
    } catch (error) {
        console.error("Update Project Error:", error);

        return res.status(500).json({
            success: false,
            message: "Error updating project",
            error: error.message,
        });
    }
};


export const uploadProjectImages = async (req, res) => {
    try {
        const { projectId } = req.body;

        if (!projectId) {
            return res.status(400).json({
                success: false,
                message: "Project ID is required",
            });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one image file is required",
            });
        }

        /* ================= FIND PROJECT ================= */
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        /* ================= UPLOAD IMAGES ================= */
        const uploadPromises = req.files.map((file) =>
            uploadImageToCloudinary(file.buffer, "projects")
        );

        const uploadedImages = await Promise.all(uploadPromises);

        const newImages = uploadedImages.map((img) => ({
            url: img.url,
            public_id: img.public_id,
        }));

        /* ================= APPEND IMAGES ================= */
        project.images.push(...newImages);

        /* ================= SAVE ================= */
        await project.save();

        return res.status(200).json({
            success: true,
            message: "Images uploaded successfully",
            images: newImages,
            project,
        });
    } catch (error) {
        console.error("Upload Project Images Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to upload project images",
            error: error.message,
        });
    }
};


export const deleteProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await Project.findByIdAndDelete(projectId);

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }
        return res.status(200).json({ success: true, message: "Project deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Error deleting project", error: error.message });
    }
};



//Investments


export const updateInvestmentStatus = async (req, res) => {
  try {
    const { investmentId, status, cancelReason="" } = req.body;

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


//Payment Gateway

export const getPaymentHistory = async (req, res) => {
    try {

        const {count = 20, skip = 0} = req.query;
        const payments = await instance.payments.all({ count, skip});

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



//users

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



//Dashboards data

export const getDashboardData = async (req, res) => {
  try {
    const [
      recentQueries,
      recentUsers,
      recentInvestments,
      statsAgg,
    ] = await Promise.all([
      // Used in Home.jsx -> Recent Queries table
      Query.find()
        .sort({ createdAt: -1 })
        .limit(20)
        .select("name email phone message reply createdAt")
        .lean(),

      // Used in Home.jsx -> New Users list
      User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("fullName email createdAt kyc.status")
        .lean(),

      // Used in Home.jsx -> Recent Investments table
      Investment.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("user project transaction")
        .populate({ path: "user", select: "fullName email" })
        .populate({ path: "project", select: "name category" })
        .populate({ path: "transaction", select: "amount" })
        .lean(),

      // Stats used in top cards
      Promise.all([
        Project.countDocuments(),
        Project.countDocuments({ isActive: true }),
        User.countDocuments(),
        User.countDocuments({ "kyc.status": "pending" }),
        Investment.countDocuments(),
        Investment.countDocuments({ status: "pending" }),

        // totalAmountInvested = sum of transaction.amount
        Investment.aggregate([
          {
            $lookup: {
              from: "transactions",
              localField: "transaction",
              foreignField: "_id",
              as: "tx",
            },
          },
          { $unwind: { path: "$tx", preserveNullAndEmptyArrays: true } },
          {
            $group: {
              _id: null,
              totalAmountInvested: { $sum: { $ifNull: ["$tx.amount", 0] } },
            },
          },
        ]),

        // totalDistributions = sum of user.totalDistributions
        User.aggregate([
          {
            $group: {
              _id: null,
              totalDistributions: {
                $sum: { $ifNull: ["$totalDistributions", 0] },
              },
            },
          },
        ]),
      ]),
    ]);

    const [
      totalProjects,
      activeProjects,
      totalUsers,
      kycPending,
      totalInvestments,
      pendingInvestments,
      investedAgg,
      distributionAgg,
    ] = statsAgg;

    const dashboard = {
      stats: {
        totalProjects,
        activeProjects,
        totalUsers,
        kycPending,
        totalInvestments,
        pendingInvestments,
        totalAmountInvested: investedAgg?.[0]?.totalAmountInvested || 0,
        totalDistributions: distributionAgg?.[0]?.totalDistributions || 0,
      },
      recentInvestments,
      recentUsers,
      recentQueries,
    };

    return res.status(200).json({
      success: true,
      dashboard,
    });
  } catch (error) {
    console.error("getDashboardData error:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving dashboard data",
      error: error.message,
    });
  }
};



