import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import JobCard from "../components/JobCard";
import { jobAPI } from "../services/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Search, Filter, Loader2, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter states
  const [filters, setFilters] = useState({
    keyword: searchParams.get("keyword") || "",
    location: "",
    jobType: "",
    experience: "",
  });

  // Fetch jobs whenever filters or page change
  useEffect(() => {
    fetchJobs();
  }, [page]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (filters.keyword) params.keyword = filters.keyword;
      if (filters.location) params.location = filters.location;
      if (filters.jobType) params.jobType = filters.jobType;
      if (filters.experience) params.experience = filters.experience;

      const response = await jobAPI.getAllJobs(params);
      setJobs(response.data.jobs);
      setTotal(response.data.total);
      setPages(response.data.pages);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    setFilters({ keyword: "", location: "", jobType: "", experience: "" });
    setPage(1);
    setTimeout(fetchJobs, 100);
  };

  const jobTypes = [
    { value: "", label: "All Types" },
    { value: "full-time", label: "Full Time" },
    { value: "part-time", label: "Part Time" },
    { value: "remote", label: "Remote" },
    { value: "internship", label: "Internship" },
    { value: "contract", label: "Contract" },
  ];

  const experienceLevels = [
    { value: "", label: "All Levels" },
    { value: "entry", label: "Entry Level" },
    { value: "mid", label: "Mid Level" },
    { value: "senior", label: "Senior Level" },
    { value: "lead", label: "Lead" },
  ];

  return (
    <Layout>
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Find Your Perfect Job</h1>
          <p className="text-blue-100">
            {total > 0 ? `${total} jobs available` : "Search from thousands of jobs"}
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-3 mt-6 max-w-3xl"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Job title, keyword, or company..."
                value={filters.keyword}
                onChange={(e) => handleFilterChange("keyword", e.target.value)}
                className="pl-10 h-12 text-gray-900 bg-white border-0"
              />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Location..."
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                className="pl-10 h-12 text-gray-900 bg-white border-0 w-full sm:w-48"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="h-12 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold"
            >
              Search
            </Button>
          </form>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Clear all
                </button>
              </div>

              {/* Job Type Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Job Type
                </h4>
                <div className="space-y-2">
                  {jobTypes.map((type) => (
                    <label
                      key={type.value}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="jobType"
                        value={type.value}
                        checked={filters.jobType === type.value}
                        onChange={(e) =>
                          handleFilterChange("jobType", e.target.value)
                        }
                        className="text-blue-600"
                      />
                      <span className="text-sm text-gray-600">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Experience Level
                </h4>
                <div className="space-y-2">
                  {experienceLevels.map((level) => (
                    <label
                      key={level.value}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="experience"
                        value={level.value}
                        checked={filters.experience === level.value}
                        onChange={(e) =>
                          handleFilterChange("experience", e.target.value)
                        }
                        className="text-blue-600"
                      />
                      <span className="text-sm text-gray-600">{level.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => { setPage(1); fetchJobs(); }}
                className="w-full"
                size="sm"
              >
                Apply Filters
              </Button>
            </div>
          </div>

          {/* Jobs List */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-20">
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-500 mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-400">
                  Try adjusting your search or filters
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-gray-600">
                    Showing{" "}
                    <span className="font-semibold">{jobs.length}</span> of{" "}
                    <span className="font-semibold">{total}</span> jobs
                  </p>
                </div>

                {/* Job Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {jobs.map((job) => (
                    <JobCard key={job._id} job={job} />
                  ))}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                      <Button
                        key={p}
                        variant={page === p ? "default" : "outline"}
                        onClick={() => setPage(p)}
                        className="w-10"
                      >
                        {p}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => setPage(page + 1)}
                      disabled={page === pages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default JobsPage;