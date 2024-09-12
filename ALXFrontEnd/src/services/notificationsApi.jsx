import axiosClient from "@/api/axios";

export const ApigetNotifications = async () => {
  return await axiosClient.get("/notifications");
};

export const ApideleteNotification = async (id) => {
  return await axiosClient.delete(`/notifications/${id}`);
};

export const ApiMarkNotificationAsRead = async () => {
  return await axiosClient.post(`/notifications/mark-all-as-read`);
};
