import express from "express";
import upload from "../configs/multer.js";

// Import controllers from admin folder
import { adminLogin } from "../controllers/admin/authController.js";
import { createProject, updateProject, uploadProjectImages, deleteProject } from "../controllers/admin/projectController.js";
import { createQuery, getQueries, replyToQuery } from "../controllers/admin/queryController.js";
import { updateInvestmentStatus, getInvestments, getInvestmentById } from "../controllers/admin/investmentController.js";
import { getPaymentHistory, getPaymentDetails } from "../controllers/admin/paymentController.js";
import { getUsers, getUserById, verifyKYC } from "../controllers/admin/userController.js";
import { getDashboardData } from "../controllers/admin/dashboardController.js";
import { verifyFunding, requestAdditionalDocuments, getFundingById, getAllFundingsForAdmin } from "../controllers/admin/fundingController.js";

const adminRouter = express.Router();

/* ================= ADMIN AUTH ================= */
adminRouter.post("/login", adminLogin);

/* ================= PROJECTS ================= */
adminRouter.post(
  "/project/create",
  upload.array("images", 10),
  createProject
);

adminRouter.delete(
  "/project/delete/:projectId",
  deleteProject
);

adminRouter.put(
  "/project/update/:projectId",
  upload.none(),
  updateProject
);

adminRouter.post(
  "/project/images/upload",
  upload.array("images", 10),
  uploadProjectImages
);

/* ================= INVESTMENTS ================= */
adminRouter.post(
  "/investment/update-status",
  updateInvestmentStatus
);

adminRouter.get(
  "/investment/all",
  getInvestments
);

adminRouter.post(
  "/investment/details",
  getInvestmentById
);

/* ================= PAYMENT ================= */
adminRouter.get(
  "/payment-gateway/history",
  getPaymentHistory
);

adminRouter.get(
  "/payment-gateway/details",
  getPaymentDetails
);

/* ================= USERS ================= */
adminRouter.get(
  "/user/all",
  getUsers
);

adminRouter.post(
  "/user/single",
  getUserById
);

adminRouter.post(
  "/user/kyc/verify",
  verifyKYC
);

/* ================= QUERIES ================= */
adminRouter.post(
  "/query/create",
  createQuery
);

adminRouter.get(
  "/query/all",
  getQueries
);

adminRouter.post(
  "/query/reply",
  replyToQuery
);

/* ================= DASHBOARD ================= */
adminRouter.get(
  "/dashboard/stats",
  getDashboardData
);

/* ================= FUNDING ================= */
adminRouter.post(
  "/funding/verify",
  verifyFunding
);

adminRouter.post(
  "/funding/request-documents",
  requestAdditionalDocuments
);

adminRouter.get(
  "/funding/all",
  getAllFundingsForAdmin
);

adminRouter.get(
  "/funding/:id",
  getFundingById
);

export default adminRouter;