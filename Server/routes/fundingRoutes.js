import express from "express";
import upload from "../configs/multer.js";
import { authMiddleware } from "../middlewares/authmiddleware.js";
import * as fundingController from "../controllers/fundingController.js";

const fundingRouter = express.Router();

/* =========================
   DOCUMENT FIELDS CONFIG
   ========================= */

const documentFields = [
  // Common
  { name: "incomeProof", maxCount: 1 },
  { name: "bankStatement", maxCount: 1 },
  { name: "creditReport", maxCount: 1 },
  { name: "additionalDocs", maxCount: 5 },

  // Startup
  { name: "pitchDeck", maxCount: 1 },
  { name: "financialProjections", maxCount: 1 },
  { name: "capTable", maxCount: 1 },
  { name: "incorporationCertificate", maxCount: 1 },
  { name: "startupBankStatement", maxCount: 1 },
  { name: "tractionProof", maxCount: 1 },

  // Business
  { name: "cashFlow", maxCount: 1 },
  { name: "balanceSheet", maxCount: 1 },
  { name: "profitLoss", maxCount: 1 },
  { name: "gstReturns", maxCount: 1 },
  { name: "itrReturns", maxCount: 1 },
  { name: "businessRegistration", maxCount: 1 },
  { name: "businessBankStatement", maxCount: 1 },
  { name: "invoiceRecords", maxCount: 1 },

  // Property
  { name: "saleDeed", maxCount: 1 },
  { name: "titleDeed", maxCount: 1 },
  { name: "taxReceipt", maxCount: 1 },
  { name: "encumbrance", maxCount: 1 },
  { name: "landRecords", maxCount: 1 },
  { name: "buildingApproval", maxCount: 1 },
  { name: "propertyInsurance", maxCount: 1 },
  { name: "valuationReport", maxCount: 1 },
  { name: "occupancyCertificate", maxCount: 1 },
  { name: "noObjectionCertificates", maxCount: 5 },
];

/* =========================
   USER ROUTES
   ========================= */

// 🔥 Create funding (with documents)
fundingRouter.post(
  "/",
  authMiddleware,
  upload.fields(documentFields),
  fundingController.createFunding
);

// 🔄 Update funding (partial + optional files)
fundingRouter.patch(
  "/:id",
  authMiddleware,
  upload.fields(documentFields),
  fundingController.updateFunding
);

// 📄 Get all funding (optional filters)
fundingRouter.get(
  "/",
  authMiddleware,
  fundingController.getAllFunding
);

// 📄 Get funding by user ID
fundingRouter.get(
  "/user/:userId",
  authMiddleware,
  fundingController.getFundingByUserId
);

// 📄 Get single funding
fundingRouter.get(
  "/:id",
  authMiddleware,
  fundingController.getFundingById
);

export default fundingRouter;