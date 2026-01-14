import express from 'express';
import upload from "../configs/multer.js";

import { adminLogin, createContact, createProject, deleteProject, getContacts, getInvestments, updateInvestmentStatus, updateProject, uploadProjectImages, getInvestmentById, getPaymentHistory, getPaymentDetails } from '../controllers/adminController.js';
import { adminAuth } from '../middlewares/adminMiddleware.js';

const adminRouter = express.Router();


//admin auth

adminRouter.post('/login', adminLogin);

// contact
adminRouter.post('/contact/create', createContact);
adminRouter.get('/contacts', getContacts);



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


export default adminRouter;