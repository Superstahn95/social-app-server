const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/customError");
const Post = require("../models/post");
const cloudinary = require("../config/cloudinary");

exports.getFeedPosts = asyncErrorHandler(async (req, res, next) => {
  const posts = await Post.find();
  res.status(200).json({
    status: "success",
    posts,
  });
});

exports.getUserPosts = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const posts = await Post.find({ userId: id });
  res.status(200).json({
    status: "success",
    posts,
  });
});

exports.likePost = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  const post = await Post.findById(id);

  //returns a boolean or undefined
  const isLiked = post.likes.get(userId);

  if (isLiked) {
    post.likes.delete(userId);
  } else {
    post.likes.set(userId, true);
  }
  const updatedPost = await Post.findByIdAndUpdate(id, { likes: post.likes });

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
  res.status(200).json({
    status: "success",
    post,
  });
});
