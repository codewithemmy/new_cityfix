const mongoose = require("mongoose")

const textSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      enum: ["User"],
    },
    senderId: {
      type: mongoose.Types.ObjectId,
      refPath: "sender",
    },
    recipient: {
      type: String,
      enum: ["User"],
    },
    recipientId: {
      type: mongoose.Types.ObjectId,
      refPath: "recipient",
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    message: {
      type: String,
      trim: true,
    },
    image: String,
  },
  { timestamps: true }
)

const text = mongoose.model("Text", textSchema, "text")

module.exports = { Text: text }
