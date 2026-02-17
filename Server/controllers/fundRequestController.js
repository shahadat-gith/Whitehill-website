import Startup from "../models/fundRequest/startup.js";
import BusinessVenture from "../models/fundRequest/businessVenture.js";
import Individual from "../models/fundRequest/individual.js";

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

    const documentKeys = [
      "projectionStatements",
      "legalDocuments",
      "pitchDeck",
      "shareHoldingPattern",
    ];

    const documents = {};

    for (const key of documentKeys) {
      const file = req.files?.[key]?.[0];
      if (!file) {
        return res.status(400).json({ message: `${key} is required` });
      }

      documents[key] = await uploadPdfToCloudinary(
        file.buffer,
        `startup/${key}`
      );
    }

    const fundRequest = await Startup.create({
      requester: req.userId,
      name,
      sector,
      description,
      stage,
      teamSize,
      foundationYear,
      currentRevenue,
      website,
      foundingTeam: JSON.parse(foundingTeam),
      businessModel: JSON.parse(businessModel),
      fundingType,
      fundUsageBreakdown,
      keyRisks,
      location: JSON.parse(location),
      amountRequested,
      documents,
    });

    res.status(201).json({ success: true, data: fundRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
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



export const createIndividualFundRequest = async (req, res) => {
  try {
    const {
      category,
      individualType,
      projectType,
      cost,
      riskDisclosure,
      location,
      amountRequested,
      rera,
    } = req.body;

    const documentKeys = [
      "landOwnershipProof",
      "layout",
      "reraCertificate",
      "financialModel",
    ];

    const documents = {};

    for (const key of documentKeys) {
      const file = req.files?.[key]?.[0];
      if (!file) {
        return res.status(400).json({ message: `${key} is required` });
      }

      documents[key] = await uploadPdfToCloudinary(
        file.buffer,
        `individual/${key}`
      );
    }

    // Add rera as a separate field in documents
    documents.rera = rera;

    const fundRequest = await Individual.create({
      requester: req.userId,
      category,
      individualType,
      projectType,
      cost: JSON.parse(cost),
      riskDisclosure: JSON.parse(riskDisclosure),
      location: JSON.parse(location),
      amountRequested,
      documents,
    });

    res.status(201).json({ success: true, data: fundRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
