const express = require("express");
const router = express.Router();
const {
  sendConnectionRequest,
  respondToRequest,
  getConnectionRequests,
  getMyConnections,
  removeConnection,
  getConnectionStatus,
} = require("../controllers/connectionController");
const { protect } = require("../middleware/authMiddleware");

// All connection routes require login
router.post("/send/:userId", protect, sendConnectionRequest);
router.put("/:connectionId", protect, respondToRequest);
router.get("/requests", protect, getConnectionRequests);
router.get("/", protect, getMyConnections);
router.delete("/:connectionId", protect, removeConnection);
router.get("/status/:userId", protect, getConnectionStatus);

module.exports = router;