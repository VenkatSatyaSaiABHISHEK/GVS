import fs from "fs/promises";
import prisma from "../../db/db.js";
import { createError } from "../../utils/error.js";
import { upload } from "../../config/multer.js";
import { uploadToCloudinary, isCloudinaryConfigured } from "../../config/cloudinary.js";

export const getUserProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.userId },
      include: {
        projects: true,
        experience: true,
        education: true,
        bookmarkedJobs: { include: { job: true } },
      },
    });

    if (!user) return next(createError(404, "User not found!"));

    const { password, ...userWithoutPassword } = user;
    // Transform bookmarkedJobs to match old format
    userWithoutPassword.bookmarkedJobs = user.bookmarkedJobs.map((bj) => bj.job);

    res.status(200).json({
      success: true,
      message: "User profile fetched successfully!",
      user: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

export const fetchCurrentUser = async (req, res, next) => {
  try {
    if (!req.user) return next(createError(401, "User not authenticated"));

    const userId = req.user.id;
    if (!userId) return next(createError(401, "Invalid user data"));

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        projects: true,
        experience: true,
        education: true,
        bookmarkedJobs: { include: { job: true } },
      },
    });

    if (!user) return next(createError(404, "User not found"));

    const { password, ...userWithoutPassword } = user;
    userWithoutPassword.bookmarkedJobs = user.bookmarkedJobs.map((bj) => bj.job);

    res.status(200).json({
      success: true,
      message: "Current user data fetched successfully!",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error fetching current user:", error);
    next(createError(500, "Error fetching user data"));
  }
};

export const updateUserAuth = async (req, res, next) => {
  try {
    const updateData = {};
    if (req.body.email) updateData.email = req.body.email;
    if (req.body.isVerified !== undefined) updateData.isVerified = req.body.isVerified;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      include: {
        projects: true,
        experience: true,
        education: true,
        bookmarkedJobs: { include: { job: true } },
      },
    });

    const { password, ...userWithoutPassword } = user;
    userWithoutPassword.bookmarkedJobs = user.bookmarkedJobs.map((bj) => bj.job);

    res.status(200).json({
      success: true,
      message: "User Auth updated successfully!",
      user: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const updateData = {};
    const allowedFields = [
      "profilePic", "fullName", "bio", "contact", "contactEmail",
      "designation", "address", "skills", "profileLinks", "yoe",
      // Teacher-specific
      "primarySubject", "secondarySubjects", "city", "state",
      "qualification", "hourlyRate", "availableForHire", "specializations",
      "languages", "teachingMode", "achievements",
      // School-specific
      "institutionType", "boardAffiliation", "yearEstablished",
      "institutionSize", "hrContactPerson", "whatsapp", "facilities",
      "subjectsHiring", "requiredQualifications", "minimumExperience",
      "currentlyHiring", "schoolRegistrationNumber",
      // Parent-specific
      "childGrade", "childName", "preferredSubjects", "preferredTeachingMode",
    ];

    // Fields that must be String[] in Prisma schema
    const arrayFields = [
      "secondarySubjects", "specializations", "languages", "achievements",
      "facilities", "subjectsHiring", "preferredSubjects",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        let value = req.body[field];
        // Convert comma-separated strings to arrays for String[] fields
        if (arrayFields.includes(field) && typeof value === "string") {
          value = value.split(",").map((s) => s.trim()).filter(Boolean);
        }
        updateData[field] = value;
      }
    }

    // Handle password change
    if (req.body.password) {
      const bcryptModule = await import("bcryptjs");
      const bcrypt = bcryptModule.default || bcryptModule;
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(req.body.password, salt);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        projects: true,
        experience: true,
        education: true,
        bookmarkedJobs: { include: { job: true } },
      },
    });

    const { password, ...userWithoutPassword } = user;
    userWithoutPassword.bookmarkedJobs = user.bookmarkedJobs.map((bj) => bj.job);

    res.status(200).json({
      success: true,
      message: "User profile updated successfully!",
      updatedUser: userWithoutPassword,
    });
  } catch (error) {
    console.log("Error updating profile", error);
    next(error);
  }
};

export const updateProfilePic = [
  upload.single("profilePic"),
  async (req, res, next) => {
    try {
      if (!req.file) return next(createError(400, "No file uploaded"));

      const user = await prisma.user.findUnique({ where: { id: req.user.id } });
      if (!user) return next(createError(404, "User not found!"));

      let profilePicUrl;
      let shouldDeleteTempFile = false;

      if (isCloudinaryConfigured) {
        profilePicUrl = await uploadToCloudinary(req.file);
        shouldDeleteTempFile = true;
      } else {
        profilePicUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
      }

      await prisma.user.update({
        where: { id: req.user.id },
        data: { profilePic: profilePicUrl },
      });

      if (shouldDeleteTempFile) {
        await fs.unlink(req.file.path);
      }

      res.status(200).json({
        success: true,
        message: isCloudinaryConfigured
          ? "Profile picture updated successfully!"
          : "Profile picture uploaded locally (Cloudinary not configured).",
        profilePic: profilePicUrl,
      });
    } catch (error) {
      if (req.file) await fs.unlink(req.file.path).catch(console.error);
      next(error);
    }
  },
];

export const deleteUserAccount = async (req, res, next) => {
  try {
    await prisma.user.delete({ where: { id: req.user.id } });
    res.status(200).json({ success: true, message: "User account deleted successfully." });
  } catch (error) {
    if (error.code === "P2025") return next(createError(404, "User not found!"));
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return next(createError(404, "User not found!"));

    const { currentPassword, newPassword } = req.body;
    const bcryptModule = await import("bcryptjs");
    const bcrypt = bcryptModule.default || bcryptModule;

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return next(createError(400, "Current password is incorrect"));

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword },
    });

    res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
};

export const toggleBookmarkJob = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const jobId = req.params.jobId;

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) return next(createError(404, "Job not found!"));

    // Check if already bookmarked
    const existing = await prisma.userBookmarkedJob.findUnique({
      where: { userId_jobId: { userId, jobId } },
    });

    if (existing) {
      // Remove bookmark
      await prisma.userBookmarkedJob.delete({
        where: { userId_jobId: { userId, jobId } },
      });
    } else {
      // Add bookmark
      await prisma.userBookmarkedJob.create({
        data: { userId, jobId },
      });
    }

    const bookmarks = await prisma.userBookmarkedJob.findMany({
      where: { userId },
      include: { job: true },
    });

    res.status(200).json({
      success: true,
      message: existing ? "Job unbookmarked successfully." : "Job bookmarked successfully.",
      bookmarkedJobs: bookmarks.map((b) => b.job),
    });
  } catch (error) {
    console.error("Error in toggleBookmarkJob:", error);
    next(error);
  }
};
