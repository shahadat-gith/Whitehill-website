import Startup from "../models/fundRequest/startup.js";
import BusinessVenture from "../models/fundRequest/businessVenture.js";
import Property from "../models/fundRequest/property.js";

import { uploadPdfToCloudinary } from "../configs/cloudinary.js";



export const createStartupFundRequest = async (req, res) => {
  try {
    const {
      name,
      sector,
      description,
      stage,
      teamSize,
      foundationYear,
      currentRevenue,
      website,
      foundingTeam,
      businessModel,
      fundingType,
      fundUsageBreakdown,
      keyRisks,
      location,
      amountRequested,
    } = req.body;

    // 1. Basic Validation for required text fields
    if (!name || !sector || !amountRequested || !req.userId) {
      return res.status(400).json({ message: "Missing core required fields" });
    }

    // 2. Safely Parse JSON strings from FormData
    const parseOrThrow = (data, fieldName) => {
      try {
        return typeof data === "string" ? JSON.parse(data) : data;
      } catch (err) {
        throw new Error(`Invalid format for ${fieldName}`);
      }
    };

    const parsedFoundingTeam = parseOrThrow(foundingTeam, "foundingTeam");
    const parsedBusinessModel = parseOrThrow(businessModel, "businessModel");
    const parsedLocation = parseOrThrow(location, "location");

    // 3. Document Upload Logic
    const documentKeys = [
      "projectionStatements",
      "legalDocuments",
      "pitchDeck",
      "shareHoldingPattern",
    ];

    const documents = {};
    const uploadedPublicIds = []; // Track for cleanup if later uploads fail

    try {
      for (const key of documentKeys) {
        const file = req.files?.[key]?.[0];

        if (!file) {
          throw new Error(`Missing required document: ${key}`);
        }

        // Upload to Cloudinary
        const result = await uploadPdfToCloudinary(
          file.buffer,
          `startups/${name.replace(/\s+/g, "_")}/${key}`
        );

        documents[key] = {
          url: result.secure_url,
          public_id: result.public_id,
        };
        
        uploadedPublicIds.push(result.public_id);
      }
    } catch (uploadError) {
      return res.status(400).json({ message: uploadError.message });
    }

    // 4. Create the Database Entry
    const fundRequest = await Startup.create({
      requester: req.userId,
      name,
      sector,
      description,
      stage,
      teamSize: Number(teamSize),
      foundationYear: Number(foundationYear),
      currentRevenue: Number(currentRevenue) || 0,
      website,
      foundingTeam: parsedFoundingTeam,
      businessModel: parsedBusinessModel,
      fundingType,
      fundUsageBreakdown,
      keyRisks,
      location: parsedLocation,
      amountRequested: Number(amountRequested),
      documents,
    });

    res.status(201).json({ 
      success: true, 
      message: "Startup fund request submitted successfully",
      data: fundRequest 
    });

  } catch (error) {
    console.error("Creation Error:", error);
    // Handle Mongoose Validation Errors specifically
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Internal Server Error", details: error.message });
  }
};


export const createBusinessVentureFundRequest = async (req, res) => {
  try {
    const {
      stage,
      name,
      industry,
      businessModel,
      description,
      teamSize,
      website,
      turnOver,
      profitMargin,
      outStandingLoan,
      purpose,
      fundingType,
      riskDisclosure,
      businessPartners,
      location,
      amountRequested,
    } = req.body;

    const documentKeys = [
      "businessPlan",
      "bankStatements",
      "financialStatements",
      "gstReturns",
      "legalDocuments",
      "cashFlowStatement",
    ];

    const documents = {};

    for (const key of documentKeys) {
      const file = req.files?.[key]?.[0];
      if (!file) {
        return res.status(400).json({ message: `${key} is required` });
      }

      documents[key] = await uploadPdfToCloudinary(
        file.buffer,
        `business/${key}`
      );
    }

    const fundRequest = await BusinessVenture.create({
      requester: req.userId,
      stage,
      name,
      industry,
      businessModel,
      description,
      teamSize,
      website,
      turnOver,
      profitMargin,
      outStandingLoan,
      purpose: JSON.parse(purpose),
      fundingType,
      riskDisclosure: JSON.parse(riskDisclosure),
      businessPartners: JSON.parse(businessPartners),
      location: JSON.parse(location),
      amountRequested,
      documents,
    });

    res.status(201).json({ success: true, data: fundRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const createPropertyFundRequest = async (req, res) => {
  try {
    const {
      category,
      individualType,
      projectType,
      rera,
      cost,
      riskDisclosure,
      location,
      amountRequested,
    } = req.body;

    // 1. Core Validation
    if (!category || !individualType || !projectType || !amountRequested) {
      return res.status(400).json({ success: false, message: "Missing required core fields" });
    }

    // 2. Safe Parsing Helper
    const parseField = (data, name) => {
      try {
        return typeof data === "string" ? JSON.parse(data) : data;
      } catch (e) {
        throw new Error(`Invalid JSON format for ${name}`);
      }
    };

    const parsedCost = parseField(cost, "cost");
    const parsedRisk = parseField(riskDisclosure, "riskDisclosure");
    const parsedLocation = parseField(location, "location");

    // 3. Document Processing
    const documentKeys = [
      "landOwnershipProof",
      "layout",
      "reraCertificate",
      "financialModel",
    ];

    const documents = {};

    for (const key of documentKeys) {
      const file = req.files?.[key]?.[0];

      // Agent-specific logic from your original code
      if (individualType === "agent" && (key === "reraCertificate" || key === "financialModel") && !file) {
        return res.status(400).json({ success: false, message: `${key} is required for agents` });
      }

      if (file) {
        // Upload and store in the { url, public_id } format required by schema
        const result = await uploadPdfToCloudinary(
          file.buffer,
          `properties/${category}/${key}`
        );
        
        documents[key] = {
          url: result.secure_url,
          public_id: result.public_id,
        };
      }
    }

    // 4. Database Entry
    const fundRequest = await Property.create({
      requester: req.userId,
      category,
      individualType,
      projectType,
      rera: rera || null,
      cost: parsedCost,
      riskDisclosure: parsedRisk,
      location: parsedLocation,
      amountRequested: Number(amountRequested),
      documents,
    });

    res.status(201).json({ 
      success: true, 
      message: "Property fund request created successfully",
      data: fundRequest 
    });

  } catch (error) {
    console.error("Property Request Error:", error);
    
    // Handle Mongoose Validation Errors (e.g., enum violations)
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }

    res.status(500).json({ 
      success: false, 
      message: error.message || "Internal Server Error" 
    });
  }
};




export const getUserFundRequests = async (req, res) => {
  try {
    const userId = req.userId;

    const startupRequests = await Startup.find({ requester: userId }).sort({ createdAt: -1 });
    const businessRequests = await BusinessVenture.find({ requester: userId }).sort({ createdAt: -1 });
    const propertyRequests = await Property.find({ requester: userId }).sort({ createdAt: -1 });

    const fundRequests = [
      ...startupRequests.map(req => ({ ...req.toObject(), type: 'startup' })),
      ...businessRequests.map(req => ({ ...req.toObject(), type: 'business' })),
      ...propertyRequests.map(req => ({ ...req.toObject(), type: 'property' }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({ success: true, data: fundRequests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

