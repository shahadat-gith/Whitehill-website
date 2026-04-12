import mongoose from "mongoose";
import { Funding, Verification, FundingTransaction } from "../models/funding/index.js";
import { deleteFromCloudinary } from "../configs/cloudinary.js";
import { parseIfJSON, getUploadHandler, cleanEmpty, deepMerge, formatErrorResponse } from "../utils/funding.js";
import { decrypt } from "../utils/crypto.js";
import { instance as razorpay } from "../configs/razorpay.js";
import crypto from "crypto";




export const createFunding = async (req, res) => {
  try {
    const payload = { ...req.body };
    payload.user = req.userId;

    // Parse JSON fields
    payload.fundDetails = parseIfJSON(payload.fundDetails);
    payload.disclosures = parseIfJSON(payload.disclosures);
    payload.consent = parseIfJSON(payload.consent);
    payload.startup = parseIfJSON(payload.startup);
    payload.business = parseIfJSON(payload.business);
    payload.property = parseIfJSON(payload.property);
    payload.riskFactors = parseIfJSON(payload.riskFactors);
    payload.documents = payload.documents
      ? parseIfJSON(payload.documents)
      : {};

    // Upload files
    if (req.files) {
      const uploadedDocs = {};

      for (const fieldName of Object.keys(req.files)) {
        const filesArr = req.files[fieldName];

        const isArrayField =
          fieldName === "additionalDocs" ||
          fieldName === "noObjectionCertificates";

        if (isArrayField) {
          uploadedDocs[fieldName] = [];

          for (const file of filesArr) {
            const { fn, resource_type } = getUploadHandler(file.mimetype);

            const result = await fn(
              file.buffer,
              `funding/${payload.type}/documents/${fieldName}`
            );

            uploadedDocs[fieldName].push({
              url: result.url,
              public_id: result.public_id,
              resource_type,
              originalName: file.originalname,
            });
          }
        } else {
          const file = filesArr[0];
          const { fn, resource_type } = getUploadHandler(file.mimetype);

          const result = await fn(
            file.buffer,
            `funding/${payload.type}/documents/${fieldName}`
          );

          uploadedDocs[fieldName] = {
            url: result.url,
            public_id: result.public_id,
            resource_type,
            originalName: file.originalname,
          };
        }
      }

      payload.documents = { ...payload.documents, ...uploadedDocs };
    }

    cleanEmpty(payload);

    const funding = await Funding.create(payload);

    res.status(201).json({
      success: true,
      message: "Funding created successfully",
      data: funding,
    });
  } catch (error) {
    const { status, message } = formatErrorResponse(error);
    res.status(status).json({ success: false, message });
  }
};


export const updateFunding = async (req, res) => {
  try {
    const { id } = req.params;
    const funding = await Funding.findById(id);

    if (!funding) {
      return res.status(404).json({
        success: false,
        message: "Funding not found",
      });
    }

    // Prevent type change
    if (req.body.type && req.body.type !== funding.type) {
      return res.status(400).json({
        success: false,
        message: "Cannot change funding type",
      });
    }

    const payload = { ...req.body };

    payload.fundDetails = parseIfJSON(payload.fundDetails);
    payload.disclosures = parseIfJSON(payload.disclosures);
    payload.consent = parseIfJSON(payload.consent);
    payload.startup = parseIfJSON(payload.startup);
    payload.business = parseIfJSON(payload.business);
    payload.property = parseIfJSON(payload.property);
    payload.riskFactors = parseIfJSON(payload.riskFactors);

    // Handle file replacement
    if (req.files) {
      for (const fieldName of Object.keys(req.files)) {
        const filesArr = req.files[fieldName];
        const file = filesArr[0];

        const { fn, resource_type } = getUploadHandler(file.mimetype);

        // Delete old file if exists
        if (funding.documents?.[fieldName]?.public_id) {
          await deleteFromCloudinary(
            funding.documents[fieldName].public_id,
            funding.documents[fieldName].resource_type
          );
        }

        const result = await fn(
          file.buffer,
          `funding/${funding.type}/documents/${fieldName}`
        );

        payload.documents = payload.documents || {};
        payload.documents[fieldName] = {
          url: result.url,
          public_id: result.public_id,
          resource_type,
          originalName: file.originalname,
        };
      }
    }

    deepMerge(funding, payload);
    cleanEmpty(funding);

    await funding.save();

    res.status(200).json({
      success: true,
      message: "Funding updated",
      data: funding,
    });
  } catch (error) {
    const { status, message } = formatErrorResponse(error);
    res.status(status).json({ success: false, message });
  }
};


export const getAllFunding = async (req, res) => {
  try {
    const { type, status } = req.query;

    const query = {};
    if (type) query.type = type;
    if (status) query.status = status;

    const data = await Funding.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    const { status, message } = formatErrorResponse(error);
    res.status(status).json({ success: false, message });
  }
};


export const getFundingById = async (req, res) => {
  try {
    const funding = await Funding.findById(req.params.id);

    if (!funding) {
      return res.status(404).json({
        success: false,
        message: "Funding not found",
      });
    }

    res.status(200).json({
      success: true,
      data: funding,
    });
  } catch (error) {
    const { status, message } = formatErrorResponse(error);
    res.status(status).json({ success: false, message });
  }
};


export const getFundingByUserId = async (req, res) => {
  try {
    const funding = await Funding.find({ user: req.params.userId })
      .populate("verification")
      .sort({ createdAt: -1 })
      .lean();

    // Get all funding IDs to check for transactions in bulk
    const fundingIds = funding.map(f => f._id);
    const transactions = await FundingTransaction.find({
      funding: { $in: fundingIds },
      status: "completed"
    }).lean();

    // Create a map for quick lookup
    const transactionMap = {};
    transactions.forEach(tx => {
      transactionMap[tx.funding.toString()] = tx;
    });

    const filteredData = funding.map((f) => {
      const verification = f.verification || {};
      const extraRequests = verification.extraRequests || [];
      const transaction = transactionMap[f._id.toString()];

      // Separate pending & submitted
      const pendingRequests = extraRequests
        .filter((req) => req.status === "pending")
        .map((req) => ({
          _id: req._id,
          message: req.message,
          requestedAt: req.requestedAt,
        }));

      return {
        _id: f._id,
        type: f.type,
        amount: f.fundDetails?.amount || null,
        tenure: f.fundDetails?.tenureMonths || null,
        purpose: f.fundDetails?.purpose || null,
        status: f.status,

        // Approval info
        approvedAmount: verification.approvedAmount || null,
        interestRate: verification.interestRate || null,

        // Payment info - from transaction
        payment: transaction ? {
          transactionId: transaction.transactionId || transaction.razorpay_payment_id,
          method: transaction.method,
          paidAt: transaction.paidAt,
        } : null,

        // Rejection info
        rejectionReason: verification.rejectionReason || null,

        // Request tracking
        pendingRequests,
        actionRequired: f.status === "under_review" && pendingRequests.length > 0,

        createdAt: f.createdAt,
      };
    });

    res.status(200).json({ success: true, data: filteredData });
  } catch (error) {
    const { status, message } = formatErrorResponse(error);
    res.status(status).json({ success: false, message });
  }
};


export const uploadRequestedExtraDocuments = async (req, res) => {
  try {
    const { fundingId, requestId } = req.body;

    // 1. Validation
    if (!fundingId || !requestId) {
      return res.status(400).json({
        success: false,
        message: "Funding ID and Request ID are required",
      });
    }

    // 2. Check Files (upload.any() returns an array in req.files)
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one document to upload",
      });
    }

    // 3. Get verification record
    const verification = await Verification.findOne({ funding: fundingId });
    if (!verification) {
      return res.status(404).json({
        success: false,
        message: "Verification record not found",
      });
    }

    const uploadedFiles = [];

    // 4. Process Uploads
    // Since upload.any() is used, req.files is already an array
    for (const file of req.files) {
      const { fn, resource_type } = getUploadHandler(file.mimetype);

      const result = await fn(
        file.buffer,
        `funding/extra-requests/${requestId}`
      );

      uploadedFiles.push({
        url: result.secure_url || result.url,
        public_id: result.public_id,
        resource_type,
        originalName: file.originalname,
      });
    }

    // 5. Atomic Update
    // Using $elemMatch ensures we find the EXACT sub-document inside the array
    const updated = await Verification.updateOne(
      {
        funding: fundingId,
        "extraRequests": {
          $elemMatch: { _id: requestId, status: "pending" }
        },
      },
      {
        $set: {
          "extraRequests.$.status": "submitted",
          "extraRequests.$.files": uploadedFiles,
          "extraRequests.$.submittedAt": new Date(),
        },
      }
    );

    if (updated.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Request reference not found or already submitted",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Documents successfully synchronized",
    });

  } catch (error) {
    const { status, message } = formatErrorResponse(error);
    return res.status(status).json({
      success: false,
      message: message || "Internal server error during document upload",
    });
  }
};



export const downloadInvoice = async (req, res) => {
  try {
    const { fundingId } = req.params;

    const funding = await Funding.findById(fundingId)
      .populate({
        path: "verification",
        model: "Verification"
      })
      .populate("user", "fullName email phone")
      .lean();

    // 2. Initial Checks
    if (!funding) {
      return res.status(404).json({ success: false, message: "Application not found." });
    }

    if (funding.user._id.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: "Unauthorized access." });
    }

    // 3. Verification & Payment Validation
    const v = funding.verification;

    if (!v) {
      return res.status(400).json({
        success: false,
        message: "Funding verification not found.",
      });
    }

    // 4. Check if payment transaction exists and is completed
    const transaction = await FundingTransaction.findOne({ 
      funding: fundingId, 
      status: "completed" 
    }).lean();

    if (!transaction) {
      return res.status(400).json({
        success: false,
        message: "Invoice unavailable. Payment has not been completed yet.",
      });
    }

    // 5. Data Mapping for Frontend React-PDF
    const invoiceData = {
      invoiceNumber: transaction.invoiceId || `WH/CAP/${fundingId.slice(-6).toUpperCase()}`,
      invoiceDate: transaction.paidAt || transaction.date || new Date(),
      approvalDate: v.reviewedAt || v.createdAt,
      
      customer: {
        name: funding.user.fullName,
        email: funding.user.email,
        phone: decrypt(funding.user.phone),
      },
      
      funding: {
        type: funding.type?.toUpperCase() || "CREDIT",
        purpose: funding.fundDetails?.purpose || "Business Expansion",
        tenure: funding.fundDetails?.tenureMonths ? `${funding.fundDetails.tenureMonths} Months` : "N/A",
      },
      
      financials: {
        requestedAmount: funding.fundDetails?.amount || 0,
        approvedAmount: v.approvedAmount || 0,
        interestRate: v.interestRate || 0,
      },
      
      payment: {
        transactionId: transaction.transactionId || transaction.razorpay_payment_id || "N/A",
        method: transaction.method || "Direct Bank Transfer",
        disbursedAt: transaction.paidAt,
      },
    };

    return res.status(200).json({
      success: true,
      data: invoiceData,
    });

  } catch (error) {
    console.error("CRITICAL INVOICE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error: Failed to compile invoice data.",
      error: error.message
    });
  }
};

// ✅ PAYMENT ENDPOINTS

export const initiatePayment = async (req, res) => {
  try {
    const { fundingId, method, paymentData } = req.body;

    if (!fundingId || !method) {
      return res.status(400).json({ success: false, message: "Funding ID and method are required" });
    }

    // Populate verification to get the approved amount
    const funding = await Funding.findById(fundingId).populate("verification");
    if (!funding) {
      return res.status(404).json({ success: false, message: "Funding not found" });
    }

    if (funding.status !== "approved") {
      return res.status(400).json({ success: false, message: "Funding must be approved first" });
    }

    const amount = funding.verification?.approvedAmount;
    if (!amount) {
      return res.status(400).json({ success: false, message: "Approved amount not found in verification" });
    }

    // ───────── MANUAL PAYMENT ─────────
    if (method === "manual") {
      const { invoiceId, transactionId, payMethod } = paymentData || {};

      if (!invoiceId || !transactionId) {
        return res.status(400).json({ success: false, message: "Manual payments require Invoice and Transaction IDs" });
      }

      const transaction = await FundingTransaction.create({
        funding: fundingId,
        amount,
        status: "completed",
        invoiceId,
        transactionId,
        method: "manual",
        paidAt: new Date(),
      });

      return res.status(201).json({ success: true, data: transaction });
    }

    // ───────── RAZORPAY PAYMENT ─────────
    if (method === "razorpay") {
      const options = {
        amount: Math.round(amount * 100), 
        currency: "INR",
        receipt: `WH_REC_${fundingId.slice(-6).toUpperCase()}`,
        notes: { fundingId },
      };

      const order = await razorpay.orders.create(options);

      return res.status(200).json({
        success: true,
        data: {
          order_id: order.id,
          amount: options.amount,
          currency: options.currency,
          fundingId,
        },
      });
    }
  } catch (error) {
    console.error("Payment Initiation Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const completeRazorpayPayment = async (req, res) => {
  try {
    const { fundingId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    // 1. Signature Verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    // 2. Fetch Detailed Payment Info from Razorpay (To get the Method: UPI/Card/etc)
    const rzpPayment = await razorpay.payments.fetch(razorpay_payment_id);
    const actualMethod = rzpPayment.method.toUpperCase(); // e.g., 'UPI', 'CARD'

    // 3. Prevent Duplicates
    const existing = await FundingTransaction.findOne({ transactionId: razorpay_payment_id });
    if (existing) return res.status(400).json({ success: false, message: "Transaction already recorded" });

    const funding = await Funding.findById(fundingId).populate("verification");
    const amount = funding.verification?.approvedAmount || 0;
    const manualInvoiceId = `WH/RZP/${Date.now().toString().slice(-6)}`;

    // 4. Create Transaction Record
    const transaction = await FundingTransaction.create({
      funding: fundingId,
      amount,
      status: "completed",
      method: "razorpay",
      transactionId: razorpay_payment_id,
      razorpay_order_id,
      invoiceId: manualInvoiceId,
      paidAt: new Date(),
    });

    return res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    console.error("Razorpay Completion Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};