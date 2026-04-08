import { StartupFunding, BusinessFunding, PropertyFunding } from "../models/funding/index.js";

import { parseJSON, parseArrayField, uploadFile, uploadFiles, buildConsent } from "../utils/funding.js";

// Helper to handle standard error response
const handleError = (res, error, context) => {
  console.error(`${context} Error:`, error);
  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map((val) => val.message);
    return res.status(400).json({ success: false, message: messages.join(", ") });
  }
  return res.status(400).json({ success: false, message: error.message });
};

export const createStartupFunding = async (req, res) => {
  try {
    const { amount, tenureMonths, purpose, disclosures, riskFactors, consent, startup } = req.body;

    const parsedConsent = buildConsent(consent);
    if (!parsedConsent.agreedToTerms || !parsedConsent.agreedToPrivacyPolicy || !parsedConsent.agreedToCreditCheck) {
      return res.status(400).json({ success: false, message: "Consent to all required terms is mandatory." });
    }

    // 1. Base Documents (Matches baseFundingSchema)
    const baseDocs = {
      incomeProof: await uploadFile(req.files?.incomeProof?.[0], `funding/startup/${req.userId}/incomeProof`),
      bankStatement: await uploadFile(req.files?.bankStatement?.[0], `funding/startup/${req.userId}/bankStatement`),
      additionalDocs: await uploadFiles(req.files?.additionalDocs || [], `funding/startup/${req.userId}/additionalDocs`),
    };

    // 2. Startup Specific Data (Matches startup Schema)
    const parsedStartup = parseJSON(startup, "startup") || {};
    // Add pitchDeck which is inside the startup object in your schema
    parsedStartup.pitchDeck = await uploadFile(req.files?.pitchDeck?.[0], `funding/startup/${req.userId}/pitchDeck`);

    const funding = new StartupFunding({
      user: req.userId,
      fundingRequest: { amount: Number(amount), tenureMonths: Number(tenureMonths) || undefined, purpose },
      disclosures: parseJSON(disclosures, "disclosures"),
      riskFactors: parseArrayField(riskFactors),
      documents: baseDocs,
      consent: parsedConsent,
      startup: parsedStartup,
    });

    await funding.save();
    return res.status(201).json({ success: true, funding });
  } catch (error) {
    return handleError(res, error, "Create Startup Funding");
  }
};

export const createBusinessFunding = async (req, res) => {
  try {
    const { amount, tenureMonths, purpose, disclosures, riskFactors, consent, business } = req.body;

    const parsedConsent = buildConsent(consent);
    const baseDocs = {
      incomeProof: await uploadFile(req.files?.incomeProof?.[0], `funding/business/${req.userId}/incomeProof`),
      bankStatement: await uploadFile(req.files?.bankStatement?.[0], `funding/business/${req.userId}/bankStatement`),
      additionalDocs: await uploadFiles(req.files?.additionalDocs || [], `funding/business/${req.userId}/additionalDocs`),
    };

    // 3. Business Specific Financial Docs (Matches business.financialDocs)
    const parsedBusiness = parseJSON(business, "business") || {};
    parsedBusiness.financialDocs = {
      cashFlow: await uploadFile(req.files?.cashFlow?.[0], `funding/business/${req.userId}/cashFlow`),
      balanceSheet: await uploadFile(req.files?.balanceSheet?.[0], `funding/business/${req.userId}/balanceSheet`),
      profitLoss: await uploadFile(req.files?.profitLoss?.[0], `funding/business/${req.userId}/profitLoss`),
    };

    const funding = new BusinessFunding({
      user: req.userId,
      fundingRequest: { amount: Number(amount), tenureMonths: Number(tenureMonths) || undefined, purpose },
      disclosures: parseJSON(disclosures, "disclosures"),
      riskFactors: parseArrayField(riskFactors),
      documents: baseDocs,
      consent: parsedConsent,
      business: parsedBusiness,
    });

    await funding.save();
    return res.status(201).json({ success: true, funding });
  } catch (error) {
    return handleError(res, error, "Create Business Funding");
  }
};

export const createPropertyFunding = async (req, res) => {
  try {
    const { amount, tenureMonths, purpose, disclosures, riskFactors, consent, property } = req.body;

    const parsedConsent = buildConsent(consent);
    const baseDocs = {
      incomeProof: await uploadFile(req.files?.incomeProof?.[0], `funding/property/${req.userId}/incomeProof`),
      bankStatement: await uploadFile(req.files?.bankStatement?.[0], `funding/property/${req.userId}/bankStatement`),
      additionalDocs: await uploadFiles(req.files?.additionalDocs || [], `funding/property/${req.userId}/additionalDocs`),
    };

    // 4. Property Specific Legal Docs (Matches property.documents)
    const parsedProperty = parseJSON(property, "property") || {};
    parsedProperty.documents = {
      saleDeed: await uploadFile(req.files?.saleDeed?.[0], `funding/property/${req.userId}/saleDeed`),
      titleDeed: await uploadFile(req.files?.titleDeed?.[0], `funding/property/${req.userId}/titleDeed`),
      taxReceipt: await uploadFile(req.files?.taxReceipt?.[0], `funding/property/${req.userId}/taxReceipt`),
      encumbrance: await uploadFile(req.files?.encumbrance?.[0], `funding/property/${req.userId}/encumbrance`),
      landRecords: await uploadFile(req.files?.landRecords?.[0], `funding/property/${req.userId}/landRecords`),
      buildingApproval: await uploadFile(req.files?.buildingApproval?.[0], `funding/property/${req.userId}/buildingApproval`),
    };

    const funding = new PropertyFunding({
      user: req.userId,
      fundingRequest: { amount: Number(amount), tenureMonths: Number(tenureMonths) || undefined, purpose },
      disclosures: parseJSON(disclosures, "disclosures"),
      riskFactors: parseArrayField(riskFactors),
      documents: baseDocs,
      consent: parsedConsent,
      property: parsedProperty,
    });

    await funding.save();
    return res.status(201).json({ success: true, funding });
  } catch (error) {
    return handleError(res, error, "Create Property Funding");
  }
};













export const getUserFundings = async (req, res) => {
  try {
    const fundings = await Funding.find({ user: req.userId }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, fundings });
  } catch (error) {
    console.error("Get User Fundings Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch funding records." });
  }
};

export const getAllFundings = async (req, res) => {
  try {
    const filter = {};
    const { type } = req.query;
    if (type) filter.type = type;

    const fundings = await Funding.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, fundings });
  } catch (error) {
    console.error("Get All Fundings Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch funding records." });
  }
};

export const getFundingById = async (req, res) => {
  try {
    const { id } = req.params;
    const funding = await Funding.findById(id);

    if (!funding) {
      return res.status(404).json({ success: false, message: "Funding request not found." });
    }

    if (funding.user.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    return res.status(200).json({ success: true, funding });
  } catch (error) {
    console.error("Get Funding By ID Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch funding request." });
  }
};

export const updateFundingReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { decision, approvedAmount, interestRate, notes, rejectionReason, reviewedBy } = req.body;

    if (!decision || !["approved", "rejected", "needs_more_info"].includes(decision)) {
      return res.status(400).json({ success: false, message: "Invalid admin decision." });
    }

    const funding = await Funding.findById(id);
    if (!funding) {
      return res.status(404).json({ success: false, message: "Funding request not found." });
    }

    if (decision === "rejected" && !rejectionReason) {
      return res.status(400).json({ success: false, message: "Rejection reason is required when rejecting a request." });
    }

    funding.adminReview = {
      reviewedBy: reviewedBy || funding.adminReview?.reviewedBy || {},
      decision,
      approvedAmount: approvedAmount !== undefined ? Number(approvedAmount) : funding.adminReview?.approvedAmount,
      interestRate: interestRate !== undefined ? Number(interestRate) : funding.adminReview?.interestRate,
      notes,
      rejectionReason: rejectionReason || funding.adminReview?.rejectionReason,
      reviewedAt: new Date(),
    };

    await funding.save();

    return res.status(200).json({ success: true, funding });
  } catch (error) {
    console.error("Update Funding Review Error:", error);
    return res.status(500).json({ success: false, message: "Failed to update funding review." });
  }
};

export const deleteFunding = async (req, res) => {
  try {
    const { id } = req.params;
    const funding = await Funding.findById(id);

    if (!funding) {
      return res.status(404).json({ success: false, message: "Funding request not found." });
    }

    await funding.deleteOne();

    return res.status(200).json({ success: true, message: "Funding request deleted successfully." });
  } catch (error) {
    console.error("Delete Funding Error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete funding request." });
  }
};

