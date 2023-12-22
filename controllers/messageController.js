const Message = require("../models/message");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/customError");

exports.createMessage = asyncErrorHandler(async (req, res, next) => {
  const newMessage = new Message(req.body);
  const savedMessage = await newMessage.save();
  res.status(201).json({
    status: "success",
    message: savedMessage,
  });
});

exports.getMessages = asyncErrorHandler(async (req, res, next) => {
  //trying to get the messages with that conversation id
  const { conversationId } = req.params;
  const messages = await Message.find({ conversationId });
  res.status(200).json({
    status: "success",
    messages,
  });
});
