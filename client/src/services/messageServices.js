import axiosInstance from "@/lib/axiosInstance";

// Send a message
export const sendMessage = async (messageData) => {
  const response = await axiosInstance.post("/messages/send", messageData);
  return response.data;
};

export const sendMessageWithAttachment = async (payload) => {
  const formData = new FormData();
  if (payload.receiverId) formData.append("receiverId", payload.receiverId);
  if (payload.message) formData.append("message", payload.message);
  if (payload.relatedTo) formData.append("relatedTo", payload.relatedTo);
  if (payload.relatedId) formData.append("relatedId", payload.relatedId);
  if (payload.attachment) formData.append("attachment", payload.attachment);

  const response = await axiosInstance.post("/messages/send", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Get conversation with a specific user
export const getConversation = async (otherUserId) => {
  const response = await axiosInstance.get(`/messages/conversation/${otherUserId}`);
  return response.data;
};

// Get all conversations
export const getAllConversations = async () => {
  const response = await axiosInstance.get("/messages/conversations");
  return response.data;
};

// Get unread message count
export const getUnreadCount = async () => {
  const response = await axiosInstance.get("/messages/unread-count");
  return response.data;
};

export const getInboxMessages = async () => {
  const response = await axiosInstance.get("/messages/inbox");
  return response.data;
};

export const getSentMessages = async () => {
  const response = await axiosInstance.get("/messages/sent");
  return response.data;
};

export const getArchivedMessages = async () => {
  const response = await axiosInstance.get("/messages/archived");
  return response.data;
};

export const archiveMessage = async (messageId) => {
  const response = await axiosInstance.patch(`/messages/${messageId}/archive`);
  return response.data;
};

// Mark messages as read
export const markAsRead = async (senderId) => {
  const response = await axiosInstance.patch(`/messages/mark-read/${senderId}`);
  return response.data;
};

// Delete a message
export const deleteMessage = async (messageId) => {
  const response = await axiosInstance.delete(`/messages/${messageId}`);
  return response.data;
};
