import express from "express";
import upload from "../configs/multer.js";

import { createProject, getAllProjects, getProjectById } from "../controllers/projectController.js";


const projectRouter = express.Router();

projectRouter.post("/create-project", upload.array("images", 10), createProject);
projectRouter.get("/get-project/:id", getProjectById);
projectRouter.get("/projects", getAllProjects);

export default projectRouter;