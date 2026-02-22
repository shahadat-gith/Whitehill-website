import express from "express";
import {
  submitPropertySelling,
} from "../controllers/propertySellingController.js";

import { authMiddleware } from "../middlewares/authmiddleware.js";
import upload from "../configs/multer.js";

const propertySellingRouter = express.Router();

propertySellingRouter.post(
  "/submit",
  authMiddleware,
  upload.fields([
    { name: "landOwnershipProof", maxCount: 1 },
    { name: "khajnaReceipt", maxCount: 1 },
    { name: "ownershipProof", maxCount: 1 },
    { name: "buildingPlan", maxCount: 1 },
    { name: "landImages", maxCount: 10 },
    { name: "landImages[]", maxCount: 10 },
    { name: "propertyImages", maxCount: 10 },
    { name: "propertyImages[]", maxCount: 10 },
  ]),
  submitPropertySelling
);



export default propertySellingRouter;
