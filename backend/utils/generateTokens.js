import jwt from "jsonwebtoken";

export const generateToken = (user, userType = "user") => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, userType },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "30m" } // Short-lived access token
  );
};

export const generateRefreshToken = (user, userType = "user") => {
  return jwt.sign({ id: user.id, userType }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "14d",
  });
};

export const generateTokens = (userId, userType = "user") => {
  const payload = {
    id: userId,
    userType: userType // "user" or "admin"
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  });

  return { accessToken, refreshToken };
};
