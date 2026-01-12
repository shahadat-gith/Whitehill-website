import express from "express";

import { getAllProjects, getProjectById } from "../controllers/projectController.js";


const projectRouter = express.Router();

projectRouter.get("/get-project/:id", getProjectById);
projectRouter.get("/projects", getAllProjects);

export default projectRouter;