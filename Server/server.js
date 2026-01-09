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
import projectRouter from "./routes/projectRoutes.js";
import investmentRouter from "./routes/investmentRoutes.js";
import adminRouter from "./routes/adminRoutes.js";

const app = express();

// Middleware
app.use(express.json());


const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
];


app.use(cors({
  origin: "*",
}));


app.use(cookieParser());

// Connect to MongoDB
await connectDB();
await connectToCloudinary()

app.use("/api/user", userRouter);
app.use("/api/project", projectRouter);
app.use("/api/transaction", transactionRouter);
app.use("/api/investment", investmentRouter);
app.use("/api/admin", adminRouter)


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
