import axiosInstance from "@/lib/axiosInstance";

export const getInstitutions = async () => {
    try {
        const response = await axiosInstance.get("/company");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createInstitution = async (data) => {
    try {
        const response = await axiosInstance.post("/company", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateInstitution = async (id, data) => {
    try {
        const response = await axiosInstance.patch(`/company/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteInstitution = async (id) => {
    try {
        const response = await axiosInstance.delete(`/company/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
