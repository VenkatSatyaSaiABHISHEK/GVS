import axiosInstance from "@/lib/axiosInstance";

// Get available tutors with filters
export const getAvailableTutors = async (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.subject) params.append("subject", filters.subject);
  if (filters.city) params.append("city", filters.city);
  if (filters.state) params.append("state", filters.state);
  if (filters.minRate) params.append("minRate", filters.minRate);
  if (filters.maxRate) params.append("maxRate", filters.maxRate);
  if (filters.mode) params.append("mode", filters.mode);
  if (filters.qualification) params.append("qualification", filters.qualification);
  if (filters.experience) params.append("experience", filters.experience);
  if (filters.page) params.append("page", filters.page);
  if (filters.limit) params.append("limit", filters.limit);

  const response = await axiosInstance.get(`/tuition/tutors?${params.toString()}`);
  return response.data;
};

// Get tutor details
export const getTutorDetails = async (tutorId) => {
  const response = await axiosInstance.get(`/tuition/tutors/${tutorId}`);
  return response.data;
};

export const compareTutors = async (teacherIds = []) => {
  const response = await axiosInstance.post("/tuition/tutors/compare", { teacherIds });
  return response.data;
};

// Create tuition request (parent)
export const createTuitionRequest = async (requestData) => {
  const response = await axiosInstance.post("/tuition/request", requestData);
  return response.data;
};

// Get parent's tuition requests
export const getParentRequests = async () => {
  const response = await axiosInstance.get("/tuition/my-requests");
  return response.data;
};

// Get teacher's tuition requests
export const getTeacherRequests = async () => {
  const response = await axiosInstance.get("/tuition/teacher/requests");
  return response.data;
};

// Update tuition request status (teacher)
export const updateRequestStatus = async (requestId, status, startDate = null) => {
  const response = await axiosInstance.patch(
    `/tuition/teacher/request/${requestId}/status`,
    { status, startDate }
  );
  return response.data;
};

// Cancel tuition request (parent)
export const cancelRequest = async (requestId) => {
  const response = await axiosInstance.patch(`/tuition/request/${requestId}/cancel`);
  return response.data;
};

// Get parent dashboard data
export const getParentDashboard = async () => {
  const response = await axiosInstance.get("/tuition/dashboard");
  return response.data;
};

// Aliases for backward compatibility
export const getTutors = getAvailableTutors;
export const getParentDashboardData = getParentDashboard;
export const getMyTuitionRequests = getParentRequests;
export const sendTuitionRequest = createTuitionRequest;

// Get jobs for teacher (actual API call)
export const getJobsForTeacher = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.subject) params.append("title", filters.subject);
  if (filters.location) params.append("location", filters.location);
  if (filters.jobType) params.append("jobType", filters.jobType);
  if (filters.experience) params.append("experience", filters.experience);
  if (filters.sortBy) {
    if (filters.sortBy === "newest") {
      params.append("sortBy", "postedAt");
      params.append("sortOrder", "desc");
    } else if (filters.sortBy === "oldest") {
      params.append("sortBy", "postedAt");
      params.append("sortOrder", "asc");
    }
  }
  params.append("limit", filters.limit || "20");
  if (filters.cursor) params.append("cursor", filters.cursor);

  const response = await axiosInstance.get(`/jobs/get-all?${params.toString()}`);
  return { success: true, jobs: response.data.jobs || [], nextCursor: response.data.nextCursor };
};

export const getEarningsDashboard = async () => {
  console.warn("getEarningsDashboard not yet implemented");
  return { success: true, earnings: { total: 0, thisMonth: 0, pending: 0 } };
};

export const getActiveStudents = async () => {
  console.warn("getActiveStudents not yet implemented");
  return { success: true, students: [] };
};

export const updateActiveStudentStatus = async () => {
  console.warn("updateActiveStudentStatus not yet implemented");
  return { success: true };
};

export const getTeacherTuitionDashboardData = async () => {
  console.warn("getTeacherTuitionDashboardData not yet implemented");
  return { success: true, stats: {}, requests: [] };
};

export const updateTuitionRequestStatus = updateRequestStatus;

export const getTeacherNotifications = async () => {
  console.warn("getTeacherNotifications not yet implemented");
  return { success: true, notifications: [] };
};

export const markNotificationAsRead = async () => {
  console.warn("markNotificationAsRead not yet implemented");
  return { success: true };
};

export const getDemoClasses = async () => {
  console.warn("getDemoClasses not yet implemented");
  return { success: true, demoClasses: [] };
};

export const updateDemoClassStatus = async () => {
  console.warn("updateDemoClassStatus not yet implemented");
  return { success: true };
};

export const proposeDemoClass = async () => {
  console.warn("proposeDemoClass not yet implemented");
  return { success: true };
};
