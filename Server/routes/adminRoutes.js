import express from 'express';
import upload from "../configs/multer.js";

import { adminLogin, createProject, deleteProject, getInvestments, updateInvestmentStatus, updateProject, uploadProjectImages, getInvestmentById, getPaymentHistory, getPaymentDetails, verifyKYC, getUsers, getUserById, createQuery, getQueries, replyToQuery, getDashboardData } from '../controllers/adminController.js';
import { adminAuth } from '../middlewares/adminMiddleware.js';

const adminRouter = express.Router();


//admin auth

adminRouter.post('/login', adminLogin);


//projects
adminRouter.post("/project/create", upload.array("images", 10), createProject);
adminRouter.delete("/project/delete/:projectId", deleteProject);
adminRouter.put("/project/update/:projectId", upload.none(), updateProject);
adminRouter.post(
  "/project/images/upload",
  upload.array("images", 10),
  uploadProjectImages
);

//investments
adminRouter.post("/investment/update-status", updateInvestmentStatus);
adminRouter.get("/investment/all", getInvestments)
adminRouter.post("/investment/details", getInvestmentById);

//payment gateway
adminRouter.get("/payment-gateway/history", getPaymentHistory)
adminRouter.get("/payment-gateway/details", getPaymentDetails)


//users
adminRouter.get("/user/all", getUsers)
adminRouter.post("/user/single", getUserById)
adminRouter.post('/user/kyc/verify', verifyKYC);


//queries
adminRouter.post("/query/create", createQuery);
adminRouter.get("/query/all", getQueries);
adminRouter.post("/query/reply", replyToQuery)

//dashboard stats
adminRouter.get("/dashboard/stats", getDashboardData);

export default adminRouter;