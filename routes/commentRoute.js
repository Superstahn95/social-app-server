const express = require("express");
const {
  createComment,
  deleteComment,
} = require("../controllers/commentController");
const { verifyToken } = require("../middlewares/auth");
const router = express.Router();

router.post("/:id", verifyToken, createComment);
router.delete("/:id", verifyToken, deleteComment);

module.exports = router;
