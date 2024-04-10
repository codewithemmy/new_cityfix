const {
  adminSignUpController,
  adminLogin,
} = require("../admin/admin.controller")
const { checkSchema } = require("express-validator")
const { createAdmin } = require("../../validations/admin/admin")
const { validate } = require("../../validations/validate")
const {
  verifyUserController,
  forgotPasswordController,
  resetPasswordController,
  verifyOtpController,
} = require("./controller/auth.controller")
const { authLoginController, authCreateUserController } = require("../user/controllers/user.controller")

const authRoute = require("express").Router()

//routes
authRoute.post("/verify", verifyUserController)
authRoute.post("/forgot-password", forgotPasswordController)
authRoute.patch("/reset-password/:id", resetPasswordController)
authRoute.post("/verify-otp", verifyOtpController)

//google signup and sign-in
authRoute.route("/sign-up").post(authCreateUserController)
authRoute.route("/google/login").post(authLoginController)

module.exports = authRoute
