import prisma from "../db/db.js";
import { createError } from "../utils/error.js";
import { generateRandomCode } from "../utils/generateRandomCodes.js";

export const generateInviteCode = async (req, res, next) => {
  try {
    const { role, email } = req.body;

    const existingInvite = await prisma.inviteCode.findFirst({
      where: { email, isUsed: false },
    });

    if (existingInvite) {
      return next(createError(400, "An invite code for this email already exists."));
    }

    const code = await generateRandomCode();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.inviteCode.create({
      data: { code, role, email, expiresAt },
    });

    return res.status(201).json({ success: true, inviteCode: code, expiresAt });
  } catch (error) {
    console.log(error);
    return next(createError(500, "Failed to generate invite code."));
  }
};

export const verifyInviteCode = async (req, res, next) => {
  try {
    const { code } = req.body;

    const inviteCode = await prisma.inviteCode.findFirst({
      where: { code, isUsed: false },
    });

    if (!inviteCode) return next(createError(400, "Invalid or expired invite code."));
    if (inviteCode.expiresAt < new Date()) return next(createError(400, "Invite code has expired."));

    await prisma.inviteCode.update({
      where: { id: inviteCode.id },
      data: { isUsed: true },
    });

    return res.status(200).json({
      success: true,
      message: "Invite code verified.",
      role: inviteCode.role,
    });
  } catch (error) {
    return next(createError(500, "Failed to verify invite code."));
  }
};
