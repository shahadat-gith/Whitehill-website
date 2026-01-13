import express from 'express';
import upload from "../configs/multer.js";

import { adminLogin, createContact, createProject, deleteProject, getContacts, getInvestments, updateInvestmentStatus, updateProject, uploadProjectImages, getInvestmentById } from '../controllers/adminController.js';
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

adminRouter.post("/investment/status/:investmentId", updateInvestmentStatus);
adminRouter.get("/investment/all", getInvestments)
adminRouter.post("/investment/details", getInvestmentById);


export default adminRouter;