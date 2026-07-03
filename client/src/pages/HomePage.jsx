import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { motion } from "framer-motion";
import {
  Briefcase,
  Search,
  MapPin,
  Users,
  Building2,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

const HomePage = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/jobs?keyword=${keyword}`);
    } else {
      navigate("/jobs");
    }
  };

  const stats = [
    { icon: Briefcase, label: "Jobs Posted", value: "10,000+" },
    { icon: Users, label: "Job Seekers", value: "50,000+" },
    { icon: Building2, label: "Companies", value: "2,000+" },
    { icon: TrendingUp, label: "Placements", value: "8,000+" },
  ];

  const categories = [
    { label: "Technology", icon: "💻", count: "2,400 jobs" },
    { label: "Marketing", icon: "📢", count: "1,200 jobs" },
    { label: "Finance", icon: "💰", count: "800 jobs" },
    { label: "Healthcare", icon: "🏥", count: "1,500 jobs" },
    { label: "Education", icon: "📚", count: "600 jobs" },
    { label: "Design", icon: "🎨", count: "900 jobs" },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Find Your Dream
              <span className="text-yellow-400"> Career</span>
            </h1>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Connect with top companies and discover opportunities that match
              your skills and ambitions.
            </p>

            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto"
            >
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Job title, keyword, or company..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="pl-10 h-12 text-gray-900 bg-white border-0 text-base"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-12 px-8 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold"
              >
                Search Jobs
              </Button>
            </form>

            <p className="mt-4 text-blue-200 text-sm">
              Popular: React Developer, Node.js, Product Manager, UI Designer
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-gray-500 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Categories */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-gray-500 text-lg">
              Explore jobs in your field of expertise
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                onClick={() =>
                  navigate(`/jobs?keyword=${category.label}`)
                }
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 cursor-pointer transition-all group"
              >
                <div className="text-3xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {category.label}
                </h3>
                <p className="text-gray-500 text-sm mt-1">{category.count}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Take the Next Step?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who found their dream jobs through
              CareerConnect.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8"
                onClick={() => navigate("/register")}
              >
                Get Started Free
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-blue-700 px-8"
                onClick={() => navigate("/jobs")}
              >
                Browse Jobs
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4 text-center">
        <div className="flex items-center justify-center space-x-2 text-white mb-3">
          <Briefcase className="w-5 h-5" />
          <span className="font-bold text-lg">CareerConnect</span>
        </div>
        <p className="text-sm">
          © 2026 CareerConnect. Built with MERN Stack.
        </p>
      </footer>
    </Layout>
  );
};

export default HomePage;