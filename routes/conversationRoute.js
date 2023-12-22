const express = require("express");
const {
  createConversation,
  getConversation,
  getConversationBetweenUsers,
} = require("../controllers/conversationController");
const { verifyToken } = require("../middlewares/auth");
const router = express.Router();

router.post("/", verifyToken, createConversation);
router.get("/:userId", verifyToken, getConversation);
router.get(
  "/:firstUserId/:secondUserId",
  verifyToken,
  getConversationBetweenUsers
);

module.exports = router;
