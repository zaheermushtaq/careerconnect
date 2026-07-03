import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { connectionAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  UserX,
  Loader2,
  UserPlus,
} from "lucide-react";

const NetworkPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [connections, setConnections] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("connections");
  const [responding, setResponding] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [connectionsRes, requestsRes] = await Promise.all([
        connectionAPI.getMyConnections(),
        connectionAPI.getRequests(),
      ]);
      setConnections(connectionsRes.data.connections);
      setRequests(requestsRes.data.requests);
    } catch (error) {
      toast.error("Failed to load network data");
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (connectionId, status) => {
    setResponding(connectionId);
    try {
      await connectionAPI.respondToRequest(connectionId, { status });
      toast.success(
        status === "accepted"
          ? "Connection accepted!"
          : "Request declined"
      );
      fetchData();
    } catch (error) {
      toast.error("Failed to respond to request");
    } finally {
      setResponding(null);
    }
  };

  const handleRemove = async (connectionId) => {
    try {
      await connectionAPI.removeConnection(connectionId);
      toast.success("Connection removed");
      fetchData();
    } catch (error) {
      toast.error("Failed to remove connection");
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Network</h1>
          <p className="text-gray-500 mt-1">
            Manage your professional connections
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm text-center">
            <p className="text-3xl font-bold text-blue-600">
              {connections.length}
            </p>
            <p className="text-gray-500 text-sm mt-1">Connections</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm text-center">
            <p className="text-3xl font-bold text-yellow-500">
              {requests.length}
            </p>
            <p className="text-gray-500 text-sm mt-1">Pending Requests</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
          <button
            onClick={() => setActiveTab("connections")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === "connections"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Connections ({connections.length})
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === "requests"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Requests ({requests.length})
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : activeTab === "connections" ? (
          // Connections Tab
          <div>
            {connections.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-16 text-center shadow-sm">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">
                  No connections yet
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Start connecting with other professionals
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {connections.map((connection) => (
                  <motion.div
                    key={connection.connectionId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div
                        className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg cursor-pointer"
                        onClick={() =>
                          navigate(
                            `/profile/${connection.connectedUser._id}`
                          )
                        }
                      >
                        {connection.connectedUser.profilePicture ? (
                          <img
                            src={connection.connectedUser.profilePicture}
                            alt={connection.connectedUser.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          connection.connectedUser.name?.[0]?.toUpperCase()
                        )}
                      </div>
                      <div className="flex-1">
                        <p
                          className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer"
                          onClick={() =>
                            navigate(
                              `/profile/${connection.connectedUser._id}`
                            )
                          }
                        >
                          {connection.connectedUser.name}
                        </p>
                        <p className="text-sm text-gray-500 capitalize">
                          {connection.connectedUser.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() =>
                          navigate(
                            `/profile/${connection.connectedUser._id}`
                          )
                        }
                      >
                        View Profile
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() =>
                          handleRemove(connection.connectionId)
                        }
                      >
                        <UserX className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Requests Tab
          <div>
            {requests.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-16 text-center shadow-sm">
                <UserPlus className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">
                  No pending requests
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  You are all caught up!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <motion.div
                    key={request._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg cursor-pointer"
                          onClick={() =>
                            navigate(`/profile/${request.sender._id}`)
                          }
                        >
                          {request.sender.profilePicture ? (
                            <img
                              src={request.sender.profilePicture}
                              alt={request.sender.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            request.sender.name?.[0]?.toUpperCase()
                          )}
                        </div>
                        <div>
                          <p
                            className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer"
                            onClick={() =>
                              navigate(`/profile/${request.sender._id}`)
                            }
                          >
                            {request.sender.name}
                          </p>
                          <p className="text-sm text-gray-500 capitalize">
                            {request.sender.role}
                          </p>
                          {request.sender.bio && (
                            <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                              {request.sender.bio}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            handleRespond(request._id, "accepted")
                          }
                          disabled={responding === request._id}
                        >
                          {responding === request._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <UserCheck className="w-4 h-4 mr-1" />
                              Accept
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleRespond(request._id, "rejected")
                          }
                          disabled={responding === request._id}
                          className="text-red-500 hover:text-red-700 border-red-200"
                        >
                          <UserX className="w-4 h-4 mr-1" />
                          Decline
                        </Button>
                      </div>
                    </div>
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

export default NetworkPage;