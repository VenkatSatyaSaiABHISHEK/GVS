import prisma from "../../db/db.js";
import { ApiError } from "../../utils/error.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [totalTeachers, totalSchools, totalParents, totalJobs, totalApplications, activeJobs] =
      await Promise.all([
        prisma.user.count({ where: { role: "jobSeeker" } }),
        prisma.user.count({ where: { role: "recruiter" } }),
        prisma.user.count({ where: { role: "parent" } }),
        prisma.job.count(),
        prisma.application.count(),
        prisma.job.count({ where: { status: "open" } }),
      ]);

    // Application stats by status
    const applicationStatsRaw = await prisma.application.groupBy({
      by: ["status"],
      _count: true,
    });
    const applicationStats = applicationStatsRaw.map((s) => ({
      _id: s.status,
      count: s._count,
    }));

    // Monthly growth
    const [teachersThisMonth, teachersLastMonth, schoolsThisMonth, jobsThisMonth] =
      await Promise.all([
        prisma.user.count({ where: { role: "jobSeeker", createdAt: { gte: startOfMonth } } }),
        prisma.user.count({
          where: { role: "jobSeeker", createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
        }),
        prisma.user.count({ where: { role: "recruiter", createdAt: { gte: startOfMonth } } }),
        prisma.job.count({ where: { postedAt: { gte: startOfMonth } } }),
      ]);

    // Recent activities
    const [recentTeachers, recentJobs, recentApplications] = await Promise.all([
      prisma.user.findMany({
        where: { role: "jobSeeker" },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, fullName: true, email: true, createdAt: true, isVerified: true },
      }),
      prisma.job.findMany({
        orderBy: { postedAt: "desc" },
        take: 5,
        select: { id: true, title: true, postedAt: true, status: true, companyName: true },
      }),
      prisma.application.findMany({
        orderBy: { appliedAt: "desc" },
        take: 5,
        include: {
          applicant: { select: { fullName: true } },
          job: { select: { title: true } },
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      message: "Dashboard stats fetched successfully",
      data: {
        totalStats: { totalTeachers, totalSchools, totalParents, totalJobs, totalApplications, activeJobs },
        applicationStats,
        monthlyGrowth: {
          teachersThisMonth,
          teachersLastMonth,
          schoolsThisMonth,
          jobsThisMonth,
          teacherGrowthRate:
            teachersLastMonth > 0
              ? (((teachersThisMonth - teachersLastMonth) / teachersLastMonth) * 100).toFixed(1)
              : 0,
        },
        recentActivities: { recentTeachers, recentJobs, recentApplications },
        trends: { monthlyTrends: [], jobTrends: [] },
        topSchools: [],
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getPlatformAnalytics = async (req, res, next) => {
  try {
    const { period = "30d" } = req.query;
    const now = new Date();
    let dateFilter;

    switch (period) {
      case "7d": dateFilter = new Date(now.getTime() - 7 * 86400000); break;
      case "30d": dateFilter = new Date(now.getTime() - 30 * 86400000); break;
      case "90d": dateFilter = new Date(now.getTime() - 90 * 86400000); break;
      case "1y": dateFilter = new Date(now.getTime() - 365 * 86400000); break;
      default: dateFilter = new Date(now.getTime() - 30 * 86400000);
    }

    const successRate = await prisma.application.groupBy({
      by: ["status"],
      _count: true,
    });

    res.status(200).json({
      success: true,
      message: "Platform analytics fetched successfully",
      data: {
        userAnalytics: [],
        successRate: successRate.map((s) => ({ _id: s.status, count: s._count })),
        popularSubjects: [],
        geographicData: [],
        period,
      },
    });
  } catch (error) {
    next(error);
  }
};
