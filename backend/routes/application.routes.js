import express from "express";
import { applicationControllers } from "../controllers/application.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";

const router = express.Router();
router.use(protect);

// Get all applications (for admin/dashboard)
router.get(
  "/",
  applicationControllers.getAllApplications
);

// Apply for a job (teachers only)
router.post(
  "/jobs/:jobId/apply",
  authorize("jobSeeker"),
  applicationControllers.applyForJob
);

// Get all applications for school's jobs (schools only)
router.get(
  "/school",
  authorize("recruiter"),
  applicationControllers.getSchoolApplications
);

router.get(
  "/school/pipeline",
  authorize("recruiter"),
  applicationControllers.getSchoolPipeline
);

// Get teacher's applications (teachers only)
router.get(
  "/teacher",
  authorize("jobSeeker"),
  applicationControllers.getTeacherApplications
);

router.get(
  "/teacher/recommended-jobs",
  authorize("jobSeeker"),
  applicationControllers.getRecommendedJobsForTeacher
);

// Update application status (schools only)
router.patch(
  "/:applicationId/status",
  authorize("recruiter"),
  applicationControllers.updateApplicationStatus
);

router.patch(
  "/:applicationId/interview",
  authorize("recruiter"),
  applicationControllers.scheduleInterview
);

router.patch(
  "/:applicationId/interview-feedback",
  authorize("recruiter"),
  applicationControllers.submitInterviewFeedback
);

router.patch(
  "/:applicationId/offer",
  authorize("recruiter"),
  applicationControllers.sendOffer
);

router.patch(
  "/:applicationId/offer/respond",
  authorize("jobSeeker"),
  applicationControllers.respondToOffer
);

// Get applications for a specific job (schools only)
router.get(
  "/:jobId/get-job-applications",
  authorize("recruiter"),
  applicationControllers.getJobApplications
);

// Check if teacher has applied for a job
router.get(
  "/jobs/:jobId/check",
  authorize("jobSeeker"),
  applicationControllers.checkApplicationStatus
);

export default router;
