const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/customError");
const Post = require("../models/post");
const cloudinary = require("../config/cloudinary");

exports.getFeedPosts = asyncErrorHandler(async (req, res, next) => {
  console.log("Getting feed posts");
  const posts = await Post.find()
    .populate("userId") // Populates the user field in the Post model
    .populate({
      path: "comments",
      populate: { path: "user" }, // Populates the user field in the Comment model within the comments array
    })
    .exec();
  res.status(200).json({
    status: "success",
    posts,
  });
});

exports.getUserPosts = asyncErrorHandler(async (req, res, next) => {
  console.log("we are here!!");
  const { id } = req.params;
  const posts = await Post.find({ userId: id })
    .populate("userId")
    .populate({
      path: "comments",
      populate: { path: "user" }, // Populates the user field in the Comment model within the comments array
    })
    .exec();
  res.status(200).json({
    status: "success",
    posts,
  });
});

exports.likePost = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  console.log("This is our user.....");
  console.log(req.user);
  const userId = req.user.id;
  const post = await Post.findById(id);

  //returns a boolean or undefined
  const isLiked = post.likes.get(userId);

  if (isLiked) {
    post.likes.delete(userId);
  } else {
    post.likes.set(userId, true);
  }
  const updatedPost = await Post.findByIdAndUpdate(
    id,
    { likes: post.likes },
    { new: true }
  ).populate("userId");

  res.status(200).json({
    status: "success",
    post: updatedPost,
  });
});

exports.createPost = asyncErrorHandler(async (req, res, next) => {
  const { file } = req;
  //userId is present in the req.user
  const post = new Post({
    ...req.body,
    userId: req.user.id,
    likes: {},
  });
  if (file) {
    //cloudinary functionality
    const { secure_url: url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { folder: "mern-social-media" }
    );
    post.image = { url, public_id };
  }
  await post.save();
  await post.populate("userId");
  res.status(200).json({
    status: "success",
    post,
  });
});
