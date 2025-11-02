import express from 'express';

import * as userController from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authmiddleware.js';

const userRouter = express.Router();

// Public routes
userRouter.post('/register', userController.registerUser);
userRouter.post('/login', userController.loginUser);

// Protected routes
userRouter.get('/profile', authMiddleware, userController.getUserProfile);
userRouter.post('/logout', authMiddleware, userController.logoutUser);

export default userRouter;
