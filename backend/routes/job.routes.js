import express from "express";
import { jobControllers } from "../controllers/user/job.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";

const router = express.Router();
router.use(protect);

/**
 * @swagger
 * /api/jobs/create:
 *   post:
 *     summary: Create a new job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - company
 *               - title
 *               - description
 *               - location
 *               - frequency
 *               - jobType
 *               - experience
 *             properties:
 *               company:
 *                 type: string
 *                 description: ID of the company posting the job
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: object
 *                 properties:
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   country:
 *                     type: string
 *               salaryRange:
 *                 type: object
 *                 properties:
 *                   min:
 *                     type: string
 *                   max:
 *                     type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               frequency:
 *                 type: string
 *                 enum: [hourly, monthly, yearly]
 *               skillsRequired:
 *                 type: array
 *                 items:
 *                   type: string
 *               jobType:
 *                 type: string
 *                 enum: [full time, part time, internship]
 *               workFrom:
 *                 type: string
 *                 enum: [remote, on-site, hybrid]
 *               experience:
 *                 type: string
 *                 enum: [entry-level, mid-level, senior-level]
 *     responses:
 *       201:
 *         description: Job created successfully
 *       403:
 *         description: Only recruiters can post jobs
 *       404:
 *         description: Company not found
 */
router.post("/create", authorize("recruiter"), jobControllers.createJob);

/**
 * @swagger
 * /api/jobs/get-all:
 *   get:
 *     summary: Get all jobs with optional filtering
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: company
 *         schema:
 *           type: string
 *         description: Filter by company ID
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter by job title (case-insensitive regex)
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by city (case-insensitive regex)
 *       - in: query
 *         name: jobType
 *         schema:
 *           type: string
 *           enum: [full time, part time, internship]
 *       - in: query
 *         name: workFrom
 *         schema:
 *           type: string
 *           enum: [remote, on-site, hybrid]
 *       - in: query
 *         name: experience
 *         schema:
 *           type: string
 *           enum: [entry-level, mid-level, senior-level]
 *       - in: query
 *         name: frequency
 *         schema:
 *           type: string
 *           enum: [hourly, monthly, yearly]
 *       - in: query
 *         name: skills
 *         schema:
 *           type: string
 *         description: Comma-separated list of required skills
 *       - in: query
 *         name: salaryMin
 *         schema:
 *           type: integer
 *       - in: query
 *         name: salaryMax
 *         schema:
 *           type: integer
 *       - in: query
 *         name: postedAfter
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: postedBefore
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [open, closed]
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: postedAt
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: List of jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nextCursor:
 *                   type: string
 *                   nullable: true
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 */
router.get("/get-all", jobControllers.getAllJobs);

/**
 * @swagger
 * /api/jobs/{jobId}/job-data:
 *   get:
 *     summary: Get a specific job by ID
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Job'
 *       404:
 *         description: Job not found
 */
router.get("/:jobId/job-data", jobControllers.getJobById);

/**
 * @swagger
 * /api/jobs/{jobId}:
 *   put:
 *     summary: Update a job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Job'
 *     responses:
 *       200:
 *         description: Job updated successfully
 *       403:
 *         description: You can update only your own job posts
 *       404:
 *         description: Job not found
 */
router.put("/:jobId/update", jobControllers.updateJob);

/**
 * @swagger
 * /api/jobs/{jobId}/delete:
 *   delete:
 *     summary: Delete a job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job has been deleted successfully
 *       403:
 *         description: You can delete only your own job posts
 *       404:
 *         description: Job not found
 */
router.delete("/:jobId/delete", jobControllers.deleteJob);

// Update job status (admin use)
router.patch("/:jobId/status", jobControllers.updateJobStatus);

/**
 * @swagger
 * /api/jobs/recruiter/jobs:
 *   get:
 *     summary: Get jobs posted by a recruiter
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of jobs posted by the recruiter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 */
router.get(
  "/get-recruiter-jobs",
  authorize("recruiter"),
  jobControllers.getRecruiterJobs
);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Job:
 *       type: object
 *       required:
 *         - company
 *         - postedBy
 *         - title
 *         - description
 *         - location
 *         - frequency
 *         - jobType
 *         - experience
 *       properties:
 *         _id:
 *           type: string
 *         company:
 *           type: string
 *           description: Reference to Company
 *         postedBy:
 *           type: string
 *           description: Reference to User
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         location:
 *           type: object
 *           properties:
 *             city:
 *               type: string
 *             state:
 *               type: string
 *             country:
 *               type: string
 *         salaryRange:
 *           type: object
 *           properties:
 *             min:
 *               type: string
 *             max:
 *               type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         socials:
 *           type: object
 *           properties:
 *             linkedin:
 *               type: string
 *             twitter:
 *               type: string
 *             website:
 *               type: string
 *         frequency:
 *           type: string
 *           enum: [hourly, monthly, yearly]
 *         skillsRequired:
 *           type: array
 *           items:
 *             type: string
 *         postedAt:
 *           type: string
 *           format: date-time
 *         applicants:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of Application references
 *         status:
 *           type: string
 *           enum: [open, closed]
 *         jobType:
 *           type: string
 *           enum: [full time, part time, internship]
 *         workFrom:
 *           type: string
 *           enum: [remote, on-site, hybrid]
 *         experience:
 *           type: string
 *           enum: [entry-level, mid-level, senior-level]
 */
