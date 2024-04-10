const { checkSchema } = require("express-validator")
const textRoute = require("express").Router()
const { isAuthenticated } = require("../../../utils")
// const { validate } = require("../../../validation/validate")
const { uploadManager } = require("../../../utils/multer")
const {
  sendTextController,
  fetchTextsController,
} = require("./text.controller")
// const {
//   textValidation,
// } = require("../../../validation/text/sendText.validation")

textRoute.use(isAuthenticated)

//routes
textRoute
  .route("/")
  .post(uploadManager("textImage").single("image"), sendTextController)
  .get(fetchTextsController)

module.exports = textRoute
