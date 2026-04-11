import express from "express";
import upload from "../configs/multer.js";

import * as adminController from "../controllers/adminController.js";

const adminRouter = express.Router();

/* ================= ADMIN AUTH ================= */
adminRouter.post("/login", adminController.adminLogin);

/* ================= PROJECTS ================= */
adminRouter.post(
  "/project/create",
  upload.array("images", 10),
  adminController.createProject
);

adminRouter.delete(
  "/project/delete/:projectId",
  adminController.deleteProject
);

adminRouter.put(
  "/project/update/:projectId",
  upload.none(),
  adminController.updateProject
);

adminRouter.post(
  "/project/images/upload",
  upload.array("images", 10),
  adminController.uploadProjectImages
);

/* ================= INVESTMENTS ================= */
adminRouter.post(
  "/investment/update-status",
  adminController.updateInvestmentStatus
);

adminRouter.get(
  "/investment/all",
  adminController.getInvestments
);

adminRouter.post(
  "/investment/details",
  adminController.getInvestmentById
);

/* ================= PAYMENT ================= */
adminRouter.get(
  "/payment-gateway/history",
  adminController.getPaymentHistory
);

adminRouter.get(
  "/payment-gateway/details",
  adminController.getPaymentDetails
);

/* ================= USERS ================= */
adminRouter.get(
  "/user/all",
  adminController.getUsers
);

adminRouter.post(
  "/user/single",
  adminController.getUserById
);

adminRouter.post(
  "/user/kyc/verify",
  adminController.verifyKYC
);

/* ================= QUERIES ================= */
adminRouter.post(
  "/query/create",
  adminController.createQuery
);

adminRouter.get(
  "/query/all",
  adminController.getQueries
);

adminRouter.post(
  "/query/reply",
  adminController.replyToQuery
);

/* ================= DASHBOARD ================= */
adminRouter.get(
  "/dashboard/stats",
  adminController.getDashboardData
);

/* ================= FUNDING ================= */
adminRouter.post(
  "/funding/verify",
  adminController.verifyFunding
);

adminRouter.post(
  "/funding/request-documents",
  adminController.requestAdditionalDocuments
);

adminRouter.get(
  "/funding/all",
  adminController.getAllFundingsForAdmin
);

adminRouter.get(
  "/funding/:id",
  adminController.getFundingById
);

export default adminRouter;