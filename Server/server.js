import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config(); 

import connectDB from "./configs/mongodb.js";
import "./configs/cloudinary.js"; 
import userRouter from "./routes/userRoutes.js";
import { connectToCloudinary } from "./configs/cloudinary.js";
import transactionRouter from "./routes/transactionRoutes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cors({origin: [process.env.CLIENT_URL],credentials: true,}));

app.use(cookieParser());

// Connect to MongoDB
await connectDB();
await connectToCloudinary()

app.use("/api/user", userRouter);
app.use("/api/transaction", transactionRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
