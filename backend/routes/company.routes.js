import prisma from "../db/db.js";
import express from "express";

const router = express.Router();

// Create a new company
router.post("/", async (req, res) => {
  try {
    const company = await prisma.company.create({
      data: req.body,
    });
    res.status(201).json(company);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all companies
router.get("/", async (req, res) => {
  try {
    const companies = await prisma.company.findMany();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific company by ID
router.get("/:id", async (req, res) => {
  try {
    const company = await prisma.company.findUnique({
      where: { id: req.params.id },
    });
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a company
router.patch("/:id", async (req, res) => {
  try {
    const company = await prisma.company.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(company);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Company not found" });
    }
    res.status(400).json({ message: error.message });
  }
});

// Delete a company
router.delete("/:id", async (req, res) => {
  try {
    await prisma.company.delete({
      where: { id: req.params.id },
    });
    res.json({ message: "Company deleted successfully" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Company not found" });
    }
    res.status(500).json({ message: error.message });
  }
});

export default router;
