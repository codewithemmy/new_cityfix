const mongoose = require("mongoose")

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    image: String,
    accountType: {
      type: String,
      enum: ["superAdmin", "admin"],
      default: "superAdmin",
    },
    status: {
      type: String,
      required: true,
      enum: ["Active", "InActive", "Disabled", "Pending"],
      default: "Active",
    },
  },
  { timestamps: true }
)

const admin = mongoose.model("Admin", adminSchema, "admin")

module.exports = { Admin: admin }
