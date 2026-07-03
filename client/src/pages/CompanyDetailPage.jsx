import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { companyAPI } from "../services/api";
import JobCard from "../components/JobCard";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Building2,
  MapPin,
  Users,
  Globe,
  Calendar,
  ArrowLeft,
  Loader2,
} from "lucide-react";

const CompanyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompany();
  }, [id]);

  const fetchCompany = async () => {
    setLoading(true);
    try {
      const response = await companyAPI.getCompanyById(id);
      setCompany(response.data.company);
      setJobs(response.data.jobs);
    } catch (error) {
      toast.error("Company not found");
      navigate("/companies");
    } finally {
      setLoading(false);
    }
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

  if (!company) return null;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/companies")}
          className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Companies</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Company Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-xl flex items-center justify-center">
                  {company.logo ? (
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="w-full h-full rounded-xl object-cover"
                    />
                  ) : (
                    <Building2 className="w-10 h-10 text-blue-600" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {company.name}
                  </h1>
                  {company.industry && (
                    <p className="text-gray-500">{company.industry}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {company.location && (
                  <div className="flex items-center space-x-2 text-gray-500 text-sm">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span>{company.location}</span>
                  </div>
                )}
                {company.size && (
                  <div className="flex items-center space-x-2 text-gray-500 text-sm">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span>{company.size} employees</span>
                  </div>
                )}
                {company.foundedYear && (
                  <div className="flex items-center space-x-2 text-gray-500 text-sm">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span>Founded {company.foundedYear}</span>
                  </div>
                )}
                {company.website && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Globe className="w-4 h-4 text-blue-500" />
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline truncate"
                    >
                      Website
                    </a>
                  </div>
                )}
              </div>
            </motion.div>

            {/* About */}
            {company.description && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  About {company.name}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {company.description}
                </p>
              </motion.div>
            )}

            {/* Jobs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Open Positions ({jobs.length})
              </h2>
              {jobs.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-10 text-center shadow-sm">
                  <p className="text-gray-400">
                    No open positions at the moment
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <JobCard key={job._id} job={job} />
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm sticky top-20"
            >
              <h3 className="font-semibold text-gray-900 mb-4">
                Company Info
              </h3>
              <div className="space-y-3 text-sm">
                {company.industry && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Industry</span>
                    <span className="font-medium text-gray-900">
                      {company.industry}
                    </span>
                  </div>
                )}
                {company.size && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Company Size</span>
                    <span className="font-medium text-gray-900">
                      {company.size}
                    </span>
                  </div>
                )}
                {company.foundedYear && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Founded</span>
                    <span className="font-medium text-gray-900">
                      {company.foundedYear}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Open Jobs</span>
                  <span className="font-medium text-blue-600">
                    {jobs.length}
                  </span>
                </div>
              </div>
              <Button
                className="w-full mt-6"
                onClick={() => navigate("/jobs")}
              >
                Browse All Jobs
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CompanyDetailPage;