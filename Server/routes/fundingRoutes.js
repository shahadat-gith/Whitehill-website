import express from "express";
import upload from "../configs/multer.js";
import { authMiddleware } from "../middlewares/authmiddleware.js";
import { adminAuth } from "../middlewares/adminMiddleware.js";
import * as fundingController from "../controllers/fundingController.js";

const fundingRouter = express.Router();

fundingRouter.post(
  "/startup",
  authMiddleware,
  upload.fields([
    { name: "incomeProof", maxCount: 1 },
    { name: "bankStatement", maxCount: 1 },
    { name: "pitchDeck", maxCount: 1 },
    { name: "additionalDocs", maxCount: 10 },
  ]),
  fundingController.createStartupFunding
);

fundingRouter.post(
  "/business",
  authMiddleware,
  upload.fields([
    { name: "cashFlow", maxCount: 1 },
    { name: "balanceSheet", maxCount: 1 },
    { name: "profitLoss", maxCount: 1 },
  ]),
  fundingController.createBusinessFunding
);

fundingRouter.post(
  "/property",
  authMiddleware,
  upload.fields([
    { name: "saleDeed", maxCount: 1 },
    { name: "titleDeed", maxCount: 1 },
    { name: "taxReceipt", maxCount: 1 },
    { name: "encumbrance", maxCount: 1 },
    { name: "landRecords", maxCount: 1 },
    { name: "buildingApproval", maxCount: 1 },
  ]),
  fundingController.createPropertyFunding
);

fundingRouter.get("/me", authMiddleware, fundingController.getUserFundings);
fundingRouter.get("/", adminAuth, fundingController.getAllFundings);
fundingRouter.get("/:id", authMiddleware, fundingController.getFundingById);
fundingRouter.patch("/:id/admin-review", adminAuth, fundingController.updateFundingReview);
fundingRouter.delete("/:id", adminAuth, fundingController.deleteFunding);

export default fundingRouter;
