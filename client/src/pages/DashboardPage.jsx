import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { applicationAPI, jobAPI } from "../services/api";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Briefcase,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Star,
  Loader2,
  Plus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const DashboardPage = () => {
  const { user, isRecruiter, isJobSeeker } = useAuth();
  const navigate = useNavigate();

  const [myApplications, setMyApplications] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [jobApplications, setJobApplications] = useState([]);
  const [expandedJob, setExpandedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    if (isJobSeeker) {
      fetchMyApplications();
    } else if (isRecruiter) {
      fetchMyJobs();
    }
  }, [isJobSeeker, isRecruiter]);

  const fetchMyApplications = async () => {
    setLoading(true);
    try {
      const response = await applicationAPI.getMyApplications();
      setMyApplications(response.data.applications);
    } catch (error) {
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyJobs = async () => {
    setLoading(true);
    try {
      const response = await jobAPI.getMyJobs();
      setMyJobs(response.data.jobs);
    } catch (error) {
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const fetchJobApplications = async (jobId) => {
    try {
      const response = await applicationAPI.getJobApplications(jobId);
      setJobApplications(response.data.applications);
    } catch (error) {
      toast.error("Failed to load applications");
    }
  };

  const handleExpandJob = async (jobId) => {
    if (expandedJob === jobId) {
      setExpandedJob(null);
      setJobApplications([]);
    } else {
      setExpandedJob(jobId);
      await fetchJobApplications(jobId);
    }
  };

  const handleUpdateStatus = async (applicationId, status) => {
    setUpdatingStatus(applicationId);
    try {
      await applicationAPI.updateStatus(applicationId, { status });
      toast.success(`Application marked as ${status}`);
      if (expandedJob) {
        await fetchJobApplications(expandedJob);
      }
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await jobAPI.deleteJob(jobId);
      toast.success("Job deleted successfully");
      fetchMyJobs();
    } catch (error) {
      toast.error("Failed to delete job");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-700",
      reviewing: "bg-blue-100 text-blue-700",
      shortlisted: "bg-purple-100 text-purple-700",
      rejected: "bg-red-100 text-red-700",
      hired: "bg-green-100 text-green-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="w-4 h-4" />,
      reviewing: <Eye className="w-4 h-4" />,
      shortlisted: <Star className="w-4 h-4" />,
      rejected: <XCircle className="w-4 h-4" />,
      hired: <CheckCircle className="w-4 h-4" />,
    };
    return icons[status] || <Clock className="w-4 h-4" />;
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffInDays = Math.floor((now - posted) / (1000 * 60 * 60 * 24));
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return `${Math.floor(diffInDays / 7)} weeks ago`;
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-500 mt-1 capitalize">
            {user?.role} Dashboard
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : isJobSeeker ? (
          <div>
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                {
                  label: "Total Applied",
                  value: myApplications.length,
                },
                {
                  label: "Pending",
                  value: myApplications.filter(
                    (a) => a.status === "pending"
                  ).length,
                },
                {
                  label: "Shortlisted",
                  value: myApplications.filter(
                    (a) => a.status === "shortlisted"
                  ).length,
                },
                {
                  label: "Hired",
                  value: myApplications.filter(
                    (a) => a.status === "hired"
                  ).length,
                },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm text-center"
                >
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Applications List */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">
                  My Applications
                </h2>
              </div>

              {myApplications.length === 0 ? (
                <div className="text-center py-16">
                  <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">
                    No applications yet
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Start applying to jobs to track them here
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => navigate("/jobs")}
                  >
                    Browse Jobs
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {myApplications.map((application) => (
                    <motion.div
                      key={application._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3
                            className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer"
                            onClick={() =>
                              navigate(`/jobs/${application.job?._id}`)
                            }
                          >
                            {application.job?.title || "Job Title"}
                          </h3>
                          <p className="text-gray-500 text-sm mt-1">
                            {application.job?.company} •{" "}
                            {application.job?.location}
                          </p>
                          <p className="text-gray-400 text-xs mt-1">
                            Applied {getTimeAgo(application.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {getStatusIcon(application.status)}
                          <span
                            className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${getStatusColor(
                              application.status
                            )}`}
                          >
                            {application.status}
                          </span>
                        </div>
                      </div>
                      {application.coverLetter && (
                        <p className="text-gray-400 text-sm mt-3 line-clamp-2 italic">
                          "{application.coverLetter}"
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {[
                {
                  label: "Jobs Posted",
                  value: myJobs.length,
                  icon: Briefcase,
                },
                {
                  label: "Active Jobs",
                  value: myJobs.filter((j) => j.isActive).length,
                  icon: CheckCircle,
                },
                {
                  label: "Total Openings",
                  value: myJobs.reduce((sum, j) => sum + j.openings, 0),
                  icon: Users,
                },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Post New Job Button */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                My Job Postings
              </h2>
              <Button onClick={() => navigate("/post-job")}>
                <Plus className="w-4 h-4 mr-2" />
                Post New Job
              </Button>
            </div>

            {/* Jobs List */}
            {myJobs.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-16 text-center shadow-sm">
                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">
                  No jobs posted yet
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Post your first job to start receiving applications
                </p>
                <Button
                  className="mt-4"
                  onClick={() => navigate("/post-job")}
                >
                  Post a Job
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {myJobs.map((job) => (
                  <motion.div
                    key={job._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-semibold text-gray-900 text-lg">
                              {job.title}
                            </h3>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                job.isActive
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {job.isActive ? "Active" : "Closed"}
                            </span>
                          </div>
                          <p className="text-gray-500 text-sm mt-1">
                            {job.company} • {job.location} •{" "}
                            {job.openings} opening(s)
                          </p>
                          <p className="text-gray-400 text-xs mt-1">
                            Posted {getTimeAgo(job.createdAt)}
                          </p>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExpandJob(job._id)}
                          >
                            {expandedJob === job._id ? (
                              <>
                                <ChevronUp className="w-4 h-4 mr-1" />
                                Hide
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-4 h-4 mr-1" />
                                Applications
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/jobs/${job._id}`)}
                          >
                            View
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteJob(job._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Applications Expandable Section */}
                    {expandedJob === job._id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="border-t border-gray-100"
                      >
                        {jobApplications.length === 0 ? (
                          <div className="p-6 text-center text-gray-400">
                            <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                            <p>No applications yet for this job</p>
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-100">
                            <div className="px-6 py-3 bg-gray-50">
                              <p className="text-sm font-medium text-gray-600">
                                {jobApplications.length} application(s)
                              </p>
                            </div>
                            {jobApplications.map((application) => (
                              <div key={application._id} className="p-6">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                                      {application.applicant?.name?.[0]?.toUpperCase()}
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-900">
                                        {application.applicant?.name}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        {application.applicant?.email}
                                      </p>
                                      {application.applicant?.skills
                                        ?.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {application.applicant.skills
                                            .slice(0, 3)
                                            .map((skill) => (
                                              <span
                                                key={skill}
                                                className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                                              >
                                                {skill}
                                              </span>
                                            ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-center space-x-2 ml-4">
                                    <span
                                      className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${getStatusColor(
                                        application.status
                                      )}`}
                                    >
                                      {application.status}
                                    </span>
                                    <select
                                      value={application.status}
                                      onChange={(e) =>
                                        handleUpdateStatus(
                                          application._id,
                                          e.target.value
                                        )
                                      }
                                      disabled={
                                        updatingStatus === application._id
                                      }
                                      className="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                      <option value="pending">Pending</option>
                                      <option value="reviewing">
                                        Reviewing
                                      </option>
                                      <option value="shortlisted">
                                        Shortlisted
                                      </option>
                                      <option value="rejected">Rejected</option>
                                      <option value="hired">Hired</option>
                                    </select>
                                    {updatingStatus === application._id && (
                                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                                    )}
                                  </div>
                                </div>

                                {application.coverLetter && (
                                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-400 mb-1">
                                      Cover Letter:
                                    </p>
                                    <p className="text-sm text-gray-600 italic">
                                      "{application.coverLetter}"
                                    </p>
                                  </div>
                                )}

                                {application.resume && (
                                  <a
                                    href={application.resume}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-block mt-2 text-xs text-blue-600 hover:underline"
                                  >
                                    View Resume →
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DashboardPage;