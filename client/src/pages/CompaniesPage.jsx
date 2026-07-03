import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { companyAPI } from "../services/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Building2,
  Search,
  MapPin,
  Users,
  Globe,
  Loader2,
} from "lucide-react";

const CompaniesPage = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await companyAPI.getAllCompanies();
      setCompanies(response.data.companies);
    } catch (error) {
      toast.error("Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(keyword.toLowerCase()) ||
      company.industry?.toLowerCase().includes(keyword.toLowerCase()) ||
      company.location?.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <Layout>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Explore Companies</h1>
          <p className="text-blue-100 mb-6">
            Discover top companies and their opportunities
          </p>
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by company name, industry, or location..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="pl-10 h-12 text-gray-900 bg-white border-0"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="text-center py-20">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">
              No companies found
            </h3>
            <p className="text-gray-400">Try a different search term</p>
          </div>
        ) : (
          <>
            <p className="text-gray-500 mb-6">
              Showing{" "}
              <span className="font-semibold">{filteredCompanies.length}</span>{" "}
              companies
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanies.map((company, index) => (
                <motion.div
                  key={company._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
                  onClick={() => navigate(`/companies/${company._id}`)}
                >
                  {/* Company Logo */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                      {company.logo ? (
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="w-full h-full rounded-xl object-cover"
                        />
                      ) : (
                        <Building2 className="w-7 h-7 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {company.name}
                      </h3>
                      {company.industry && (
                        <p className="text-sm text-gray-500">
                          {company.industry}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Company Details */}
                  <div className="space-y-2 mb-4">
                    {company.location && (
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span>{company.location}</span>
                      </div>
                    )}
                    {company.size && (
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Users className="w-4 h-4" />
                        <span>{company.size} employees</span>
                      </div>
                    )}
                    {company.website && (
                      <div className="flex items-center space-x-2 text-sm text-blue-500">
                        <Globe className="w-4 h-4" />
                        <span className="truncate">{company.website}</span>
                      </div>
                    )}
                  </div>

                  {company.description && (
                    <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                      {company.description}
                    </p>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/companies/${company._id}`);
                    }}
                  >
                    View Company
                  </Button>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default CompaniesPage;