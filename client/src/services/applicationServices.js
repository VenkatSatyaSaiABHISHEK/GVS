import axiosInstance from "@/lib/axiosInstance";

const BASE = "applications";

// Get all applications by a teacher
export const getUserApplications = async () => {
  const { data } = await axiosInstance.get(`/${BASE}/teacher`);
  return data;
};

// Apply for a job
export const applyForJob = async (jobId) => {
  const { data } = await axiosInstance.post(`/${BASE}/jobs/${jobId}/apply`);
  return data;
};

/* ==================================== */

// For schools
export const getJobApplications = async (jobId) => {
  const { data } = await axiosInstance.get(`/${BASE}/${jobId}/get-job-applications`);
  return data;
};

export const getRecruiterDashboard = async () => {
  const { data } = await axiosInstance.get(`/${BASE}/school`);
  return data;
};

export const getSchoolPipeline = async (params = {}) => {
  const { data } = await axiosInstance.get(`/${BASE}/school/pipeline`, { params });
  return data;
};

export const updateApplicationStatus = async (applicationId, status) => {
  const { data } = await axiosInstance.patch(`/${BASE}/${applicationId}/status`, { status });
  return data;
};

export const scheduleInterview = async (applicationId, payload) => {
  const { data } = await axiosInstance.patch(`/${BASE}/${applicationId}/interview`, payload);
  return data;
};

export const submitInterviewFeedback = async (applicationId, payload) => {
  const { data } = await axiosInstance.patch(`/${BASE}/${applicationId}/interview-feedback`, payload);
  return data;
};

export const sendOfferLetter = async (applicationId, payload) => {
  const { data } = await axiosInstance.patch(`/${BASE}/${applicationId}/offer`, payload);
  return data;
};

export const respondToOffer = async (applicationId, action) => {
  const { data } = await axiosInstance.patch(`/${BASE}/${applicationId}/offer/respond`, { action });
  return data;
};

export const getRecommendedJobsForTeacher = async () => {
  const { data } = await axiosInstance.get(`/${BASE}/teacher/recommended-jobs`);
  return data;
};
