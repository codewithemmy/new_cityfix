const { BAD_REQUEST, SUCCESS } = require("../../constants/statusCode")
const { responseHandler } = require("../../core/response")
const { manageAsyncOps, fileModifier } = require("../../utils")
const { CustomError } = require("../../utils/errors")
const { CampaignService } = require("./campaign.service")

const createCampaignController = async (req, res, next) => {
  let value = await fileModifier(req)
  const [error, data] = await manageAsyncOps(
    CampaignService.createCampaignService(value, res.locals.jwt)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const getCampaignController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    CampaignService.getCampaignService(req.query)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const editCampaignController = async (req, res, next) => {
  let value = await fileModifier(req)
  const [error, data] = await manageAsyncOps(
    CampaignService.editCampaignService(value, req.params.id)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const deleteCampaignController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    CampaignService.deleteCampaignService(req.params.id)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

module.exports = {
  createCampaignController,
  getCampaignController,
  editCampaignController,
  deleteCampaignController,
}
