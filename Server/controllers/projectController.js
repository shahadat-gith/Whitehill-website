import Project from "../models/projects.js";
import { uploadToCloudinary } from "../configs/cloudinary.js";

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


export const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find({ isActive: true }).sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            projects,
        });
    } catch (error) {
        console.error("Get All Projects Error:", error);
        return res.status(500).json({success: false,message: "Failed to fetch projects",error: error.message,});
    }
};

export const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }
        return res.status(200).json({
            success: true,
            project,
        });
    } catch (error) {
        console.error("Get Project By ID Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch project",
            error: error.message,
        });
    }
}
