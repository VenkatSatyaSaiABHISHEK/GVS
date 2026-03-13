import prisma from "../db/db.js";
import { createError } from "../utils/error.js";

export const tuitionControllers = {
  getAvailableTutors: async (req, res, next) => {
    try {
      const {
        subject, city, state, minRate, maxRate, mode,
        qualification, experience, page = 1, limit = 12,
      } = req.query;

      const where = {
        role: "jobSeeker",
        availableForHire: true,
      };

      if (subject) {
        where.OR = [
          { primarySubject: { contains: subject, mode: "insensitive" } },
          { secondarySubjects: { has: subject } },
        ];
      }
      if (city) where.city = { contains: city, mode: "insensitive" };
      if (state) where.state = { contains: state, mode: "insensitive" };
      if (mode) where.teachingMode = mode;
      if (qualification) where.qualification = { contains: qualification, mode: "insensitive" };

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const tutors = await prisma.user.findMany({
        where,
        select: {
          id: true, fullName: true, profilePic: true, bio: true,
          primarySubject: true, secondarySubjects: true, city: true,
          state: true, qualification: true, yoe: true, hourlyRate: true,
          rating: true, totalReviews: true, teachingMode: true,
          languages: true, specializations: true, studentsTaught: true,
          successRate: true,
        },
        take: parseInt(limit),
        skip,
        orderBy: [{ rating: "desc" }, { totalReviews: "desc" }],
      });

      const rankedTutors = tutors
        .map((tutor) => {
          const ratingScore = (tutor.rating || 0) * 20;
          const exp = parseFloat(tutor.yoe || "0");
          const expScore = Number.isFinite(exp) ? Math.min(exp * 4, 20) : 0;
          const completionSignals = [
            tutor.fullName,
            tutor.bio,
            tutor.profilePic,
            tutor.primarySubject,
            tutor.qualification,
            tutor.hourlyRate,
          ].filter(Boolean).length;
          const completionScore = Math.round((completionSignals / 6) * 20);
          const hireScore = Math.min((tutor.studentsTaught || 0) / 5, 20);
          const rankScore = Math.round(ratingScore + expScore + completionScore + hireScore);

          return {
            ...tutor,
            rankScore,
          };
        })
        .sort((a, b) => b.rankScore - a.rankScore);

      const total = await prisma.user.count({ where });

      res.status(200).json({
        success: true,
        tutors: rankedTutors,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error) {
      next(error);
    }
  },

  getTutorDetails: async (req, res, next) => {
    try {
      const { tutorId } = req.params;

      const tutor = await prisma.user.findUnique({
        where: { id: tutorId },
        include: { education: true, experience: true },
      });

      if (!tutor) return next(createError(404, "Tutor not found"));
      if (tutor.role !== "jobSeeker") return next(createError(400, "User is not a tutor"));

      const { password, verificationToken, ...tutorData } = tutor;
      res.status(200).json({ success: true, tutor: tutorData });
    } catch (error) {
      next(error);
    }
  },

  compareTeachers: async (req, res, next) => {
    try {
      const { teacherIds = [] } = req.body;
      if (!Array.isArray(teacherIds) || teacherIds.length < 2 || teacherIds.length > 5) {
        return next(createError(400, "Provide between 2 and 5 teacher IDs"));
      }

      const teachers = await prisma.user.findMany({
        where: {
          id: { in: teacherIds },
          role: "jobSeeker",
        },
        select: {
          id: true,
          fullName: true,
          profilePic: true,
          primarySubject: true,
          secondarySubjects: true,
          qualification: true,
          yoe: true,
          rating: true,
          hourlyRate: true,
          city: true,
          state: true,
          studentsTaught: true,
          successRate: true,
        },
      });

      res.status(200).json({ success: true, teachers });
    } catch (error) {
      next(error);
    }
  },

  createTuitionRequest: async (req, res, next) => {
    try {
      const parentId = req.user.id;
      const { teacherId, subject, classLevel, mode, location, message, hourlyRate } = req.body;

      const teacher = await prisma.user.findUnique({ where: { id: teacherId } });
      if (!teacher) return next(createError(404, "Teacher not found"));
      if (teacher.role !== "jobSeeker") return next(createError(400, "User is not a teacher"));
      if (!teacher.availableForHire) return next(createError(400, "Teacher is not available for hire"));

      const existingRequest = await prisma.tuitionBooking.findFirst({
        where: { teacherId, parentId, status: "requested" },
      });

      if (existingRequest) {
        return next(createError(400, "You already have a pending request with this teacher"));
      }

      const booking = await prisma.tuitionBooking.create({
        data: {
          teacherId,
          parentId,
          subject,
          classLevel,
          mode,
          location: location || null,
          message: message || null,
          hourlyRate: hourlyRate ? parseFloat(hourlyRate) : (teacher.hourlyRate ? parseFloat(teacher.hourlyRate) : null),
          status: "requested",
        },
      });

      res.status(201).json({
        success: true,
        message: "Tuition request sent successfully",
        booking,
      });
    } catch (error) {
      next(error);
    }
  },

  getParentRequests: async (req, res, next) => {
    try {
      const parentId = req.user.id;

      const requests = await prisma.tuitionBooking.findMany({
        where: { parentId },
        include: {
          teacher: {
            select: {
              id: true, fullName: true, profilePic: true, primarySubject: true,
              qualification: true, city: true, state: true, hourlyRate: true, rating: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      res.status(200).json({ success: true, requests });
    } catch (error) {
      next(error);
    }
  },

  getTeacherRequests: async (req, res, next) => {
    try {
      const teacherId = req.user.id;

      const requests = await prisma.tuitionBooking.findMany({
        where: { teacherId },
        include: {
          parent: {
            select: { id: true, fullName: true, email: true, contact: true, city: true, state: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      res.status(200).json({ success: true, requests });
    } catch (error) {
      next(error);
    }
  },

  updateRequestStatus: async (req, res, next) => {
    try {
      const { requestId } = req.params;
      const { status, startDate } = req.body;
      const teacherId = req.user.id;

      const validStatuses = ["accepted", "rejected"];
      if (!validStatuses.includes(status)) return next(createError(400, "Invalid status"));

      const request = await prisma.tuitionBooking.findUnique({ where: { id: requestId } });
      if (!request) return next(createError(404, "Request not found"));
      if (request.teacherId !== teacherId) {
        return next(createError(403, "You can only update your own tuition requests"));
      }
      if (request.status !== "requested") {
        return next(createError(400, "Request has already been processed"));
      }

      const updateData = { status };
      if (status === "accepted" && startDate) {
        updateData.startDate = new Date(startDate);
      }

      const updated = await prisma.tuitionBooking.update({
        where: { id: requestId },
        data: updateData,
      });

      res.status(200).json({
        success: true,
        message: `Request ${status} successfully`,
        request: updated,
      });
    } catch (error) {
      next(error);
    }
  },

  cancelRequest: async (req, res, next) => {
    try {
      const { requestId } = req.params;
      const parentId = req.user.id;

      const request = await prisma.tuitionBooking.findUnique({ where: { id: requestId } });
      if (!request) return next(createError(404, "Request not found"));
      if (request.parentId !== parentId) {
        return next(createError(403, "You can only cancel your own requests"));
      }
      if (request.status === "completed") {
        return next(createError(400, "Cannot cancel completed tuition"));
      }

      const updated = await prisma.tuitionBooking.update({
        where: { id: requestId },
        data: { status: "cancelled" },
      });

      res.status(200).json({
        success: true,
        message: "Request cancelled successfully",
        request: updated,
      });
    } catch (error) {
      next(error);
    }
  },

  getParentDashboard: async (req, res, next) => {
    try {
      const parentId = req.user.id;

      const totalRequests = await prisma.tuitionBooking.count({ where: { parentId } });
      const activeRequests = await prisma.tuitionBooking.count({ where: { parentId, status: "requested" } });
      const acceptedTuitions = await prisma.tuitionBooking.count({ where: { parentId, status: "accepted" } });

      const recentRequests = await prisma.tuitionBooking.findMany({
        where: { parentId },
        include: {
          teacher: {
            select: {
              id: true, fullName: true, profilePic: true,
              primarySubject: true, qualification: true, rating: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      });

      const recommendedTutors = await prisma.user.findMany({
        where: {
          role: "jobSeeker",
          availableForHire: true,
          rating: { gte: 4 },
        },
        select: {
          id: true, fullName: true, profilePic: true, primarySubject: true,
          secondarySubjects: true, city: true, qualification: true,
          hourlyRate: true, rating: true, totalReviews: true,
        },
        orderBy: { rating: "desc" },
        take: 6,
      });

      res.status(200).json({
        success: true,
        stats: { totalRequests, activeRequests, acceptedTuitions },
        recentRequests,
        recommendedTutors,
      });
    } catch (error) {
      next(error);
    }
  },
};
