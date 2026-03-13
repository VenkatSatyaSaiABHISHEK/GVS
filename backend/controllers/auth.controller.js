import prisma from "../db/db.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  generateToken,
  generateRefreshToken,
} from "../utils/generateTokens.js";

const setTokenCookie = (res, token, refreshToken) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 20 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const register = [
  async (req, res, next) => {
    try {
      const { email, password, role, ...otherDetails } = req.body;

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return next(createError(400, "Email is already in use."));
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const verificationToken = crypto.randomBytes(20).toString("hex");

      const savedUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          verificationToken,
          role: role || "jobSeeker",
          fullName: otherDetails.fullName || null,
          contact: otherDetails.contact || null,
        },
      });

      const { password: _, ...userDetails } = savedUser;

      res.status(201).json({
        success: true,
        message: "User successfully registered.",
        user: userDetails,
      });
    } catch (error) {
      console.error("Registration error:", error);
      try {
        await prisma.user.delete({ where: { email: req.body.email } }).catch(() => {});
      } catch (deleteError) {
        console.error("Error deleting user:", deleteError);
      }
      next(error);
    }
  },
];

export const login = [
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(createError(400, "Email and password are required"));
      }

      const trimmedEmail = email.trim();
      const user = await prisma.user.findUnique({ where: { email: trimmedEmail } });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return next(createError(401, "Invalid credentials"));
      }

      if (!process.env.JWT_ACCESS_SECRET) {
        return next(createError(500, "JWT environment variable is missing"));
      }

      const token = generateToken(user);
      const refreshToken = generateRefreshToken(user);
      setTokenCookie(res, token, refreshToken);
      console.log("login success!");

      res.status(200).json({
        success: true,
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      next(createError(500, "An unexpected error occurred during login"));
    }
  },
];

export const logout = (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  res.cookie("refreshToken", "", { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: "Logged out successfully" });
};

export const forgetPassword = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return next(createError(404, "User not found"));

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Forget password error:", error);
    next(createError(500, "FORGET_PASSWORD: Internal Server Error"));
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: "Password has been successfully reset." });
  } catch (error) {
    console.error("Reset password error:", error);
    next(createError(500, "RESET_PASSWORD: Internal Server Error"));
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    const user = await prisma.user.findFirst({ where: { verificationToken: token } });

    if (!user) return next(createError(400, "Invalid or expired verification token"));
    if (user.isVerified) return next(createError(400, "Email already verified"));

    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, verificationToken: null },
    });

    res.status(200).json({ success: true, message: "Email verified successfully." });
  } catch (error) {
    console.error("Email verification error:", error);
    next(createError(500, "EMAIL_VERIFICATION: Internal Server Error"));
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return next(createError(401, "Refresh token not found"));

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return next(createError(401, "User not found"));

    const newAccessToken = generateToken(user);
    const newRefreshToken = generateRefreshToken(user);
    setTokenCookie(res, newAccessToken, newRefreshToken);

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    if (error.name === "TokenExpiredError") return next(createError(401, "Refresh token expired"));
    next(createError(401, "Invalid refresh token"));
  }
};
