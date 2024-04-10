const mongoose = require("mongoose")

const subscriptionModel = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    duration: {
      type: Number,
    },
    amount: {
      type: Number,
    },
    benefits: [{ type: String }],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

const subscription = mongoose.model(
  "Subscription",
  subscriptionModel,
  "subscription"
)

module.exports = { Subscription: subscription }
