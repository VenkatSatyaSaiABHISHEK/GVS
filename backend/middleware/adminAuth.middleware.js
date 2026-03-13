import jwt from "jsonwebtoken";
import prisma from "../db/db.js";
import { createError } from "../utils/error.js";

export const protectAdmin = async (req, res, next) => {
  let token;

  if (req.cookies.adminToken) {
    token = req.cookies.adminToken;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const admin = await prisma.admin.findUnique({
        where: { id: decoded.id },
      });

      if (!admin) {
        return next(createError(401, "Admin not found"));
      }

      // Remove password from admin object
      const { password, ...adminWithoutPassword } = admin;
      req.admin = adminWithoutPassword;
      next();
    } catch (error) {
      console.error("Admin token verification error:", error.message);
      return next(createError(401, "Not authorized, token failed"));
    }
  } else {
    return next(createError(401, "Not authorized, no token"));
  }
};

export const requireSuperAdmin = (req, res, next) => {
  if (req.admin && req.admin.role === "super_admin") {
    next();
  } else {
    return next(createError(403, "Access denied. Super admin only."));
  }
};

// Alias for backward compatibility with routes
export const adminAuth = protectAdmin;
