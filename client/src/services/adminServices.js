import axiosInstance from "@/lib/axiosInstance";

export const getAdminStats = async () => {
    const { data } = await axiosInstance.get("/admin/dashboard/stats");
    return data;
};

export const getAllUsers = async (role = null) => {
    const params = {};
    if (role) params.role = role;
    const { data } = await axiosInstance.get("/admin/users", { params });
    return data;
};

export const verifyUser = async (id, isVerified) => {
    const { data } = await axiosInstance.patch(`/admin/users/${id}/status`, { isVerified });
    return data;
};

export const blockUser = async (id, isBlocked) => {
    const { data } = await axiosInstance.patch(`/admin/users/${id}/status`, { isBlocked });
    return data;
};

export const getAllPayments = async () => {
    // Payments endpoint not yet implemented
    return { payments: [] };
};
