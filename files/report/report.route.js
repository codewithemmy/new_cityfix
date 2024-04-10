const reportRoute = require("express").Router()
const { isAuthenticated } = require("../../utils")
const { uploadManager } = require("../../utils/multer")
const {
  createReportController,
  getReportController,
  getReportAnalysis,
} = require("./report.controller")

reportRoute.use(isAuthenticated)

//routes
reportRoute
  .route("/")
  .post(uploadManager("reportImage").single("image"), createReportController)
  .get(getReportController)

module.exports = reportRoute
