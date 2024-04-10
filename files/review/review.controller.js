const { BAD_REQUEST, SUCCESS } = require("../../constants/statusCode")
const { responseHandler } = require("../../core/response")
const { manageAsyncOps } = require("../../utils")
const { CustomError } = require("../../utils/errors")
const { ReviewService } = require("./review.service")

const createReviewController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ReviewService.createReview(req.body, res.locals.jwt)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const getReviewController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ReviewService.getReviewService(req.query)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const reviewListController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ReviewService.reviewListService(req.query)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

module.exports = {
  createReviewController,
  getReviewController,
  reviewListController,
}
