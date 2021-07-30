const fs = require("fs");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");
const Conversation = require("../models/conversation");
const mongoose = require("mongoose");

const getUsersConversations = async (req, res, next) => {
  const userId = req.params.uid;
  let conversations;
  try {
    conversations = await Conversation.find({
      users: { $in: [userId] },
    }).populate("users");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong. Could not find a conversation.",
      500
    );
    return next(error);
  }

  res.json({
    conversations: conversations.map((conversation) =>
      conversation.toObject({ getters: true })
    ),
  });
};

const getConversationById = async (req, res, next) => {
  const conversationId = req.params.cid;
  let conversation;
  try {
    conversation = await Conversation.findById(conversationId).populate(
      "users"
    );
  } catch (err) {
    const error = new HttpError(
      "Something went wrong. Could not find a conversation.",
      500
    );
    return next(error);
  }

  res.json({
    conversation: conversation.toObject({ getters: true }),
  });
};

const createConversation = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed. Please check your data.", 422)
    );
  }

  const { sender, receiver } = req.body;

  const createdConversation = new Conversation({
    users: [sender, receiver],
  });

  try {
    await createdConversation.save();
  } catch (err) {
    const error = new HttpError(
      "Creating conversation failed. Please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ conversation: createdConversation });
};

exports.getUsersConversations = getUsersConversations;
exports.getConversationById = getConversationById;
exports.createConversation = createConversation;
