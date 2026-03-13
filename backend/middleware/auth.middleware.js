import jwt from "jsonwebtoken";
import prisma from "../db/db.js";
import { createError } from "../utils/error.js";

export const protect = async (req, res, next) => {
  let token;

  // Debug: log incoming cookies and auth header
  console.log(`[AUTH] ${req.method} ${req.originalUrl} | cookies: ${Object.keys(req.cookies || {}).join(',')} | authHeader: ${req.headers.authorization ? 'Bearer ...' : 'none'}`);

  if (req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user) {
        console.error("[AUTH] User not found for token ID:", decoded.id);
        return next(createError(401, "User no longer exists"));
      }

      // Remove password from user object
      const { password, ...userWithoutPassword } = user;
      req.user = userWithoutPassword;
      next();
    } catch (error) {
      console.error("[AUTH] Token verification error:", error.message);
      return next(createError(401, "Not authorized, token failed"));
    }
  } else {
    console.warn(`[AUTH] No token found | cookies present: ${JSON.stringify(Object.keys(req.cookies || {}))} | origin: ${req.headers.origin || 'none'}`);
    return next(createError(401, "Not authorized, no token"));
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        createError(
          403,
          `User role ${req.user.role} is not authorized to access this route`
        )
      );
    }
    next();
  };
};
