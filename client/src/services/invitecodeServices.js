import axiosInstance from "@/lib/axiosInstance";

const BASE_URL = "/invitecode";

export const generateInviteCode = async ({ email, role }) => {
  const { data } = await axiosInstance.post(`${BASE_URL}/generate`, {
    email,
    role,
  });
  return data;
};

export const verifyInviteCode = async (inviteCode) => {
  const { data } = await axiosInstance.post(`${BASE_URL}/verify`, {
    inviteCode,
  });
  return data;
};
