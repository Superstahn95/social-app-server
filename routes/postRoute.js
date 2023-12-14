const express = require("express");
const { verifyToken } = require("../middlewares/auth");
const {
  createPost,
  getFeedPosts,
  getUserPosts,
  likePost,
} = require("../controllers/postController");

const router = express.Router();

router.post("/", verifyToken, createPost);
router.get("/", verifyToken, getFeedPosts);
router.get("/:id", verifyToken, getUserPosts);
router.patch("/:id/like", verifyToken, likePost);

module.exports = router;
