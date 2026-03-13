import prisma from "../../db/db.js";
import bcrypt from "bcryptjs";
import { generateTokens } from "../../utils/generateTokens.js";
import { ApiError } from "../../utils/error.js";

export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return next(new ApiError(400, "Email and password are required"));

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin || !admin.isActive) return next(new ApiError(401, "Invalid credentials"));

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) return next(new ApiError(401, "Invalid credentials"));

    await prisma.admin.update({
      where: { id: admin.id },
      data: { lastLogin: new Date() },
    });

    const { accessToken, refreshToken } = generateTokens(admin.id, "admin");

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _, ...adminData } = admin;
    res.status(200).json({
      success: true,
      message: "Admin login successful",
      admin: adminData,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const adminLogout = async (req, res, next) => {
  try {
    res.clearCookie("refreshToken");
    res.status(200).json({ success: true, message: "Admin logout successful" });
  } catch (error) {
    next(error);
  }
};

export const getCurrentAdmin = async (req, res, next) => {
  try {
    const admin = await prisma.admin.findUnique({ where: { id: req.admin.id } });
    if (!admin) return next(new ApiError(404, "Admin not found"));

    const { password: _, ...adminData } = admin;
    res.status(200).json({ success: true, message: "Admin data fetched successfully", admin: adminData });
  } catch (error) {
    next(error);
  }
};

export const createAdmin = async (req, res, next) => {
  try {
    const { name, email, password, role, permissions } = req.body;

    const currentAdmin = await prisma.admin.findUnique({ where: { id: req.admin.id } });
    if (currentAdmin.role !== "super_admin") {
      return next(new ApiError(403, "Only super admins can create new admins"));
    }

    const existingAdmin = await prisma.admin.findUnique({ where: { email } });
    if (existingAdmin) return next(new ApiError(400, "Admin with this email already exists"));

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = await prisma.admin.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "moderator",
        permissions: permissions || {
          canManageUsers: true,
          canManageJobs: true,
          canManagePayments: false,
          canManageSettings: false,
          canViewAnalytics: true,
        },
      },
    });

    const { password: _, ...adminData } = newAdmin;
    res.status(201).json({ success: true, message: "Admin created successfully", admin: adminData });
  } catch (error) {
    next(error);
  }
};

export const updateAdminProfile = async (req, res, next) => {
  try {
    const { name, email, fullName, phone, contact, address, city, state, bio } = req.body;
    const adminId = req.admin.id;

    const updateData = {};
    if (name || fullName) updateData.name = name || fullName;
    if (email) updateData.email = email;
    if (phone || contact) updateData.phone = phone || contact;
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (bio !== undefined) updateData.bio = bio;

    const admin = await prisma.admin.update({
      where: { id: adminId },
      data: updateData,
    });

    const { password: _, ...adminData } = admin;
    res.status(200).json({
      success: true,
      message: "Admin profile updated successfully",
      admin: adminData,
    });
  } catch (error) {
    next(error);
  }
};
