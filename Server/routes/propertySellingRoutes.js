import express from "express";
import {
  createPropertySellingDetails,
  uploadPropertySellingDocuments,
  uploadPropertySellingImages,
  uploadPropertySellingVideos,
} from "../controllers/propertySellingController.js";

import { authMiddleware } from "../middlewares/authmiddleware.js";
import upload from "../configs/multer.js";

const propertySellingRouter = express.Router();

propertySellingRouter.post(
  "/create-details",
  authMiddleware,
  createPropertySellingDetails
);

propertySellingRouter.post(
  "/:id/upload-documents",
  authMiddleware,
  upload.fields([
    { name: "landOwnershipProof", maxCount: 1 },
    { name: "khajnaReceipt", maxCount: 1 },
    { name: "ownershipProof", maxCount: 1 },
    { name: "buildingPlan", maxCount: 1 },
  ]),
  uploadPropertySellingDocuments
);

propertySellingRouter.post(
  "/:id/upload-images",
  authMiddleware,
  upload.fields([
    { name: "landImages", maxCount: 10 },
    { name: "propertyImages", maxCount: 10 },
  ]),
  uploadPropertySellingImages
);

propertySellingRouter.post(
  "/:id/upload-videos",
  authMiddleware,
  upload.fields([
    { name: "outsideView", maxCount: 1 },
    { name: "insideView", maxCount: 1 },
  ]),
  uploadPropertySellingVideos
);

export default propertySellingRouter;
