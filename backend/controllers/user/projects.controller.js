import prisma from "../../db/db.js";

export const getProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { userId: req.user.id },
    });
    res.status(200).json({ success: true, projects: projects || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get projects" });
  }
};

export const addProject = async (req, res) => {
  try {
    const data = { ...req.body, userId: req.user.id };
    if (data.endDate) data.endDate = new Date(data.endDate);

    await prisma.project.create({ data });

    const projects = await prisma.project.findMany({
      where: { userId: req.user.id },
    });

    res.status(201).json({
      success: true,
      message: "Project added successfully!",
      projects,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add project" });
  }
};

export const updateProject = async (req, res) => {
  const { projectId } = req.params;
  try {
    const data = { ...req.body };
    if (data.endDate) data.endDate = new Date(data.endDate);

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data,
    });

    res.status(200).json({
      success: true,
      message: "Project updated successfully!",
      project: updatedProject,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    res.status(500).json({ success: false, message: "Failed to update project" });
  }
};

export const removeProject = async (req, res) => {
  const { projectId } = req.params;
  try {
    await prisma.project.delete({ where: { id: projectId } });

    const projects = await prisma.project.findMany({
      where: { userId: req.user.id },
    });

    res.status(200).json({
      success: true,
      message: "Project removed successfully!",
      projects,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to remove project" });
  }
};
