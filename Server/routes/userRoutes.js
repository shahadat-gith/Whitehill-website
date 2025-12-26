import express from 'express';

import * as userController from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authmiddleware.js';
import upload from '../configs/multer.js';

const userRouter = express.Router();

// Public routes
userRouter.post('/register', userController.registerUser);
userRouter.post('/login', userController.loginUser);

// Protected routes
userRouter.get('/profile', authMiddleware, userController.getUserProfile);
userRouter.post(
  "/kyc",
  authMiddleware,
  upload.fields([
    { name: "aadharFront", maxCount: 1 },
    { name: "aadharBack", maxCount: 1 },
    { name: "panFront", maxCount: 1 },
  ]),
  userController.updateKYC
);

userRouter.post("/update-bank", authMiddleware, userController.updateBankDetails);


export default userRouter;
