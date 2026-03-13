import axiosInstance from "@/lib/axiosInstance";

export const getMyNotifications = async () => {
  const response = await axiosInstance.get("/notifications/my");
  return response.data;
};

export const markNotificationRead = async (notificationId) => {
  const response = await axiosInstance.patch(`/notifications/${notificationId}/read`);
  return response.data;
};

export const markAllNotificationsRead = async () => {
  const response = await axiosInstance.patch("/notifications/read-all");
  return response.data;
};
