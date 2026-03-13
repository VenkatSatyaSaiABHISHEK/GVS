import express from "express";
import { tuitionControllers } from "../controllers/tuition.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";

const router = express.Router();
router.use(protect);

// Parent routes
router.get("/dashboard", authorize("parent"), tuitionControllers.getParentDashboard);
router.get("/tutors", tuitionControllers.getAvailableTutors); // Allow all authenticated users
router.get("/tutors/:tutorId", tuitionControllers.getTutorDetails);
router.post("/tutors/compare", authorize("parent"), tuitionControllers.compareTeachers);
router.post("/request", authorize("parent"), tuitionControllers.createTuitionRequest);
router.get("/my-requests", authorize("parent"), tuitionControllers.getParentRequests);
router.patch("/request/:requestId/cancel", authorize("parent"), tuitionControllers.cancelRequest);

// Teacher routes
router.get("/teacher/requests", authorize("jobSeeker"), tuitionControllers.getTeacherRequests);
router.patch("/teacher/request/:requestId/status", authorize("jobSeeker"), tuitionControllers.updateRequestStatus);

export default router;
