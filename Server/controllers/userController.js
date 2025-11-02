import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  const { fullName, email, password, phone } = req.body; 

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      fullName,
      email,
      phone,
      password: hashedPassword,
    });

    await newUser.save();

   
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

   
    res.cookie("token", token, {
      httpOnly: true,        
      secure: process.env.NODE_ENV === "production", 
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",    
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });


    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });

  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const loginUser = async (req, res) => {
  const { email, phone, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Store token securely in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Success response (no token exposure)
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user
    });

  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id; 
    const user = await User.findById(userId).select("-password");
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });
  res.status(200).json({ success: true, message: "User logged out successfully" });
};