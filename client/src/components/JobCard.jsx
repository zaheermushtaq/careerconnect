import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  Building2,
} from "lucide-react";
import { Button } from "./ui/button";

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  // Format salary range nicely
  const formatSalary = (salary) => {
    if (!salary || (!salary.min && !salary.max)) return "Salary not specified";
    if (salary.min && salary.max) {
      return `${salary.currency} ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`;
    }
    return `${salary.currency} ${(salary.min || salary.max).toLocaleString()}`;
  };

  // Format job type nicely
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

  // Color for job type badge
  const getJobTypeColor = (type) => {
    const colors = {
      "full-time": "bg-green-100 text-green-700",
      "part-time": "bg-yellow-100 text-yellow-700",
      remote: "bg-blue-100 text-blue-700",
      internship: "bg-purple-100 text-purple-700",
      contract: "bg-orange-100 text-orange-700",
    };
    return colors[type] || "bg-gray-100 text-gray-700";
  };

  // How long ago was the job posted
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
      onClick={() => navigate(`/jobs/${job._id}`)}
    >
      {/* Top row — company info and job type badge */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          {/* Company logo or placeholder */}
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Building2 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">{job.company}</p>
            <p className="text-xs text-gray-400">
              {job.postedBy?.name || "Recruiter"}
            </p>
          </div>
        </div>
        {/* Job type badge */}
        <span
          className={`text-xs font-medium px-3 py-1 rounded-full ${getJobTypeColor(job.jobType)}`}
        >
          {formatJobType(job.jobType)}
        </span>
      </div>

      {/* Job title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
        {job.title}
      </h3>

      {/* Job details row */}
      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
        <div className="flex items-center space-x-1">
          <MapPin className="w-4 h-4" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center space-x-1">
          <DollarSign className="w-4 h-4" />
          <span>{formatSalary(job.salary)}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Briefcase className="w-4 h-4" />
          <span className="capitalize">{job.experience} level</span>
        </div>
      </div>

      {/* Skills */}
      {job.skills && job.skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {job.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 4 && (
            <span className="text-xs text-gray-400">
              +{job.skills.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Bottom row — time and apply button */}
      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-1 text-xs text-gray-400">
          <Clock className="w-3 h-3" />
          <span>{getTimeAgo(job.createdAt)}</span>
        </div>
        <Button
          size="sm"
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click
            navigate(`/jobs/${job._id}`);
          }}
        >
          View Job
        </Button>
      </div>
    </motion.div>
  );
};

export default JobCard;