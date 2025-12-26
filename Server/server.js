import express from "express";
import dotenv from "dotenv";  // Fixed import syntax
import connectDB from "./configs/mongodb.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes.js";

// Initialize dotenv before using process.env
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [process.env.CLIENT_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // ✅ allow cookies / credentials to be sent
  })
);


app.use(cookieParser());

// Connect to MongoDB
await connectDB();



app.use('/api/user', userRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});