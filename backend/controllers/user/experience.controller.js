import prisma from "../../db/db.js";

export const getExperiences = async (req, res) => {
  try {
    const experiences = await prisma.experience.findMany({
      where: { userId: req.user.id },
    });
    res.status(200).json({
      success: true,
      message: "Experiences fetched successfully",
      experiences,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get experiences" });
  }
};

export const addExperience = async (req, res) => {
  try {
    const data = { ...req.body, userId: req.user.id };
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);

    await prisma.experience.create({ data });

    const experiences = await prisma.experience.findMany({
      where: { userId: req.user.id },
    });

    res.status(201).json({
      success: true,
      message: "Experience added successfully",
      experiences,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to add experience" });
  }
};

export const updateExperience = async (req, res) => {
  const experienceId = req.params.experienceId || req.params.expId;
  try {
    const data = { ...req.body };
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);

    const updated = await prisma.experience.update({
      where: { id: experienceId },
      data,
    });

    res.status(200).json({
      success: true,
      message: "Experience updated successfully",
      experience: updated,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ success: false, message: "Experience not found" });
    }
    res.status(500).json({ success: false, message: "Failed to update experience" });
  }
};

export const removeExperience = async (req, res) => {
  const experienceId = req.params.experienceId || req.params.expId;
  try {
    await prisma.experience.delete({ where: { id: experienceId } });

    const experiences = await prisma.experience.findMany({
      where: { userId: req.user.id },
    });

    res.status(200).json({
      success: true,
      message: "Experience removed successfully",
      experiences,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to remove experience" });
  }
};
