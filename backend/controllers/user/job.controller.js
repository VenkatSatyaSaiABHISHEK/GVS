import prisma from "../../db/db.js";
import { createError } from "../../utils/error.js";

export const jobControllers = {
  createJob: async (req, res, next) => {
    const recruiterId = req.user.id;
    try {
      const recruiter = await prisma.user.findUnique({ where: { id: recruiterId } });
      if (!recruiter || recruiter.role !== "recruiter") {
        return next(createError(403, "Only schools can post jobs"));
      }

      const newJob = await prisma.job.create({
        data: {
          title: req.body.jobTitle || req.body.title,
          description: req.body.description,
          requirements: req.body.requirements || [],
          responsibilities: req.body.responsibilities || [],
          benefits: req.body.benefits || [],
          skillsRequired: req.body.subject || req.body.skillsRequired || null,
          experience: req.body.experience || "0",
          jobType: (req.body.jobType || "full-time").replace("-", "_"),
          workFrom: (req.body.workFrom || "on-site").replace("-", "_"),
          location: {
            city: req.body.location || recruiter.city || "Not specified",
            state: recruiter.state || "",
            country: "India",
          },
          salaryRange: {
            min: req.body.salaryMin || req.body.salary?.split("-")[0]?.trim() || "0",
            max: req.body.salaryMax || req.body.salary?.split("-")[1]?.trim() || "0",
            currency: "INR",
          },
          applicationDeadline: req.body.applicationDeadline
            ? new Date(req.body.applicationDeadline)
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          startDate: req.body.startDate ? new Date(req.body.startDate) : null,
          workingHours: req.body.workingHours || "Not specified",
          classLevels: req.body.classLevels || [],
          subject: req.body.subject || null,
          postedById: recruiter.id,
          companyUserId: recruiter.id,
          companyName: recruiter.fullName || "School",
          status: "open",
        },
      });

      res.status(201).json({
        success: true,
        message: "Job posted successfully!",
        job: newJob,
      });
    } catch (err) {
      console.log("ERROR creating job:", err.message);
      next(err);
    }
  },

  getAllJobs: async (req, res, next) => {
    try {
      const {
        company, title, location, jobType, workFrom,
        experience, status, cursor = null, limit = 10,
        sortBy = "postedAt", sortOrder = "desc",
      } = req.query;

      const where = {};
      if (company) where.companyUserId = company;
      if (title) where.title = { contains: title, mode: "insensitive" };
      if (location) {
        where.location = { path: ["city"], string_contains: location };
      }
      if (jobType) where.jobType = jobType.replace("-", "_");
      if (workFrom) where.workFrom = workFrom.replace("-", "_");
      if (experience) where.experience = experience;
      if (status) where.status = status;
      if (cursor) where.id = { gt: cursor };

      const sortField = sortBy === "newest" || sortBy === "oldest" ? "postedAt" : sortBy;
      const orderBy = {};
      orderBy[sortField] = sortOrder === "asc" ? "asc" : "desc";

      const _jobs = await prisma.job.findMany({
        where,
        orderBy,
        take: parseInt(limit) + 1,
        include: {
          postedBy: { select: { id: true, fullName: true } },
        },
      });

      if (_jobs.length === 0) {
        return res.status(200).json({ nextCursor: null, jobs: [] });
      }

      const hasNextPage = _jobs.length > parseInt(limit);
      const jobs = hasNextPage ? _jobs.slice(0, -1) : _jobs;

      const formattedJobs = jobs.map((job) => ({
        ...job,
        _id: job.id, // Backward compatibility
        combinedField: {
          requiredSkills: job.skillsRequired
            ? job.skillsRequired.split(",").map((s) => s.trim())[0]
            : [],
          jobType: job.jobType,
          workFrom: job.workFrom,
          experience: job.experience,
        },
      }));

      res.status(200).json({
        nextCursor: hasNextPage ? jobs[jobs.length - 1].id : null,
        jobs: formattedJobs,
      });
    } catch (err) {
      console.error("Error in getAllJobs:", err);
      next(err);
    }
  },

  getJobById: async (req, res, next) => {
    try {
      const jobId = req.params.jobId || req.params.id;

      const job = await prisma.job.findUnique({
        where: { id: jobId },
        include: {
          postedBy: { select: { id: true, fullName: true, email: true } },
          companyUser: true,
        },
      });

      if (!job) return next(createError(404, "Job not found"));

      // Add _id for backward compatibility
      res.status(200).json({ ...job, _id: job.id });
    } catch (err) {
      console.error("Error in getJobById:", err);
      next(err);
    }
  },

  updateJob: async (req, res, next) => {
    const jobId = req.params.jobId;
    try {
      const job = await prisma.job.findUnique({ where: { id: jobId } });
      if (!job) return next(createError(404, "Job not found"));
      if (job.postedById !== req.user.id) {
        return next(createError(403, "You can update only your own job posts"));
      }

      const currentLocation = job.location || {};
      const updateData = {
        title: req.body.jobTitle || req.body.title || job.title,
        description: req.body.description || job.description,
        requirements: req.body.requirements || job.requirements,
        responsibilities: req.body.responsibilities || job.responsibilities,
        benefits: req.body.benefits || job.benefits,
        skillsRequired: req.body.subject || req.body.skillsRequired || job.skillsRequired,
        experience: req.body.experience || job.experience,
        jobType: req.body.jobType ? req.body.jobType.replace("-", "_") : job.jobType,
        workFrom: req.body.workFrom ? req.body.workFrom.replace("-", "_") : job.workFrom,
        location: {
          city: req.body.location || currentLocation.city || "Not specified",
          state: currentLocation.state || "",
          country: "India",
        },
        salaryRange: {
          min: req.body.salaryMin || job.salaryRange?.min || "0",
          max: req.body.salaryMax || job.salaryRange?.max || "0",
          currency: "INR",
        },
        workingHours: req.body.workingHours || job.workingHours,
        classLevels: req.body.classLevels || job.classLevels,
        subject: req.body.subject || job.subject,
      };

      if (req.body.applicationDeadline) {
        updateData.applicationDeadline = new Date(req.body.applicationDeadline);
      }
      if (req.body.startDate) {
        updateData.startDate = new Date(req.body.startDate);
      }

      const updatedJob = await prisma.job.update({
        where: { id: jobId },
        data: updateData,
      });

      res.status(200).json({
        success: true,
        message: "Job updated successfully!",
        job: updatedJob,
      });
    } catch (err) {
      next(err);
    }
  },

  deleteJob: async (req, res, next) => {
    try {
      const jobId = req.params.jobId || req.params.id;

      const job = await prisma.job.findUnique({ where: { id: jobId } });
      if (!job) return next(createError(404, "Job not found"));
      if (job.postedById !== req.user.id) {
        return next(createError(403, "You can delete only your own job posts"));
      }

      // Delete related applications first
      await prisma.application.deleteMany({ where: { jobId } });
      await prisma.job.delete({ where: { id: jobId } });

      res.status(200).json({ success: true, message: "Job has been deleted successfully" });
    } catch (err) {
      console.error("Error deleting job:", err);
      next(err);
    }
  },

  getRecruiterJobs: async (req, res, next) => {
    const recruiterId = req.user.id;
    try {
      const { status, cursor = null, limit = 10, sortBy = "postedAt", sortOrder = "desc" } = req.query;

      const where = { postedById: recruiterId };
      if (status) where.status = status;
      if (cursor) where.id = { gt: cursor };

      const sortField = sortBy === "newest" || sortBy === "oldest" ? "postedAt" : sortBy;
      const orderBy = {};
      orderBy[sortField] = sortOrder === "asc" ? "asc" : "desc";

      const _jobs = await prisma.job.findMany({
        where,
        orderBy,
        take: parseInt(limit) + 1,
        include: {
          applicants: { select: { id: true, applicant: { select: { fullName: true, email: true } } } },
        },
      });

      if (_jobs.length === 0) {
        return res.status(200).json({ nextCursor: null, jobs: [] });
      }

      const hasNextPage = _jobs.length > parseInt(limit);
      const jobs = hasNextPage ? _jobs.slice(0, -1) : _jobs;

      const formattedJobs = jobs.map((job) => ({
        ...job,
        _id: job.id,
        combinedField: {
          requiredSkills: job.skillsRequired
            ? job.skillsRequired.split(",").map((s) => s.trim())[0]
            : null,
          jobType: job.jobType,
          workFrom: job.workFrom,
          experience: job.experience,
        },
      }));

      res.status(200).json({
        nextCursor: hasNextPage ? jobs[jobs.length - 1].id : null,
        jobs: formattedJobs,
      });
    } catch (err) {
      next(err);
    }
  },

  updateJobStatus: async (req, res, next) => {
    try {
      const { jobId } = req.params;
      const { status } = req.body;

      const validStatuses = ["active", "pending", "closed", "expired"];
      if (!validStatuses.includes(status)) {
        return next(createError(400, `Invalid status. Must be one of: ${validStatuses.join(", ")}`));
      }

      const job = await prisma.job.findUnique({ where: { id: jobId } });
      if (!job) return next(createError(404, "Job not found"));

      const updated = await prisma.job.update({
        where: { id: jobId },
        data: { status },
      });

      res.status(200).json({ success: true, message: "Job status updated", job: updated });
    } catch (err) {
      next(err);
    }
  },
};
