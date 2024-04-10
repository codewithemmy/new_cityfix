const mongoose = require("mongoose")

const socketSchema = new mongoose.Schema(
  {
    socketId: {
      type: String,
      required: true,
    },
    modelType: {
      type: String,
      required: true,
      enum: ["User"],
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      refPath: "modelType",
    },
  },
  { timestamps: true }
)

const Sockets = mongoose.model("Sockets", socketSchema, "Sockets")
module.exports = { Sockets }
