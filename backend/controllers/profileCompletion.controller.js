import prisma from "../db/db.js";
import { createError } from "../utils/error.js";
import { validateProfileFields, getProfileCompletionPercentage } from "../middleware/profileCompletion.middleware.js";

export const getProfileStatus = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return next(createError(404, "User not found"));

    const validation = validateProfileFields(user);
    const completionPercentage = getProfileCompletionPercentage(user);

    res.status(200).json({
      success: true,
      profileCompleted: user.profileCompleted,
      completionPercentage,
      missingFields: validation.missingFields,
      role: user.role,
    });
  } catch (error) {
    console.error("Get profile status error:", error);
    next(error);
  }
};

export const completeProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const profileData = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return next(createError(404, "User not found"));

    // Build update data, filtering out undefined/null
    const updateData = {};
    const allowedFields = [
      "fullName", "bio", "contact", "whatsappNumber", "contactEmail",
      "designation", "address", "aadhaarNumber", "skills", "profileLinks",
      "primarySubject", "secondarySubjects", "city", "state", "qualification",
      "hourlyRate", "availableForHire", "specializations", "languages",
      "teachingMode", "achievements", "childGrade", "childName",
      "preferredSubjects", "preferredTeachingMode", "institutionType",
      "boardAffiliation", "yearEstablished", "institutionSize",
      "hrContactPerson", "whatsapp", "facilities", "subjectsHiring",
      "requiredQualifications", "minimumExperience", "currentlyHiring",
      "schoolRegistrationNumber", "principalName", "profilePic", "yoe",
    ];

    for (const key of allowedFields) {
      if (profileData[key] !== undefined && profileData[key] !== null) {
        updateData[key] = profileData[key];
      }
    }

    // Merge with existing data for validation
    const mergedUser = { ...user, ...updateData };
    const validation = validateProfileFields(mergedUser);

    if (validation.isComplete) {
      updateData.profileCompleted = true;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    const completionPercentage = getProfileCompletionPercentage(updatedUser);

    res.status(200).json({
      success: true,
      message: validation.isComplete
        ? "Profile completed successfully!"
        : "Profile updated. Please complete remaining fields.",
      profileCompleted: updatedUser.profileCompleted,
      completionPercentage,
      missingFields: validation.missingFields,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        fullName: updatedUser.fullName,
        profilePic: updatedUser.profilePic,
        profileCompleted: updatedUser.profileCompleted,
      },
    });
  } catch (error) {
    console.error("Complete profile error:", error);
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        education: true,
        experience: true,
        projects: true,
      },
    });

    if (!user) return next(createError(404, "User not found"));

    const { password, ...userWithoutPassword } = user;
    const completionPercentage = getProfileCompletionPercentage(user);

    res.status(200).json({
      success: true,
      user: userWithoutPassword,
      completionPercentage,
      profileCompleted: user.profileCompleted,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const updates = { ...req.body };

    // Remove sensitive fields
    delete updates.password;
    delete updates.email;
    delete updates.id;
    delete updates.role;

    const user = await prisma.user.update({
      where: { id: userId },
      data: updates,
      include: {
        education: true,
        experience: true,
        projects: true,
      },
    });

    if (!user) return next(createError(404, "User not found"));

    const validation = validateProfileFields(user);
    if (validation.isComplete && !user.profileCompleted) {
      await prisma.user.update({
        where: { id: userId },
        data: { profileCompleted: true },
      });
    }

    const { password: _, ...userWithoutPassword } = user;
    const completionPercentage = getProfileCompletionPercentage(user);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: userWithoutPassword,
      profileCompleted: user.profileCompleted,
      completionPercentage,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    next(error);
  }
};

export const getRequiredFields = async (req, res, next) => {
  try {
    const { role } = req.user;

    const commonFields = [
      { name: "fullName", label: "Full Name", type: "text", required: true },
      { name: "contact", label: "Phone Number", type: "tel", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "address", label: "Address", type: "text", required: true },
      { name: "city", label: "City", type: "text", required: true },
      { name: "state", label: "State", type: "text", required: true },
    ];

    const roleSpecificFields = {
      jobSeeker: [
        { name: "whatsappNumber", label: "WhatsApp Number", type: "tel", required: true },
        { name: "aadhaarNumber", label: "Aadhaar Number", type: "text", required: true },
        { name: "primarySubject", label: "Primary Subject", type: "text", required: true },
        { name: "secondarySubjects", label: "Secondary Subjects", type: "array", required: false },
        { name: "qualification", label: "Qualification", type: "text", required: true },
        { name: "yoe", label: "Years of Experience", type: "text", required: true },
        { name: "teachingMode", label: "Teaching Mode", type: "select", options: ["Online", "Offline", "Hybrid"], required: true },
        { name: "bio", label: "About / Bio", type: "textarea", required: true },
        { name: "profilePic", label: "Profile Image", type: "file", required: false },
        { name: "availableForHire", label: "Available for Tuition", type: "boolean", required: false },
      ],
      parent: [
        { name: "whatsappNumber", label: "WhatsApp Number", type: "tel", required: true },
        { name: "aadhaarNumber", label: "Aadhaar Number", type: "text", required: true },
        { name: "childName", label: "Child Name", type: "text", required: true },
        { name: "childGrade", label: "Class / Grade", type: "text", required: true },
        { name: "preferredSubjects", label: "Preferred Subjects", type: "array", required: true },
        { name: "preferredTeachingMode", label: "Preferred Teaching Mode", type: "select", options: ["Online", "Offline", "Hybrid"], required: true },
        { name: "profilePic", label: "Profile Image", type: "file", required: false },
      ],
      recruiter: [
        { name: "fullName", label: "School Name", type: "text", required: true },
        { name: "contact", label: "School Phone Number", type: "tel", required: true },
        { name: "address", label: "School Address", type: "text", required: true },
        { name: "schoolRegistrationNumber", label: "School Registration Number", type: "text", required: true },
        { name: "principalName", label: "Principal Name", type: "text", required: true },
        { name: "bio", label: "Description about School", type: "textarea", required: true },
        { name: "profilePic", label: "School Logo", type: "file", required: false },
      ],
    };

    const mergedFields = [...commonFields, ...(roleSpecificFields[role] || [])];
    const fieldsByName = new Map();

    for (const field of mergedFields) {
      if (field?.name) {
        fieldsByName.set(field.name, field);
      }
    }

    const fields = Array.from(fieldsByName.values());

    res.status(200).json({ success: true, role, fields });
  } catch (error) {
    console.error("Get required fields error:", error);
    next(error);
  }
};

export const getProfileStrength = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return next(createError(404, "User not found"));

    const strengthFields = [
      "fullName",
      "bio",
      "qualification",
      "primarySubject",
      "yoe",
      "city",
      "profilePic",
    ];

    const missingItems = [];
    if (!user.resume) missingItems.push("Resume");
    if (!user.profileLinks || !user.profileLinks.youtube) missingItems.push("Teaching demo video");
    if (!Array.isArray(user.achievements) || user.achievements.length === 0) missingItems.push("Certifications");
    if (!Array.isArray(user.experience) || user.experience.length === 0) missingItems.push("Experience details");

    const completed = strengthFields.filter((field) => Boolean(user[field])).length;
    const baseStrength = Math.round((completed / strengthFields.length) * 70);
    const completionBonus = Math.round(((4 - missingItems.length) / 4) * 30);
    const strength = Math.min(100, baseStrength + completionBonus);

    res.status(200).json({
      success: true,
      strength,
      missingItems,
      completedFields: completed,
      totalFields: strengthFields.length,
    });
  } catch (error) {
    next(error);
  }
};
