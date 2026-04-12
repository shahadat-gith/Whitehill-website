import Project from "../../models/project.js";
import User from "../../models/user.js";
import Investment from "../../models/investment.js";
import Query from "../../models/query.js";

export const getDashboardData = async (req, res) => {
  try {
    const [
      recentQueries,
      recentUsers,
      recentInvestments,
      statsAgg,
    ] = await Promise.all([
      // Used in Home.jsx -> Recent Queries table
      Query.find()
        .sort({ createdAt: -1 })
        .limit(20)
        .select("name email phone message reply createdAt")
        .lean(),

      // Used in Home.jsx -> New Users list
      User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("fullName email createdAt kyc.status")
        .lean(),

      // Used in Home.jsx -> Recent Investments table
      Investment.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("user project transaction")
        .populate({ path: "user", select: "fullName email" })
        .populate({ path: "project", select: "name category" })
        .populate({ path: "transaction", select: "amount" })
        .lean(),

      // Stats used in top cards
      Promise.all([
        Project.countDocuments(),
        Project.countDocuments({ isActive: true }),
        User.countDocuments(),
        User.countDocuments({ "kyc.status": "pending" }),
        Investment.countDocuments(),
        Investment.countDocuments({ status: "pending" }),

        // totalAmountInvested = sum of transaction.amount
        Investment.aggregate([
          {
            $lookup: {
              from: "transactions",
              localField: "transaction",
              foreignField: "_id",
              as: "tx",
            },
          },
          { $unwind: { path: "$tx", preserveNullAndEmptyArrays: true } },
          {
            $group: {
              _id: null,
              totalAmountInvested: { $sum: { $ifNull: ["$tx.amount", 0] } },
            },
          },
        ]),

        // totalDistributions = sum of user.totalDistributions
        User.aggregate([
          {
            $group: {
              _id: null,
              totalDistributions: {
                $sum: { $ifNull: ["$totalDistributions", 0] },
              },
            },
          },
        ]),
      ]),
    ]);

    const [
      totalProjects,
      activeProjects,
      totalUsers,
      kycPending,
      totalInvestments,
      pendingInvestments,
      investedAgg,
      distributionAgg,
    ] = statsAgg;

    const dashboard = {
      stats: {
        totalProjects,
        activeProjects,
        totalUsers,
        kycPending,
        totalInvestments,
        pendingInvestments,
        totalAmountInvested: investedAgg?.[0]?.totalAmountInvested || 0,
        totalDistributions: distributionAgg?.[0]?.totalDistributions || 0,
      },
      recentInvestments,
      recentUsers,
      recentQueries,
    };

    return res.status(200).json({
      success: true,
      dashboard,
    });
  } catch (error) {
    console.error("getDashboardData error:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving dashboard data",
      error: error.message,
    });
  }
};
