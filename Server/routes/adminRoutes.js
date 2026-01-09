import express from 'express';

import { adminLogin, createContact, createProject, deleteProject, getContacts, updateProject } from '../controllers/adminController.js';
import { adminAuth } from '../middlewares/adminMiddleware.js';

const adminRouter = express.Router();


//admin auth

adminRouter.post('/login', adminLogin);

// contact
adminRouter.post('/contact/create', createContact);
adminRouter.get('/contacts', getContacts);



//projects
adminRouter.post("/project/create", createProject);
adminRouter.delete("/project/delete/:projectId", deleteProject);
adminRouter.put("/project/update/:projectId", updateProject);

export default adminRouter;