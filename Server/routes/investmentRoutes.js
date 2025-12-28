// routes/investmentRoutes.js
import express from "express";
import { getUserInvestments } from "../controllers/investmentController.js";
import { authMiddleware } from "../middlewares/authmiddleware.js";

const investmentRouter = express.Router();

investmentRouter.get("/user/:userId", authMiddleware, getUserInvestments);

export default investmentRouter;
