import prisma from "../db/db.js";
import { createError } from "../utils/error.js";

export const notificationControllers = {
  getMyNotifications: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const notifications = await prisma.userNotification.findMany({
        where: { recipientId: userId },
        include: {
          actor: {
            select: { id: true, fullName: true, profilePic: true, role: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 100,
      });

      const unreadCount = notifications.filter((item) => !item.isRead).length;
      res.status(200).json({ success: true, notifications, unreadCount });
    } catch (error) {
      next(error);
    }
  },

  markAsRead: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { notificationId } = req.params;

      const notification = await prisma.userNotification.findUnique({ where: { id: notificationId } });
      if (!notification) return next(createError(404, "Notification not found"));
      if (notification.recipientId !== userId) return next(createError(403, "Forbidden"));

      const updated = await prisma.userNotification.update({
        where: { id: notificationId },
        data: { isRead: true },
      });

      res.status(200).json({ success: true, notification: updated });
    } catch (error) {
      next(error);
    }
  },

  markAllAsRead: async (req, res, next) => {
    try {
      const userId = req.user.id;
      await prisma.userNotification.updateMany({
        where: { recipientId: userId, isRead: false },
        data: { isRead: true },
      });

      res.status(200).json({ success: true, message: "All notifications marked as read" });
    } catch (error) {
      next(error);
    }
  },
};
