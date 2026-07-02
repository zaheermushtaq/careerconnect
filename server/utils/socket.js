// This map stores userId → socketId
// So we know which socket belongs to which user
const userSocketMap = {};

const getSocketId = (userId) => {
  return userSocketMap[userId];
};

const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`New socket connected: ${socket.id}`);

    // When user logs in, frontend sends their userId
    // We store the mapping: userId → socketId
    socket.on("register", (userId) => {
      if (userId) {
        userSocketMap[userId] = socket.id;
        console.log(`User ${userId} registered with socket ${socket.id}`);
      }
    });

    // When user disconnects, remove them from the map
    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
      // Find and remove the disconnected user
      for (const [userId, socketId] of Object.entries(userSocketMap)) {
        if (socketId === socket.id) {
          delete userSocketMap[userId];
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
    });
  });
};

// Send a real-time notification to a specific user
const sendNotificationToUser = (io, userId, notification) => {
  const socketId = getSocketId(userId.toString());
  if (socketId) {
    // User is online — send notification directly
    io.to(socketId).emit("new_notification", notification);
    console.log(`Notification sent to user ${userId}`);
  } else {
    // User is offline — notification is saved in DB only
    console.log(`User ${userId} is offline. Notification saved to DB.`);
  }
};

module.exports = { initializeSocket, sendNotificationToUser, getSocketId };