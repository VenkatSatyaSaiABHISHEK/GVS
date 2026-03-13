import axiosInstance from "@/lib/axiosInstance";

const BASE_URL = "/jobs";

// Fetch all jobs
export const fetchJobs = async (filters) => {
  const { data } = await axiosInstance.get(`${BASE_URL}/get-all`, {
    params: filters,
  });
  return data;
};

// Fetch single job by ID
export const fetchJobById = async (jobId) => {
  const { data } = await axiosInstance.get(`${BASE_URL}/${jobId}/job-data`);
  return data;
};
/* ================= FOR ONLY SCHOOL ============================= */
// Create new job
export const createJob = async (jobData) => {
  const { data } = await axiosInstance.post(`${BASE_URL}/create`, jobData);
  return data;
};

// Update job by ID
export const updateJob = async (jobId, jobData) => {
  const { data } = await axiosInstance.put(
    `${BASE_URL}/${jobId}/update`,
    jobData
  );
  return data;
};

// Delete job by ID
export const deleteJob = async (jobId) => {
  const { data } = await axiosInstance.delete(`${BASE_URL}/${jobId}/delete`);
  return data;
};

export const getSchoolJobs = async (filters) => {
  const { data } = await axiosInstance.get(`${BASE_URL}/get-recruiter-jobs`, {
    params: filters,
  });
  return data;
};

/* BOTH ROLE */
/* export const bookmarkJob = async (jobId) => {
  const { data } = await axiosInstance.post(
    `${BASE_URL}/${jobId}/bookmark-job`
  );
  return data;
};
 */
