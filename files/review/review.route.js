const reportRoute = require("express").Router()
const { checkSchema } = require("express-validator")
const { isAuthenticated } = require("../../utils")
const {
  createReportController,
  getReportController,
} = require("./review.controller")

reportRoute.use(isAuthenticated)

const { validate } = require("../../validations/validate")
const {
  createReviewValidation,
} = require("../../validations/review/createReview.validation")

//routes
reportRoute
  .route("/")
  .post(validate(checkSchema(createReviewValidation)), createReportController)
  .get(getReportController)

module.exports = reportRoute
