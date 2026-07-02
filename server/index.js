require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const connectionRoutes = require("./routes/connectionRoutes");
const companyRoutes = require("./routes/companyRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const { initializeSocket } = require("./utils/socket");

connectDB();

const app = express();

// Create HTTP server from Express app
// Socket.io needs an HTTP server, not just Express app
const server = http.createServer(app);

// Initialize Socket.io on the HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // React frontend URL (Vite default port)
    methods: ["GET", "POST"],
  },
});

// Store io instance in app so controllers can access it via req.app.get("io")
app.set("io", io);

// Initialize all socket event listeners
initializeSocket(io);

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.send("CareerConnect backend is running!");
});

const PORT = process.env.PORT || 5000;

// Use server.listen instead of app.listen
// This is important — app.listen does not support Socket.io
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});