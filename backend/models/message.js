const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    conversation: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Conversation",
    },
    sender: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
