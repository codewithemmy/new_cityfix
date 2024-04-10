const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema(
  {
    reviewedMadeFor: { type: mongoose.Types.ObjectId, ref: "User" },
    rating: Number,
    comment: String,
    reviewer: { type: mongoose.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
)

const review = mongoose.model("Review", reviewSchema, "review")

module.exports = { Review: review }
