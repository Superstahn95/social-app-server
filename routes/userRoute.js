const express = require("express");
const {
  addRemoveFriend,
  getUser,
  getUserFriends,
  getAllUsers,
  updateUser,
} = require("../controllers/userController");
const { verifyToken } = require("../middlewares/auth");
const multer = require("../middlewares/multer");
const router = express.Router();

router.get("/", verifyToken, getAllUsers);
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);
router.patch("/", verifyToken, multer.single("profilePicture"), updateUser);
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

//get all users

module.exports = router;
