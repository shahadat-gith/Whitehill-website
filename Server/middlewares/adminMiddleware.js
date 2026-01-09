import jwt from "jsonwebtoken";

export const adminAuth = async (req, res, next) => {
  try {
    // 1️⃣ Get Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No token provided" });
    }

    // 2️⃣ Extract token
    const token = authHeader.split(" ")[1];

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
    if(!decoded || !decoded.key){
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: Invalid token" });
    }
    if(decoded.key === process.env.ADMIN_KEY){
      next();
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: Invalid admin key" });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};
