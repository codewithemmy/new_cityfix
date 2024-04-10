const mongoose = require("mongoose")

const reportSchema = new mongoose.Schema(
  {
    reporterId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    reportedUser: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    subject: {
      type: String,
    },
    message: {
      type: String,
    },
    reportId: { type: String },
    image: {
      type: String,
    },
    response: {
      title: String,
      message: String,
    },
  },
  { timestamps: true }
)

const report = mongoose.model("Report", reportSchema, "report")

module.exports = { Report: report }
