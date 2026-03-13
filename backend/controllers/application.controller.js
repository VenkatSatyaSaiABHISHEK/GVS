import prisma from "../db/db.js";
import { createError } from "../utils/error.js";
import { createUserNotification } from "../utils/notifyUser.js";

const VALID_APPLICATION_STATUSES = [
  "applied",
  "application_viewed",
  "shortlisted",
  "interview_scheduled",
  "interview_completed",
  "selected",
  "offer_sent",
  "hired",
  "rejected",
];

const STATUS_LABELS = {
  applied: "Applied",
  application_viewed: "Application Viewed",
  shortlisted: "Shortlisted",
  interview_scheduled: "Interview Scheduled",
  interview_completed: "Interview Completed",
  selected: "Selected",
  offer_sent: "Offer Sent",
  hired: "Hired",
  rejected: "Rejected",
};

export const applicationControllers = {
  getAllApplications: async (req, res, next) => {
    try {
      const applications = await prisma.application.findMany({
        include: {
          applicant: {
            select: { id: true, fullName: true, email: true, role: true },
          },
          job: {
            select: { id: true, title: true, companyName: true, status: true },
          },
        },
        orderBy: { appliedAt: "desc" },
        take: 100,
      });

      res.status(200).json({ success: true, data: applications });
    } catch (error) {
      next(error);
    }
  },

  applyForJob: async (req, res, next) => {
    try {
      const { jobId } = req.params;
      const applicantId = req.user.id;

      const job = await prisma.job.findUnique({ where: { id: jobId } });
      if (!job) return next(createError(404, "Job not found"));

      const existingApplication = await prisma.application.findUnique({
        where: { jobId_applicantId: { jobId, applicantId } },
      });

      if (existingApplication) {
        return next(createError(400, "You have already applied for this job"));
      }

      const application = await prisma.application.create({
        data: {
          jobId,
          applicantId,
          status: "applied",
          coverLetter: req.body.aboutYou || req.body.coverLetter || null,
          expectedSalary: req.body.expectedSalary ? parseFloat(req.body.expectedSalary) : null,
          availableFrom: req.body.availableFrom ? new Date(req.body.availableFrom) : null,
          resume: req.body.resume || null,
          statusHistory: {
            entries: [{
              status: "applied",
              at: new Date().toISOString(),
              note: "Application submitted",
            }],
          },
        },
      });

      await createUserNotification({
        recipientId: job.postedById,
        actorId: applicantId,
        title: "New job application",
        message: `A teacher applied for ${job.title}`,
        type: "application_status",
        link: `/dashboard/school/applications?jobId=${jobId}`,
        metadata: { applicationId: application.id, jobId },
      });

      res.status(201).json({
        success: true,
        message: "Application submitted successfully",
        application,
      });
    } catch (error) {
      console.error("Error in applyForJob:", error);
      next(error);
    }
  },

  getSchoolApplications: async (req, res, next) => {
    try {
      const schoolId = req.user.id;

      const applications = await prisma.application.findMany({
        where: {
          job: { postedById: schoolId },
        },
        include: {
          applicant: {
            select: {
              id: true, fullName: true, email: true, contact: true,
              city: true, state: true, skills: true, qualification: true,
              yoe: true,
              primarySubject: true,
              secondarySubjects: true,
              profilePic: true,
              rating: true,
            },
          },
          job: {
            select: { id: true, title: true, location: true, salaryRange: true, subject: true },
          },
        },
        orderBy: { appliedAt: "desc" },
      });

      res.status(200).json({ success: true, applications });
    } catch (error) {
      next(error);
    }
  },

  getTeacherApplications: async (req, res, next) => {
    try {
      const teacherId = req.user.id;

      const applications = await prisma.application.findMany({
        where: { applicantId: teacherId },
        include: {
          job: {
            select: { id: true, title: true, companyName: true, location: true, salaryRange: true, status: true },
          },
        },
        orderBy: { appliedAt: "desc" },
      });

      const enhanced = applications.map((application) => ({
        ...application,
        statusLabel: STATUS_LABELS[application.status] || application.status,
      }));

      res.status(200).json({ success: true, applications: enhanced });
    } catch (error) {
      next(error);
    }
  },

  updateApplicationStatus: async (req, res, next) => {
    try {
      const { applicationId } = req.params;
      const { status } = req.body;
      const schoolId = req.user.id;

      if (!VALID_APPLICATION_STATUSES.includes(status)) {
        return next(createError(400, "Invalid status"));
      }

      const application = await prisma.application.findUnique({
        where: { id: applicationId },
        include: { job: true },
      });

      if (!application) return next(createError(404, "Application not found"));
      if (application.job.postedById !== schoolId) {
        return next(createError(403, "You can only update applications for your own jobs"));
      }

      const existingHistory = application.statusHistory?.entries || [];
      const statusHistory = {
        entries: [
          ...existingHistory,
          {
            status,
            at: new Date().toISOString(),
            by: schoolId,
          },
        ],
      };

      const updateData = {
        status,
        statusHistory,
      };

      if (status === "application_viewed") updateData.viewedAt = new Date();
      if (status === "shortlisted") updateData.shortlistedAt = new Date();
      if (status === "interview_completed") updateData.interviewCompletedAt = new Date();

      const updated = await prisma.application.update({
        where: { id: applicationId },
        data: updateData,
      });

      await createUserNotification({
        recipientId: application.applicantId,
        actorId: schoolId,
        title: "Application status updated",
        message: `Your application for ${application.job.title} is now ${STATUS_LABELS[status] || status}`,
        type: "application_status",
        link: "/dashboard/teacher/applied-jobs",
        metadata: { applicationId: application.id, status },
      });

      res.status(200).json({
        success: true,
        message: "Application status updated successfully",
        application: updated,
      });
    } catch (error) {
      next(error);
    }
  },

  scheduleInterview: async (req, res, next) => {
    try {
      const { applicationId } = req.params;
      const schoolId = req.user.id;
      const {
        interviewDate,
        interviewTime,
        interviewType,
        meetingLink,
        interviewLocation,
        interviewInstructions,
      } = req.body;

      const application = await prisma.application.findUnique({
        where: { id: applicationId },
        include: { job: true },
      });

      if (!application) return next(createError(404, "Application not found"));
      if (application.job.postedById !== schoolId) {
        return next(createError(403, "You can only schedule interviews for your own jobs"));
      }

      const existingHistory = application.statusHistory?.entries || [];

      const updated = await prisma.application.update({
        where: { id: applicationId },
        data: {
          status: "interview_scheduled",
          interviewDate: interviewDate ? new Date(interviewDate) : null,
          interviewTime: interviewTime || null,
          interviewType: interviewType || null,
          meetingLink: meetingLink || null,
          interviewLocation: interviewLocation || null,
          interviewInstructions: interviewInstructions || null,
          statusHistory: {
            entries: [
              ...existingHistory,
              {
                status: "interview_scheduled",
                at: new Date().toISOString(),
                by: schoolId,
                interviewDate,
                interviewTime,
              },
            ],
          },
        },
      });

      await createUserNotification({
        recipientId: application.applicantId,
        actorId: schoolId,
        title: "Interview scheduled",
        message: `Interview for ${application.job.title} is scheduled on ${interviewDate || "TBD"} ${interviewTime || ""}`.trim(),
        type: "interview",
        link: "/dashboard/teacher/applied-jobs",
        metadata: { applicationId, interviewDate, interviewTime, interviewType },
      });

      res.status(200).json({ success: true, message: "Interview scheduled successfully", application: updated });
    } catch (error) {
      next(error);
    }
  },

  submitInterviewFeedback: async (req, res, next) => {
    try {
      const { applicationId } = req.params;
      const schoolId = req.user.id;
      const { feedback, demoEvaluation } = req.body;

      const application = await prisma.application.findUnique({
        where: { id: applicationId },
        include: { job: true },
      });

      if (!application) return next(createError(404, "Application not found"));
      if (application.job.postedById !== schoolId) {
        return next(createError(403, "You can only submit feedback for your own job applicants"));
      }

      const existingHistory = application.statusHistory?.entries || [];

      const updated = await prisma.application.update({
        where: { id: applicationId },
        data: {
          status: "interview_completed",
          interviewCompletedAt: new Date(),
          interviewFeedback: feedback || null,
          demoEvaluation: demoEvaluation || null,
          statusHistory: {
            entries: [
              ...existingHistory,
              {
                status: "interview_completed",
                at: new Date().toISOString(),
                by: schoolId,
              },
            ],
          },
        },
      });

      await createUserNotification({
        recipientId: application.applicantId,
        actorId: schoolId,
        title: "Interview feedback received",
        message: feedback || "Your interview has been marked completed",
        type: "interview",
        link: "/dashboard/teacher/applied-jobs",
        metadata: { applicationId },
      });

      res.status(200).json({ success: true, message: "Interview feedback submitted", application: updated });
    } catch (error) {
      next(error);
    }
  },

  sendOffer: async (req, res, next) => {
    try {
      const { applicationId } = req.params;
      const schoolId = req.user.id;
      const { salary, subject, joiningDate, termsAndConditions } = req.body;

      const application = await prisma.application.findUnique({
        where: { id: applicationId },
        include: { job: true },
      });
      if (!application) return next(createError(404, "Application not found"));
      if (application.job.postedById !== schoolId) {
        return next(createError(403, "You can only send offers for your own jobs"));
      }

      const existingHistory = application.statusHistory?.entries || [];

      const updated = await prisma.application.update({
        where: { id: applicationId },
        data: {
          status: "offer_sent",
          offerSalary: salary ? parseFloat(salary) : null,
          offerSubject: subject || application.job.subject || null,
          joiningDate: joiningDate ? new Date(joiningDate) : null,
          offerTerms: termsAndConditions || null,
          offerStatus: "pending",
          statusHistory: {
            entries: [
              ...existingHistory,
              {
                status: "offer_sent",
                at: new Date().toISOString(),
                by: schoolId,
              },
            ],
          },
        },
      });

      await createUserNotification({
        recipientId: application.applicantId,
        actorId: schoolId,
        title: "Offer letter received",
        message: `You received an offer for ${application.job.title}`,
        type: "offer",
        link: "/dashboard/teacher/applied-jobs",
        metadata: { applicationId },
      });

      res.status(200).json({ success: true, message: "Offer sent successfully", application: updated });
    } catch (error) {
      next(error);
    }
  },

  respondToOffer: async (req, res, next) => {
    try {
      const { applicationId } = req.params;
      const teacherId = req.user.id;
      const { action } = req.body;

      if (!["accept", "reject"].includes(action)) {
        return next(createError(400, "Action must be accept or reject"));
      }

      const application = await prisma.application.findUnique({
        where: { id: applicationId },
        include: { job: true },
      });

      if (!application) return next(createError(404, "Application not found"));
      if (application.applicantId !== teacherId) {
        return next(createError(403, "You can only respond to your own offer"));
      }

      const accepted = action === "accept";
      const existingHistory = application.statusHistory?.entries || [];

      const updated = await prisma.application.update({
        where: { id: applicationId },
        data: {
          offerStatus: accepted ? "accepted" : "rejected",
          offerRespondedAt: new Date(),
          status: accepted ? "hired" : "rejected",
          statusHistory: {
            entries: [
              ...existingHistory,
              {
                status: accepted ? "hired" : "rejected",
                at: new Date().toISOString(),
                by: teacherId,
              },
            ],
          },
        },
      });

      await createUserNotification({
        recipientId: application.job.postedById,
        actorId: teacherId,
        title: accepted ? "Offer accepted" : "Offer rejected",
        message: `${application.job.title} offer was ${accepted ? "accepted" : "rejected"} by candidate`,
        type: "offer",
        link: "/dashboard/school/applications",
        metadata: { applicationId, action },
      });

      res.status(200).json({ success: true, message: `Offer ${accepted ? "accepted" : "rejected"}`, application: updated });
    } catch (error) {
      next(error);
    }
  },

  getSchoolPipeline: async (req, res, next) => {
    try {
      const schoolId = req.user.id;
      const { jobId, subject, experience, qualification, location } = req.query;

      const where = {
        job: { postedById: schoolId },
      };

      if (jobId) where.jobId = jobId;
      if (subject) {
        where.OR = [
          { applicant: { primarySubject: { contains: subject, mode: "insensitive" } } },
          { applicant: { secondarySubjects: { has: subject } } },
        ];
      }
      if (qualification) {
        where.applicant = {
          ...(where.applicant || {}),
          qualification: { contains: qualification, mode: "insensitive" },
        };
      }
      if (location) {
        where.applicant = {
          ...(where.applicant || {}),
          city: { contains: location, mode: "insensitive" },
        };
      }

      const applications = await prisma.application.findMany({
        where,
        include: {
          applicant: {
            select: {
              id: true,
              fullName: true,
              qualification: true,
              yoe: true,
              city: true,
              state: true,
              profilePic: true,
              primarySubject: true,
              secondarySubjects: true,
              rating: true,
            },
          },
          job: {
            select: { id: true, title: true, subject: true },
          },
        },
        orderBy: { appliedAt: "desc" },
      });

      const byStage = VALID_APPLICATION_STATUSES.reduce((acc, stage) => {
        acc[stage] = applications.filter((application) => application.status === stage);
        return acc;
      }, {});

      const analytics = {
        totalApplicants: applications.length,
        shortlisted: byStage.shortlisted.length,
        interviewsScheduled: byStage.interview_scheduled.length,
        hired: byStage.hired.length,
      };

      res.status(200).json({
        success: true,
        analytics,
        pipeline: byStage,
      });
    } catch (error) {
      next(error);
    }
  },

  getRecommendedJobsForTeacher: async (req, res, next) => {
    try {
      const teacherId = req.user.id;
      const teacher = await prisma.user.findUnique({ where: { id: teacherId } });
      if (!teacher) return next(createError(404, "Teacher not found"));

      const filters = [];

      if (teacher.primarySubject) {
        filters.push({ subject: { contains: teacher.primarySubject, mode: "insensitive" } });
      }
      if (teacher.city) {
        filters.push({ location: { path: ["city"], string_contains: teacher.city } });
      }

      const jobs = await prisma.job.findMany({
        where: {
          status: "open",
          ...(filters.length > 0 ? { OR: filters } : {}),
        },
        take: 12,
        orderBy: { postedAt: "desc" },
      });

      const normalizedSkills = Array.isArray(teacher.skills)
        ? teacher.skills.map((item) => String(item).toLowerCase())
        : [];

      const scored = jobs.map((job) => {
        let score = 0;

        if (teacher.primarySubject && job.subject?.toLowerCase().includes(teacher.primarySubject.toLowerCase())) {
          score += 40;
        }

        const jobCity = (job.location && typeof job.location === "object") ? String(job.location.city || "").toLowerCase() : "";
        if (teacher.city && jobCity.includes(String(teacher.city).toLowerCase())) {
          score += 25;
        }

        const reqText = `${job.skillsRequired || ""} ${job.requirements?.join(" ") || ""}`.toLowerCase();
        const matchedSkills = normalizedSkills.filter((skill) => reqText.includes(skill));
        score += Math.min(20, matchedSkills.length * 5);

        if (teacher.yoe && job.experience && String(job.experience).toLowerCase().includes(String(teacher.yoe).toLowerCase())) {
          score += 15;
        }

        return {
          ...job,
          matchScore: Math.min(100, score),
        };
      });

      scored.sort((a, b) => b.matchScore - a.matchScore);

      res.status(200).json({ success: true, jobs: scored.slice(0, 10) });
    } catch (error) {
      next(error);
    }
  },

  checkApplicationStatus: async (req, res, next) => {
    try {
      const { jobId } = req.params;
      const teacherId = req.user.id;

      const application = await prisma.application.findUnique({
        where: { jobId_applicantId: { jobId, applicantId: teacherId } },
      });

      res.status(200).json({
        success: true,
        hasApplied: !!application,
        application: application || null,
      });
    } catch (error) {
      next(error);
    }
  },

  getJobApplications: async (req, res, next) => {
    try {
      const { jobId } = req.params;
      const schoolId = req.user.id;

      // Verify the job belongs to this school
      const job = await prisma.job.findUnique({ where: { id: jobId } });
      if (!job) return next(createError(404, "Job not found"));
      if (job.postedById !== schoolId) {
        return next(createError(403, "You can only view applications for your own jobs"));
      }

      const applications = await prisma.application.findMany({
        where: { jobId },
        include: {
          applicant: {
            select: {
              id: true, fullName: true, email: true, contact: true,
              city: true, state: true, skills: true, qualification: true,
              profilePic: true, yoe: true, bio: true,
              primarySubject: true,
              secondarySubjects: true,
              rating: true,
            },
          },
          job: {
            select: { id: true, title: true, location: true, salaryRange: true },
          },
        },
        orderBy: { appliedAt: "desc" },
      });

      res.status(200).json({ success: true, applications });
    } catch (error) {
      next(error);
    }
  },
};
