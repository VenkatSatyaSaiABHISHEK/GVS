import express from "express";
import { messageControllers } from "../controllers/message.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { uploadMessageAttachment } from "../config/messageMulter.js";

const router = express.Router();
router.use(protect);

// Send a message
router.post("/send", uploadMessageAttachment.single("attachment"), messageControllers.sendMessage);

router.get("/inbox", messageControllers.getInbox);
router.get("/sent", messageControllers.getSent);
router.get("/archived", messageControllers.getArchived);
router.patch("/:messageId/archive", messageControllers.archiveMessage);

// Get conversation with a specific user
router.get("/conversation/:otherUserId", messageControllers.getConversation);

// Get all conversations
router.get("/conversations", messageControllers.getAllConversations);

// Get unread message count
router.get("/unread-count", messageControllers.getUnreadCount);

// Mark messages as read
router.patch("/mark-read/:senderId", messageControllers.markAsRead);

// Delete a message
router.delete("/:messageId", messageControllers.deleteMessage);

export default router;
