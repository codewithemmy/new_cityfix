const { BAD_REQUEST, SUCCESS } = require("../../constants/statusCode")
const { responseHandler } = require("../../core/response")
const { manageAsyncOps, fileModifier } = require("../../utils")
const { CustomError } = require("../../utils/errors")
const { ReportService } = require("./report.service")

const createReportController = async (req, res, next) => {
  let value = await fileModifier(req)
  const [error, data] = await manageAsyncOps(
    ReportService.createReport(value, res.locals.jwt._id)
  )
  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const getReportController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(ReportService.getReport(req.query))

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const getReportAnalysis = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ReportService.reportAnalysisService(req.query)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const reportResponseController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ReportService.reportResponseService(req.body, req.params.id)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

module.exports = {
  createReportController,
  getReportController,
  getReportAnalysis,
  reportResponseController,
}
