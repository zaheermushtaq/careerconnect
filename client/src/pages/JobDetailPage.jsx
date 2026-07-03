import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { jobAPI, applicationAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  MapPin,
  DollarSign,
  Briefcase,
  Clock,
  Users,
  Building2,
  CheckCircle,
  Loader2,
  ArrowLeft,
  Share2,
} from "lucide-react";

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isJobSeeker } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [showApplyForm, setShowApplyForm] = useState(false);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    setLoading(true);
    try {
      const response = await jobAPI.getJobById(id);
      setJob(response.data.job);
    } catch (error) {
      toast.error("Job not found");
      navigate("/jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please login to apply");
      navigate("/login");
      return;
    }
    setApplying(true);
    try {
      await applicationAPI.applyForJob(id, {
        coverLetter,
        resume: user?.resume || "https://example.com/resume.pdf",
      });
      setApplied(true);
      setShowApplyForm(false);
      toast.success("Application submitted successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit application"
      );
    } finally {
      setApplying(false);
    }
  };

  const formatSalary = (salary) => {
    if (!salary || (!salary.min && !salary.max)) return "Not specified";
    if (salary.min && salary.max) {
      return `${salary.currency} ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()} / year`;
    }
    return `${salary.currency} ${(salary.min || salary.max).toLocaleString()} / year`;
  };

  const formatJobType = (type) => {
    const types = {
      "full-time": "Full Time",
      "part-time": "Part Time",
      remote: "Remote",
      internship: "Internship",
      contract: "Contract",
    };
    return types[type] || type;
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffInDays = Math.floor((now - posted) / (1000 * 60 * 60 * 24));
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        </div>
      </Layout>
    );
  }

  if (!job) return null;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/jobs")}
          className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Jobs</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {job.title}
                    </h1>
                    <p className="text-gray-600 font-medium">{job.company}</p>
                    <p className="text-gray-400 text-sm">
                      Posted by {job.postedBy?.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copied!");
                  }}
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* Job Meta Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-b border-gray-100">
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-400">Location</p>
                    <p className="text-sm font-medium">{job.location}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Briefcase className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-400">Job Type</p>
                    <p className="text-sm font-medium">
                      {formatJobType(job.jobType)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <DollarSign className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-400">Salary</p>
                    <p className="text-sm font-medium">
                      {formatSalary(job.salary)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Users className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-400">Openings</p>
                    <p className="text-sm font-medium">{job.openings}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Posted {getTimeAgo(job.createdAt)}</span>
                </div>
                <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full capitalize">
                  {job.experience} level
                </span>
              </div>
            </motion.div>

            {/* Job Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Job Description
              </h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </motion.div>

            {/* Required Skills */}
            {job.skills && job.skills.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Required Skills
                </h2>
                <div className="flex flex-wrap gap-3">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium border border-blue-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Apply Form */}
            {showApplyForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-blue-200 p-6 shadow-sm"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Submit Application
                </h2>
                <form onSubmit={handleApply} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cover Letter (optional)
                    </label>
                    <textarea
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      rows={5}
                      placeholder="Tell the recruiter why you are a great fit for this role..."
                      className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    Your resume from your profile will be attached automatically.
                  </p>
                  <div className="flex space-x-3">
                    <Button type="submit" disabled={applying}>
                      {applying ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Application"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowApplyForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm sticky top-20"
            >
              {applied ? (
                <div className="text-center py-4">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Application Submitted!
                  </h3>
                  <p className="text-gray-500 text-sm">
                    The recruiter will review your application soon.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 w-full"
                    onClick={() => navigate("/dashboard")}
                  >
                    View My Applications
                  </Button>
                </div>
              ) : (
                <>
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Interested in this job?
                  </h3>
                  {isJobSeeker ? (
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={() => setShowApplyForm(!showApplyForm)}
                    >
                      {showApplyForm ? "Hide Form" : "Apply Now"}
                    </Button>
                  ) : !isAuthenticated ? (
                    <div className="space-y-3">
                      <Button
                        className="w-full"
                        onClick={() => navigate("/login")}
                      >
                        Login to Apply
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => navigate("/register")}
                      >
                        Create Account
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center">
                      Recruiters cannot apply for jobs.
                    </p>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Easy apply process</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Track your application</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{job.openings} opening(s) available</span>
                    </div>
                  </div>
                </>
              )}
            </motion.div>

            {/* Company Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
            >
              <h3 className="font-semibold text-gray-900 mb-4">
                About the Company
              </h3>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{job.company}</p>
                  <p className="text-sm text-gray-500">
                    Posted by {job.postedBy?.name}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => navigate("/companies")}
              >
                View Company Profile
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default JobDetailPage;