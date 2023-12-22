const express = require("express");
const {
  createMessage,
  getMessages,
} = require("../controllers/messageController");
const { verifyToken } = require("../middlewares/auth");

const router = express.Router();

router.post("/", verifyToken, createMessage);
router.get("/:conversationId", verifyToken, getMessages);

module.exports = router;
