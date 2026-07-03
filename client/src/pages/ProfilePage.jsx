import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { userAPI, connectionAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  MapPin,
  Mail,
  Briefcase,
  Edit,
  UserPlus,
  UserCheck,
  UserX,
  Loader2,
  FileText,
  Link,
} from "lucide-react";

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState("not_connected");
  const [connectionId, setConnectionId] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    bio: "",
    skills: "",
  });

  const isOwnProfile = currentUser?._id === id;

  useEffect(() => {
    fetchProfile();
    if (!isOwnProfile) {
      fetchConnectionStatus();
    }
  }, [id]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getProfile(id);
      setProfile(response.data.user);
      setEditData({
        name: response.data.user.name || "",
        bio: response.data.user.bio || "",
        skills: response.data.user.skills?.join(", ") || "",
      });
    } catch (error) {
      toast.error("Failed to load profile");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const fetchConnectionStatus = async () => {
    try {
      const response = await connectionAPI.getStatus(id);
      setConnectionStatus(response.data.status);
      setConnectionId(response.data.connectionId);
    } catch (error) {
      console.error("Failed to fetch connection status");
    }
  };

  const handleConnect = async () => {
    setConnecting(true);
    try {
      await connectionAPI.sendRequest(id);
      setConnectionStatus("pending");
      toast.success("Connection request sent!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send request"
      );
    } finally {
      setConnecting(false);
    }
  };

  const handleRemoveConnection = async () => {
    setConnecting(true);
    try {
      await connectionAPI.removeConnection(connectionId);
      setConnectionStatus("not_connected");
      setConnectionId(null);
      toast.success("Connection removed");
    } catch (error) {
      toast.error("Failed to remove connection");
    } finally {
      setConnecting(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await userAPI.updateProfile(editData);
      setProfile(response.data.user);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const renderConnectionButton = () => {
    if (isOwnProfile) return null;

    if (connectionStatus === "not_connected") {
      return (
        <Button onClick={handleConnect} disabled={connecting}>
          {connecting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <UserPlus className="w-4 h-4 mr-2" />
          )}
          Connect
        </Button>
      );
    }

    if (connectionStatus === "pending") {
      return (
        <Button variant="outline" disabled>
          <UserCheck className="w-4 h-4 mr-2" />
          Request Pending
        </Button>
      );
    }

    if (connectionStatus === "accepted") {
      return (
        <Button
          variant="outline"
          onClick={handleRemoveConnection}
          disabled={connecting}
        >
          <UserX className="w-4 h-4 mr-2" />
          Remove Connection
        </Button>
      );
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

  if (!profile) return null;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6"
        >
          {/* Cover */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700" />

          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-12 mb-4">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full border-4 border-white bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold shadow-md">
                {profile.profilePicture ? (
                  <img
                    src={profile.profilePicture}
                    alt={profile.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  profile.name?.[0]?.toUpperCase()
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-12">
                {isOwnProfile ? (
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                ) : (
                  renderConnectionButton()
                )}
              </div>
            </div>

            {/* Profile Info */}
            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    value={editData.bio}
                    onChange={(e) =>
                      setEditData({ ...editData, bio: e.target.value })
                    }
                    rows={3}
                    placeholder="Tell people about yourself..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    value={editData.skills}
                    onChange={(e) =>
                      setEditData({ ...editData, skills: e.target.value })
                    }
                    placeholder="React, Node.js, MongoDB..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex space-x-3">
                  <Button type="submit">Save Changes</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-gray-900">
                  {profile.name}
                </h1>
                <div className="flex items-center space-x-4 mt-2 text-gray-500 text-sm">
                  <div className="flex items-center space-x-1">
                    <Mail className="w-4 h-4" />
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Briefcase className="w-4 h-4" />
                    <span className="capitalize">{profile.role}</span>
                  </div>
                </div>
                {profile.bio && (
                  <p className="text-gray-600 mt-3">{profile.bio}</p>
                )}
              </>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Skills Card */}
            {profile.skills && profile.skills.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
              >
                <h3 className="font-semibold text-gray-900 mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full border border-blue-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Resume Card */}
            {profile.resume && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
              >
                <h3 className="font-semibold text-gray-900 mb-3">Resume</h3>
                <a
                  href={profile.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-2 text-blue-600 hover:underline text-sm"
                >
                  <FileText className="w-4 h-4" />
                  <span>View Resume</span>
                </a>
              </motion.div>
            )}
          </div>

          {/* Right Column */}
          <div className="md:col-span-2 space-y-6">
            {/* About Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
            >
              <h3 className="font-semibold text-gray-900 mb-3">About</h3>
              {profile.bio ? (
                <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
              ) : (
                <p className="text-gray-400 italic">
                  {isOwnProfile
                    ? "Add a bio to tell people about yourself"
                    : "No bio added yet"}
                </p>
              )}
            </motion.div>

            {/* Connection Status Card */}
            {!isOwnProfile && connectionStatus === "accepted" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-green-50 rounded-xl border border-green-200 p-5"
              >
                <div className="flex items-center space-x-2 text-green-700">
                  <UserCheck className="w-5 h-5" />
                  <p className="font-medium">
                    You are connected with {profile.name}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;