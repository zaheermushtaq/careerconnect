import axios from "axios";

// Create axios instance with base URL pointing to our backend
const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// This runs before every request is sent
// It automatically adds the JWT token to the Authorization header
// So we never have to manually add it in every API call
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  register: (data) => API.post("/auth/register", data),
  login: (data) => API.post("/auth/login", data),
  getMe: () => API.get("/auth/me"),
};

// User endpoints
export const userAPI = {
  getProfile: (id) => API.get(`/users/${id}`),
  updateProfile: (data) => API.put("/users/profile", data),
  updateProfilePicture: (data) => API.put("/users/profile-picture", data),
  updateResume: (data) => API.put("/users/resume", data),
};

// Job endpoints
export const jobAPI = {
  getAllJobs: (params) => API.get("/jobs", { params }),
  getJobById: (id) => API.get(`/jobs/${id}`),
  createJob: (data) => API.post("/jobs", data),
  updateJob: (id, data) => API.put(`/jobs/${id}`, data),
  deleteJob: (id) => API.delete(`/jobs/${id}`),
  getMyJobs: () => API.get("/jobs/recruiter/my-jobs"),
};

// Application endpoints
export const applicationAPI = {
  applyForJob: (jobId, data) => API.post(`/applications/${jobId}`, data),
  getMyApplications: () => API.get("/applications/my-applications"),
  getJobApplications: (jobId) => API.get(`/applications/job/${jobId}`),
  updateStatus: (id, data) => API.put(`/applications/${id}/status`, data),
};

// Connection endpoints
export const connectionAPI = {
  sendRequest: (userId) => API.post(`/connections/send/${userId}`),
  respondToRequest: (connectionId, data) => API.put(`/connections/${connectionId}`, data),
  getRequests: () => API.get("/connections/requests"),
  getMyConnections: () => API.get("/connections"),
  removeConnection: (connectionId) => API.delete(`/connections/${connectionId}`),
  getStatus: (userId) => API.get(`/connections/status/${userId}`),
};

// Company endpoints
export const companyAPI = {
  getAllCompanies: (params) => API.get("/companies", { params }),
  getCompanyById: (id) => API.get(`/companies/${id}`),
  createCompany: (data) => API.post("/companies", data),
  updateCompany: (id, data) => API.put(`/companies/${id}`, data),
  deleteCompany: (id) => API.delete(`/companies/${id}`),
};

// Notification endpoints
export const notificationAPI = {
  getNotifications: () => API.get("/notifications"),
  markAsRead: (id) => API.put(`/notifications/${id}/read`),
  markAllAsRead: () => API.put("/notifications/read-all"),
  deleteNotification: (id) => API.delete(`/notifications/${id}`),
};

export default API;