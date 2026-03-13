import prisma from "../db/db.js";
import { createError } from "../utils/error.js";
import { createUserNotification } from "../utils/notifyUser.js";

export const messageControllers = {
  sendMessage: async (req, res, next) => {
    try {
      const senderId = req.user.id;
      const { receiverId, message, relatedTo, relatedId } = req.body;

      if (!message && !req.file) {
        return next(createError(400, "Message or attachment is required"));
      }

      const receiver = await prisma.user.findUnique({ where: { id: receiverId } });
      if (!receiver) return next(createError(404, "Receiver not found"));

      const newMessage = await prisma.message.create({
        data: {
          senderId,
          receiverId,
          message: message || "",
          relatedTo: relatedTo || "general",
          relatedId: relatedId || null,
          attachmentUrl: req.file ? `${req.protocol}://${req.get("host")}/uploads/messages/${req.file.filename}` : null,
          attachmentName: req.file?.originalname || null,
        },
        include: {
          sender: { select: { id: true, fullName: true, profilePic: true } },
          receiver: { select: { id: true, fullName: true, profilePic: true } },
        },
      });

      res.status(201).json({
        success: true,
        message: "Message sent successfully",
        data: newMessage,
      });

      await createUserNotification({
        recipientId: receiverId,
        actorId: senderId,
        title: "New message",
        message: "You received a new message",
        type: "message",
        link: "/dashboard/teacher/messages",
        metadata: { messageId: newMessage.id },
      });
    } catch (error) {
      next(error);
    }
  },

  getInbox: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const messages = await prisma.message.findMany({
        where: { receiverId: userId, archivedByReceiver: false },
        include: {
          sender: { select: { id: true, fullName: true, profilePic: true } },
          receiver: { select: { id: true, fullName: true, profilePic: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      res.status(200).json({ success: true, messages });
    } catch (error) {
      next(error);
    }
  },

  getSent: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const messages = await prisma.message.findMany({
        where: { senderId: userId, archivedBySender: false },
        include: {
          sender: { select: { id: true, fullName: true, profilePic: true } },
          receiver: { select: { id: true, fullName: true, profilePic: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      res.status(200).json({ success: true, messages });
    } catch (error) {
      next(error);
    }
  },

  getArchived: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: userId, archivedBySender: true },
            { receiverId: userId, archivedByReceiver: true },
          ],
        },
        include: {
          sender: { select: { id: true, fullName: true, profilePic: true } },
          receiver: { select: { id: true, fullName: true, profilePic: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      res.status(200).json({ success: true, messages });
    } catch (error) {
      next(error);
    }
  },

  archiveMessage: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { messageId } = req.params;

      const message = await prisma.message.findUnique({ where: { id: messageId } });
      if (!message) return next(createError(404, "Message not found"));

      const updateData = {};
      if (message.senderId === userId) updateData.archivedBySender = true;
      if (message.receiverId === userId) updateData.archivedByReceiver = true;
      if (!Object.keys(updateData).length) return next(createError(403, "Forbidden"));

      await prisma.message.update({
        where: { id: messageId },
        data: updateData,
      });

      res.status(200).json({ success: true, message: "Message archived" });
    } catch (error) {
      next(error);
    }
  },

  getConversation: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { otherUserId } = req.params;

      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: userId, receiverId: otherUserId },
            { senderId: otherUserId, receiverId: userId },
          ],
        },
        include: {
          sender: { select: { id: true, fullName: true, profilePic: true } },
          receiver: { select: { id: true, fullName: true, profilePic: true } },
        },
        orderBy: { createdAt: "asc" },
      });

      // Mark messages as read
      await prisma.message.updateMany({
        where: { senderId: otherUserId, receiverId: userId, isRead: false },
        data: { isRead: true },
      });

      res.status(200).json({ success: true, messages });
    } catch (error) {
      next(error);
    }
  },

  getAllConversations: async (req, res, next) => {
    try {
      const userId = req.user.id;

      // Get distinct user IDs from sent/received messages
      const sentTo = await prisma.message.findMany({
        where: { senderId: userId },
        select: { receiverId: true },
        distinct: ["receiverId"],
      });

      const receivedFrom = await prisma.message.findMany({
        where: { receiverId: userId },
        select: { senderId: true },
        distinct: ["senderId"],
      });

      const userIds = [
        ...new Set([
          ...sentTo.map((m) => m.receiverId),
          ...receivedFrom.map((m) => m.senderId),
        ]),
      ];

      const conversations = await Promise.all(
        userIds.map(async (otherUserId) => {
          const lastMessage = await prisma.message.findFirst({
            where: {
              OR: [
                { senderId: userId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: userId },
              ],
            },
            orderBy: { createdAt: "desc" },
            include: {
              sender: { select: { id: true, fullName: true, profilePic: true } },
              receiver: { select: { id: true, fullName: true, profilePic: true } },
            },
          });

          const unreadCount = await prisma.message.count({
            where: { senderId: otherUserId, receiverId: userId, isRead: false },
          });

          const otherUser = await prisma.user.findUnique({
            where: { id: otherUserId },
            select: { id: true, fullName: true, profilePic: true, role: true },
          });

          return { user: otherUser, lastMessage, unreadCount };
        })
      );

      conversations.sort((a, b) => {
        const timeA = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0;
        const timeB = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0;
        return timeB - timeA;
      });

      res.status(200).json({ success: true, conversations });
    } catch (error) {
      next(error);
    }
  },

  getUnreadCount: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const unreadCount = await prisma.message.count({
        where: { receiverId: userId, isRead: false },
      });
      res.status(200).json({ success: true, unreadCount });
    } catch (error) {
      next(error);
    }
  },

  markAsRead: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { senderId } = req.params;

      await prisma.message.updateMany({
        where: { senderId, receiverId: userId, isRead: false },
        data: { isRead: true },
      });

      res.status(200).json({ success: true, message: "Messages marked as read" });
    } catch (error) {
      next(error);
    }
  },

  deleteMessage: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { messageId } = req.params;

      const message = await prisma.message.findUnique({ where: { id: messageId } });
      if (!message) return next(createError(404, "Message not found"));
      if (message.senderId !== userId) {
        return next(createError(403, "You can only delete your own messages"));
      }

      await prisma.message.delete({ where: { id: messageId } });
      res.status(200).json({ success: true, message: "Message deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
};
