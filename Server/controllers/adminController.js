import jwt from "jsonwebtoken";
import { uploadToCloudinary } from "../configs/cloudinary.js";
import Contact from "../models/contact.js";
import Project from "../models/project.js";



//auth 

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (email === adminEmail && password === adminPassword) {
            const token = jwt.sign(
                { key: process.env.ADMIN_KEY },
                process.env.ADMIN_JWT_SECRET
            );

            return res.status(200).json({ success: true, message: "Login successful", token });
        } else {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};



// contact
export const createContact = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        if (!name || !email || !phone || !message) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const newContact = new Contact({
            name,
            email,
            phone,
            message
        });

        await newContact.save();
        res.status(201).json({
            success: true,
            message: "Contact created successfully",
            contact: newContact
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating contact", error: error.message });
    }
};

export const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Contacts retrieved successfully",
            contacts,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error retrieving contacts", error: error.message });
    }
};




//Projects 

export const createProject = async (req, res) => {
    try {
        const {
            category,
            name,
            type,
            city,
            state,
            stage,
            targetHold,
            minCommitment,
            targetReturn,
            risk,
            description,
            rera,
        } = req.body;

        /* ================= BASIC VALIDATION ================= */
        if (
            !category ||
            !name ||
            !type ||
            !city ||
            !state ||
            !stage ||
            !targetHold ||
            !minCommitment ||
            !targetReturn ||
            !risk ||
            !description
        ) {
            return res.status(400).json({
                message: "All required fields must be provided",
            });
        }

        /* ================= CATEGORY VALIDATION ================= */
        if (category === "real_estate" && !rera) {
            return res.status(400).json({
                message: "RERA number is required for real estate projects",
            });
        }

        if (category === "startup" && rera) {
            return res.status(400).json({
                message: "RERA is not applicable for startup projects",
            });
        }

        /* ================= IMAGE UPLOAD ================= */
        let images = [];

        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map((file) =>
                uploadToCloudinary(file.buffer, "projects")
            );

            const uploadResults = await Promise.all(uploadPromises);

            images = uploadResults.map((img) => ({
                url: img.url,
                public_id: img.public_id,
            }));
        }

        const highlights = req.body.highlights
            ? JSON.parse(req.body.highlights)
            : [];


        /* ================= CREATE PROJECT ================= */
        const project = await Project.create({
            category,
            name,
            type,
            city,
            state,
            rera: rera || null,
            stage,
            targetHold,
            minCommitment,
            targetReturn,
            risk,
            description,
            images,
            highlights,
        });

        return res.status(201).json({
            success: true,
            message: "Project created successfully",
            project,
        });
    } catch (error) {
        console.error("Create Project Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create project",
            error: error.message,
        });
    }
};

export const updateProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const updateData = req.body;
        const project = await Project.findByIdAndUpdate(projectId, updateData, { new: true });

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }
        return res.status(200).json({ success: true, message: "Project updated successfully", project });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error updating project", error: error.message });
    }
};

export const deleteProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await Project.findByIdAndDelete(projectId);

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }   
        return res.status(200).json({ success: true, message: "Project deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Error deleting project", error: error.message });
    }
};




