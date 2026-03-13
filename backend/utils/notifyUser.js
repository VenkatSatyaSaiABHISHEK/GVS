import prisma from "../db/db.js";

export const createUserNotification = async ({
  recipientId,
  actorId = null,
  title,
  message,
  type = "general",
  link = null,
  metadata = null,
}) => {
  if (!recipientId || !title || !message) return null;

  try {
    return await prisma.userNotification.create({
      data: {
        recipientId,
        actorId,
        title,
        message,
        type,
        link,
        metadata,
      },
    });
  } catch (error) {
    console.error("createUserNotification error:", error.message);
    return null;
  }
};
