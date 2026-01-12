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
                success: false,
                message: "All required fields must be provided",
            });
        }

        /* ================= CATEGORY VALIDATION ================= */
        if (category === "real_estate" && !rera) {
            return res.status(400).json({
                success: false,
                message: "RERA number is required for real estate projects",
            });
        }

        if (category === "startup" && rera) {
            return res.status(400).json({
                success: false,
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

        /* ================= HIGHLIGHTS ================= */
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

        /* ================= FIND PROJECT ================= */
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

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
        } = req.body || {};


        /* ================= CATEGORY VALIDATION ================= */
        const finalCategory = category || project.category;

        if (finalCategory === "real_estate" && !rera && !project.rera) {
            return res.status(400).json({
                success: false,
                message: "RERA number is required for real estate projects",
            });
        }

        if (finalCategory === "startup" && rera) {
            return res.status(400).json({
                success: false,
                message: "RERA is not applicable for startup projects",
            });
        }

        /* ================= UPDATE FIELDS ================= */
        const updatableFields = {
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
        };

        Object.keys(updatableFields).forEach((key) => {
            if (updatableFields[key] !== undefined) {
                project[key] = updatableFields[key];
            }
        });

        /* ================= RERA ================= */
        if (finalCategory === "real_estate") {
            project.rera = rera ?? project.rera;
        } else {
            project.rera = null;
        }

        /* ================= HIGHLIGHTS ================= */
        if (req.body.highlights) {
            project.highlights = JSON.parse(req.body.highlights);
        }

        /* ================= SAVE ================= */
        await project.save();

        return res.status(200).json({
            success: true,
            message: "Project updated successfully",
            project,
        });
    } catch (error) {
        console.error("Update Project Error:", error);

        return res.status(500).json({
            success: false,
            message: "Error updating project",
            error: error.message,
        });
    }
};


export const uploadProjectImages = async (req, res) => {
    try {
        const { projectId } = req.body;

        if (!projectId) {
            return res.status(400).json({
                success: false,
                message: "Project ID is required",
            });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one image file is required",
            });
        }

        /* ================= FIND PROJECT ================= */
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        /* ================= UPLOAD IMAGES ================= */
        const uploadPromises = req.files.map((file) =>
            uploadToCloudinary(file.buffer, "projects")
        );

        const uploadedImages = await Promise.all(uploadPromises);

        const newImages = uploadedImages.map((img) => ({
            url: img.url,
            public_id: img.public_id,
        }));

        /* ================= APPEND IMAGES ================= */
        project.images.push(...newImages);

        /* ================= SAVE ================= */
        await project.save();

        return res.status(200).json({
            success: true,
            message: "Images uploaded successfully",
            images: newImages,
            project,
        });
    } catch (error) {
        console.error("Upload Project Images Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to upload project images",
            error: error.message,
        });
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




