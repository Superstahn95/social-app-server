const User = require("../models/user");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/customError");

exports.getUser = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await user.findById(id);
  if (!user) {
    const err = new CustomError("User not found", 404);
    return next(err);
  }
  res.status(200).json({
    status: "success",
    user,
  });
});

exports.getUserFriends = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    const err = new CustomError("User not found", 404);
    return next(err);
  }
  //user friends is an array of ID and we are looping through them to get the individual user with each individual id
  //hence, friends returns an array of users
  const friends = await Promise.all(
    user.friends.map((id) => User.findById(id))
  );
  const formattedFriends = friends.map(
    ({ _id, firstName, lastName, occupation, location, profilephoto }) => {
      return { _id, firstName, lastName, occupation, location, profilephoto };
    }
  );
  res.status(200).json({
    status: "success",
    friends: formattedFriends,
  });
});

exports.addRemoveFriend = asyncErrorHandler(async (req, res, next) => {
  //since these are protected routes, we can actually get the userId from the req.user
  const { id, friendId } = req.params;
  const user = await User.findById(id);
  const friend = await User.findById(friendId);
  if (!user) {
    const err = new CustomError("User not found", 404);
    return next(err);
  }

  if (user.friends.includes(friendId)) {
    user.friends = user.friends.filter((id) => id !== friendId);
    friend.friends = friend.friends.filter((individual) => individual !== id);
  } else {
    user.friends.push(friendId);
    friend.friends.push(id);
  }

  const friends = await Promise.all(
    user.friends.map((id) => User.findById(id))
  );
  const formattedFriends = friends.map(
    ({ _id, firstName, lastName, occupation, location, profilePhoto }) => {
      return { _id, firstName, lastName, occupation, location, profilePhoto };
    }
  );
  res.status(200).json({
    status: "success",
    friends: formattedFriends,
  });
});
