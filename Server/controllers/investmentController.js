import Investment from "../models/investment.js";

export const getUserInvestments = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }

        const investments = await Investment.find({ user: userId })
            .populate({
                path: "project",
                select: "name category city state risk targetReturn images",
            })
            .populate({
                path: "transaction",
                select: "amount date razorpay_payment_id",
            })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: investments.length,
            investments,
        });
    } catch (error) {
        console.error("Get user investments error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch investments",
        });
    }
};
