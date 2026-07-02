const Connection = require("../models/Connection");
const User = require("../models/User");

// @desc    Send a connection request
// @route   POST /api/connections/send/:userId
// @access  Private
const sendConnectionRequest = async (req, res) => {
  try {
    const receiverId = req.params.userId;
    const senderId = req.user.id;

    // Cannot send request to yourself
    if (senderId === receiverId) {
      return res.status(400).json({
        success: false,
        message: "You cannot send a connection request to yourself",
      });
    }

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if a connection request already exists between these two users
    const existingConnection = await Connection.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    });

    if (existingConnection) {
      if (existingConnection.status === "pending") {
        return res.status(400).json({
          success: false,
          message: "A connection request already exists",
        });
      }
      if (existingConnection.status === "accepted") {
        return res.status(400).json({
          success: false,
          message: "You are already connected with this user",
        });
      }
      // If previously rejected, allow sending again
      if (existingConnection.status === "rejected") {
        existingConnection.status = "pending";
        existingConnection.sender = senderId;
        existingConnection.receiver = receiverId;
        await existingConnection.save();
        return res.status(200).json({
          success: true,
          message: "Connection request sent again",
          connection: existingConnection,
        });
      }
    }

    // Create new connection request
    const connection = await Connection.create({
      sender: senderId,
      receiver: receiverId,
    });

    res.status(201).json({
      success: true,
      message: "Connection request sent successfully",
      connection,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Accept or reject a connection request
// @route   PUT /api/connections/:connectionId
// @access  Private (receiver only)
const respondToRequest = async (req, res) => {
  try {
    const { status } = req.body;

    // Only these two values are allowed
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either accepted or rejected",
      });
    }

    const connection = await Connection.findById(req.params.connectionId);

    if (!connection) {
      return res.status(404).json({
        success: false,
        message: "Connection request not found",
      });
    }

    // Only the receiver can accept or reject
    if (connection.receiver.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Only the receiver can respond to this request",
      });
    }

    // Can only respond to pending requests
    if (connection.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `This request has already been ${connection.status}`,
      });
    }

    connection.status = status;
    await connection.save();

    res.status(200).json({
      success: true,
      message: `Connection request ${status}`,
      connection,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get all pending connection requests received by logged in user
// @route   GET /api/connections/requests
// @access  Private
const getConnectionRequests = async (req, res) => {
  try {
    const requests = await Connection.find({
      receiver: req.user.id,
      status: "pending",
    }).populate("sender", "name email profilePicture bio role");

    res.status(200).json({
      success: true,
      total: requests.length,
      requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get all accepted connections of logged in user
// @route   GET /api/connections
// @access  Private
const getMyConnections = async (req, res) => {
  try {
    // Find all accepted connections where user is either sender or receiver
    const connections = await Connection.find({
      $or: [
        { sender: req.user.id, status: "accepted" },
        { receiver: req.user.id, status: "accepted" },
      ],
    })
      .populate("sender", "name email profilePicture bio role")
      .populate("receiver", "name email profilePicture bio role");

    // Extract the "other person" from each connection
    // If I am the sender, the other person is the receiver, and vice versa
    const myConnections = connections.map((conn) => {
      const issender = conn.sender._id.toString() === req.user.id;
      return {
        connectionId: conn._id,
        connectedUser: issender ? conn.receiver : conn.sender,
        connectedSince: conn.updatedAt,
      };
    });

    res.status(200).json({
      success: true,
      total: myConnections.length,
      connections: myConnections,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Remove a connection
// @route   DELETE /api/connections/:connectionId
// @access  Private
const removeConnection = async (req, res) => {
  try {
    const connection = await Connection.findById(req.params.connectionId);

    if (!connection) {
      return res.status(404).json({
        success: false,
        message: "Connection not found",
      });
    }

    // Only sender or receiver can remove the connection
    const isSender = connection.sender.toString() === req.user.id;
    const isReceiver = connection.receiver.toString() === req.user.id;

    if (!isSender && !isReceiver) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    await Connection.findByIdAndDelete(req.params.connectionId);

    res.status(200).json({
      success: true,
      message: "Connection removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get connection status between logged in user and another user
// @route   GET /api/connections/status/:userId
// @access  Private
const getConnectionStatus = async (req, res) => {
  try {
    const connection = await Connection.findOne({
      $or: [
        { sender: req.user.id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user.id },
      ],
    });

    if (!connection) {
      return res.status(200).json({
        success: true,
        status: "not_connected",
      });
    }

    res.status(200).json({
      success: true,
      status: connection.status,
      connectionId: connection._id,
      // Tell the frontend who sent the request
      isSender: connection.sender.toString() === req.user.id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  sendConnectionRequest,
  respondToRequest,
  getConnectionRequests,
  getMyConnections,
  removeConnection,
  getConnectionStatus,
};