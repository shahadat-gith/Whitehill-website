import express from "express";
import upload from "../configs/multer.js";
import { authMiddleware } from "../middlewares/authmiddleware.js";

import {
  createStartupFundRequest,
  createBusinessVentureFundRequest,
} from "../controllers/fundRequestController.js";

const fundRequestRouter = express.Router();

/* ===================== STARTUP FUND REQUEST ===================== */
fundRequestRouter.post(
  "/startup",
  authMiddleware,
  upload.fields([
    { name: "projectionStatements", maxCount: 1 },
    { name: "legalDocuments", maxCount: 1 },
    { name: "pitchDeck", maxCount: 1 },
    { name: "shareHoldingPattern", maxCount: 1 },
  ]),
  createStartupFundRequest
);

/* ===================== BUSINESS VENTURE FUND REQUEST ===================== */
fundRequestRouter.post(
  "/business",
  authMiddleware,
  upload.fields([
    { name: "businessPlan", maxCount: 1 },
    { name: "bankStatements", maxCount: 1 },
    { name: "financialStatements", maxCount: 1 },
    { name: "gstReturns", maxCount: 1 },
    { name: "legalDocuments", maxCount: 1 },
    { name: "cashFlowStatement", maxCount: 1 },
  ]),
  createBusinessVentureFundRequest
);


export default fundRequestRouter;
