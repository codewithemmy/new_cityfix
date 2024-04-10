const mongoose = require("mongoose")

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    recipientId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    recipient: {
      type: String,
    },
    title: {
      type: String,
    },
    message: {
      type: String,
    },
    status: {
      type: String,
      enum: ["new", "read"],
      default: "new",
    },
    accountType: {
      type: String,
      enum: ["User", "CityBuilder", "Marketer", "All"],
    },
  },
  { timestamps: true }
)

const notification = mongoose.model(
  "Notification",
  NotificationSchema,
  "notification"
)

module.exports = { Notification: notification }
