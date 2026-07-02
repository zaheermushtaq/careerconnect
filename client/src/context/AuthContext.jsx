import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

// Create the context
const AuthContext = createContext();

// This hook lets any component access auth data easily
export const useAuth = () => {
  return useContext(AuthContext);
};

// This wraps the whole app and provides auth data to all children
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // When app loads, check if user is already logged in
  // by reading token from localStorage and fetching user data
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const response = await authAPI.getMe();
          setUser(response.data.user);
        } catch (error) {
          // Token is invalid or expired — clear it
          console.error("Auth error:", error);
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Login function — saves token and user data
  const login = (userData, userToken) => {
    localStorage.setItem("token", userToken);
    setToken(userToken);
    setUser(userData);
  };

  // Logout function — clears everything
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isRecruiter: user?.role === "recruiter",
    isJobSeeker: user?.role === "jobseeker",
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Don't render anything until we know if user is logged in */}
      {!loading && children}
    </AuthContext.Provider>
  );
};