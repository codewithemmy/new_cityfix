const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
    },
    password: { type: String },
    profileImage: { type: String },
    phoneNumber: {
      type: String,
    },
    gallery: [
      {
        type: String,
      },
    ],
    accountType: {
      type: String,
      required: true,
      enum: ["User", "CityBuilder", "Marketer"],
      default: "User",
    },
    yearsOfExperience: { type: Number },
    aboutYourself: { type: String },
    subExpiryDate: { type: Date },
    profession: { type: String },
    nearestBusStop: { type: String },
    localGovernment: { type: String },
    location: { type: String },
    locationCoord: {
      address: { type: String },
      type: { type: String },
      coordinates: [],
    },
    state: { type: String },
    clients: [{ type: String }],
    completedContract: { type: Number, default: 0 },
    ninDriverLicense: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      enum: ["Active", "InActive", "Disabled", "Pending"],
      default: "Active",
    },
    disable: {
      type: Boolean,
      required: true,
      default: false,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    profileUpdated: { type: Boolean, default: false },
    revenues: {
      type: Number,
      default: 0,
    },
    referrals: {
      type: Number,
      default: 0,
    },
    referralLink: {
      type: String,
    },
    usersReferred: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    passwordToken: {
      type: String,
    },
    verificationOtp: {
      type: String,
    },
    passwordTokenExpirationDate: {
      type: Date,
    },
    verified: { type: Date, default: Date.now() },
  },
  { timestamps: true }
)

userSchema.index({ locationCoord: "2dsphere" })

const user = mongoose.model("User", userSchema, "user")

module.exports = { User: user }
