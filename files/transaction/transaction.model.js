const mongoose = require("mongoose")

const TransactionSchema = new mongoose.Schema(
  {
    userType: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      refPath: "userType",
    },
    subscriptionId: {
      type: mongoose.Types.ObjectId,
      ref: "Subscription",
    },
    amount: {
      type: Number,
      required: true,
    },
    channel: {
      type: String,
      required: true,
      enum: ["paystack", "bank"],
    },
    paymentFor: {
      type: String,
      required: true,
      enum: ["UserBoost"],
      default: "UserBoost",
    },
    reference: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "failed"],
      default: "pending",
    },
    bankName: String,
    metaData: String,
  },
  { timestamps: true }
)

const transaction = mongoose.model(
  "Transaction",
  TransactionSchema,
  "transaction"
)

module.exports = { Transaction: transaction }
