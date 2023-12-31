const User = require("../models/user");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/customError");
const cloudinary = require("../config/cloudinary");

exports.getUser = asyncErrorHandler(async (req, res, next) => {
  console.log("getting the user");
  console.log(req.params);
  const { id } = req.params;
  console.log(id);
  const user = await User.findById(id);
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
    ({ _id, firstName, lastName, occupation, location, profilePicture }) => {
      return { _id, firstName, lastName, occupation, location, profilePicture };
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
  console.log(friend);
  if (!user) {
    const err = new CustomError("User not found", 404);
    return next(err);
  }
  console.log(user.friends);
  if (user.friends.includes(friendId)) {
    console.log("this filter method should run");
    user.friends = user.friends.filter((id) => id !== friendId);
    friend.friends = friend.friends.filter((individual) => individual !== id);
  } else {
    console.log("this should run for us..the else statement");
    user.friends.push(friendId);
    friend.friends.push(id);
  }

  await user.save();
  await friend.save();

  const friends = await Promise.all(
    user.friends.map((id) => User.findById(id))
  );
  const formattedFriends = friends.map(
    ({ _id, firstName, lastName, occupation, location, profilePicture }) => {
      return { _id, firstName, lastName, occupation, location, profilePicture };
    }
  );
  res.status(200).json({
    status: "success",
    friends: formattedFriends,
  });
});

exports.getAllUsers = asyncErrorHandler(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    users,
  });
});

exports.updateUser = asyncErrorHandler(async (req, res, next) => {
  //user id should be present in the req.user

  const user = await User.findById(req.user.id);

  const { file } = req;

  if (!user) {
    const err = new CustomError("No user found", 404);
    return next(err);
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { $set: req.body },
    { new: true }
  );

  if (file) {
    if (user.profilePicture) {
      const { public_id: imageId } = user.profilePicture;
      await cloudinary.uploader.destroy(`mern-social-media/${imageId}`);
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { folder: "mern-social-media" }
    );

    updatedUser.profilePicture = { secure_url, public_id };
  }
  await updatedUser.save();
  res.status(200).json({
    status: "success",
    user: updatedUser,
  });
});
