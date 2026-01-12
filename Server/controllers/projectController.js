import Project from "../models/project.js";

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
