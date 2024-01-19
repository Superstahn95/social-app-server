const Conversation = require("../models/conversation");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/customError");

exports.createConversation = asyncErrorHandler(async (req, res, next) => {
  //send in the sender id and the receiver id
  //senderId is likel to be the userId which i think we can get from the middleware
  const { senderId, receiverId } = req.body;
  const newConversation = new Conversation({
    members: [senderId, receiverId],
  });

  const savedConversation = await newConversation.save();
  res.status(200).json({
    status: "success",
    conversation: savedConversation,
  });
});

exports.getConversation = asyncErrorHandler(async (req, res, next) => {
  const { userId } = req.params;
  console.log(userId);
  const conversation = await Conversation.find({
    members: { $in: [userId] },
  });

  //the goal is to return every conversation that has the userId in the members array

  res.status(200).json({
    status: "success",
    conversation,
  });
});

exports.getConversationBetweenUsers = asyncErrorHandler(
  async (req, res, next) => {
    const { firstUserId, secondUserId } = req.params;
    const conversation = await Conversation.findOne({
      members: { $all: [firstUserId, secondUserId] },
    });
    res.status(200).json({
      status: "success",
      conversation,
    });
  }
);
