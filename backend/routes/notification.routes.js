import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { notificationControllers } from "../controllers/notification.controller.js";

const router = express.Router();
router.use(protect);

router.get("/my", notificationControllers.getMyNotifications);
router.patch("/:notificationId/read", notificationControllers.markAsRead);
router.patch("/read-all", notificationControllers.markAllAsRead);

export default router;
