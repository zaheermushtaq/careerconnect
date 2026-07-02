import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, recruiterOnly = false }) => {
  const { isAuthenticated, isRecruiter, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-lg">Loading...</div>
      </div>
    );
  }

  // If not logged in, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If page is recruiter only and user is not a recruiter, redirect to home
  if (recruiterOnly && !isRecruiter) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;