const { BAD_REQUEST, SUCCESS } = require("../../constants/statusCode")
const { responseHandler } = require("../../core/response")
const { manageAsyncOps } = require("../../utils")
const { CustomError } = require("../../utils/errors")
const { ContractService } = require("./contract.service")

const createContractController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ContractService.createContractService(req.body, res.locals.jwt)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const startContractController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ContractService.startContractService(req.params.id, res.locals.jwt)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const getContractController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ContractService.getContractService(req.query)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const declineContractController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ContractService.declineContractService(req.params.id)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const endContractController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ContractService.endContractService(req.params.id)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

module.exports = {
  createContractController,
  startContractController,
  getContractController,
  declineContractController,
  endContractController,
}
