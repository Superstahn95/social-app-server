const Comment = require("../models/comment");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/customError");
const Post = require("../models/post");

exports.createComment = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) {
    const err = new CustomError("Post no longer exists", 404);
    return next(err);
  }
  const comment = new Comment({
    ...req.body,
    user: req.user.id,
  });
  post.comments.unshift(comment._id);
  await post.save();
  await comment.save();

  res.status(201).json({
    status: "success",
    comment: await comment.populate("user"),
  });
});

exports.deleteComment = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const { postId } = req.params;
  const comment = await Comment.findByIdAndDelete(id);
  const post = await Post.findById(postId);
  //deleting comment when post is not existent?
  if (!comment) {
    const err = new CustomError("Comment not found", 404);
    return next(err);
  }
  //make sure person deleting comment is the owner of the comment
  if (comment.user != req.user.id) {
    const err = new CustomError("You cant delete another persons comment");
    return next(err);
  }
  post.comments.filter((comm) => comm._id != comment._id);
  await post.save();
  res.status(200).json({
    status: "success",
    comment, //might be removed
  });
});
