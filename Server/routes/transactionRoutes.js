import express from "express";


import { createOrder, getTransactions, verifyPayment } from "../controllers/transactionController.js";
import { authMiddleware } from "../middlewares/authmiddleware.js";

const transactionRouter = express.Router();

transactionRouter.post("/create-order", createOrder);
transactionRouter.post("/verify-payment",authMiddleware ,verifyPayment);
transactionRouter.get("/get-transactions", authMiddleware, getTransactions)

export default transactionRouter;