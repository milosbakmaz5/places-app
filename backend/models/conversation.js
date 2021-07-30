const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const conversationSchema = new Schema({
  users: [{ type: mongoose.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("Conversation", conversationSchema);
