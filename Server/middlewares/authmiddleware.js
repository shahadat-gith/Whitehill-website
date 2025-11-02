import jwt from "jsonwebtoken";
import User from '../models/user.js'

export const authMiddleware = async (req, res, next) => {
  try {
    // 1️⃣ Get token from cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ Fetch user from DB (excluding password)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized: User not found" });
    }

    // 4️⃣ Attach user to request
    req.user = user;

    // 5️⃣ Continue to protected route
    next();

  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
