import prisma from "../../db/db.js";

export const getEducations = async (req, res) => {
  try {
    const education = await prisma.education.findMany({
      where: { userId: req.user.id },
    });
    res.status(200).json({
      success: true,
      message: "Education records fetched successfully.",
      education,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch education records" });
  }
};

export const addEducation = async (req, res) => {
  try {
    const newEducation = await prisma.education.create({
      data: {
        ...req.body,
        userId: req.user.id,
      },
    });

    const allEducation = await prisma.education.findMany({
      where: { userId: req.user.id },
    });

    res.status(201).json({
      success: true,
      message: "Education record added successfully.",
      education: allEducation,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add education record" });
  }
};

export const updateEducation = async (req, res) => {
  const eduId = req.params.educationId || req.params.eduId;
  try {
    const updatedEducation = await prisma.education.update({
      where: { id: eduId },
      data: req.body,
    });

    res.status(200).json({
      success: true,
      message: "Education record updated successfully.",
      education: updatedEducation,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ success: false, message: "Education record not found" });
    }
    res.status(500).json({ success: false, message: "Failed to update education record" });
  }
};

export const removeEducation = async (req, res) => {
  const eduId = req.params.eduId;
  try {
    await prisma.education.delete({ where: { id: eduId } });

    const remaining = await prisma.education.findMany({
      where: { userId: req.user.id },
    });

    res.status(200).json({
      success: true,
      message: "Education record removed successfully.",
      education: remaining,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to remove education record" });
  }
};
