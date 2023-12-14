const express = require("express");
const {
  addRemoveFriend,
  getUser,
  getUserFriends,
} = require("../controllers/userController");
const { verifyToken } = require("../middlewares/auth");

const router = express.Router();

router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);

router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

module.exports = router;
