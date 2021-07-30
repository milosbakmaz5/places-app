const fs = require("fs");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");
const Message = require("../models/message");
const mongoose = require("mongoose");

const getConversationsMessages = async (req, res, next) => {
  const conversationId = req.params.cid;
  let messages;
  try {
    messages = await Message.find({
      conversation: conversationId,
    }).populate("sender");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong. Could not find a message.",
      500
    );
    return next(error);
  }

  res.json({
    messages: messages.map((message) => message.toObject({ getters: true })),
  });
};

const createMessage = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed. Please check your data.", 422)
    );
  }

  const { conversation, sender, text } = req.body;

  const createdMessage = new Message({
    conversation,
    sender,
    text,
  });

  try {
    await createdMessage.save();
  } catch (err) {
    const error = new HttpError(
      "Creating message failed. Please try again.",
      500
    );
    return next(error);
  }

  let retVal;
  try {
    retVal = await Message.findById(createdMessage.id).populate("sender");
  } catch (err) {
    const error = new HttpError(
      "Creating message failed. Please try again.",
      500
    );
    return next(error);
  }
  res.status(201).json({ message: retVal.toObject({ getters: true }) });
};

exports.getConversationsMessages = getConversationsMessages;
exports.createMessage = createMessage;
