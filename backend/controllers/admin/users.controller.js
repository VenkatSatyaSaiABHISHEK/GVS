import prisma from "../../db/db.js";
import { ApiError } from "../../utils/error.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const {
      role, isVerified, page = 1, limit = 20, search,
      sortBy = "createdAt", sortOrder = "desc",
    } = req.query;

    const where = {};
    if (role) where.role = role;
    if (isVerified !== undefined) where.isVerified = isVerified === "true";

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { state: { contains: search, mode: "insensitive" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const orderBy = {};
    orderBy[sortBy] = sortOrder === "desc" ? "desc" : "asc";

    const [users, totalUsers] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true, email: true, fullName: true, role: true, isVerified: true,
          profilePic: true, city: true, state: true, createdAt: true,
          contact: true, qualification: true,
        },
        orderBy,
        skip,
        take: parseInt(limit),
      }),
      prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(totalUsers / parseInt(limit));

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalUsers,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserDetails = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        education: true,
        experience: true,
        projects: true,
      },
    });

    if (!user) return next(new ApiError(404, "User not found"));

    const { password: _, ...userData } = user;

    res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      data: { user: userData },
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { isVerified } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return next(new ApiError(404, "User not found"));

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { ...(isVerified !== undefined && { isVerified }) },
    });

    const { password: _, ...userData } = updated;
    res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: { user: userData },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return next(new ApiError(404, "User not found"));

    // Cascade delete handled by schema
    await prisma.user.delete({ where: { id: userId } });

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getUserStatistics = async (req, res, next) => {
  try {
    const roleStats = await prisma.user.groupBy({
      by: ["role"],
      _count: true,
    });

    res.status(200).json({
      success: true,
      message: "User statistics fetched successfully",
      data: {
        roleStats: roleStats.map((r) => ({ _id: r.role, count: r._count })),
        registrationTrends: [],
        geographicStats: [],
      },
    });
  } catch (error) {
    next(error);
  }
};
