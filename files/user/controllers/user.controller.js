const { BAD_REQUEST, SUCCESS } = require("../../../constants/statusCode")
const { responseHandler } = require("../../../core/response")
const { manageAsyncOps } = require("../../../utils")
const { CustomError } = require("../../../utils/errors")
const { UserService } = require("../../user/services/user.service")

const createUserController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(UserService.createUser(req.body))
  console.log("error", error)
  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const userLoginController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(UserService.userLogin(req.body))

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const searchUser = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(UserService.searchUser(req.query))
  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, 400, data))

  return responseHandler(res, 200, data)
}

//rate user
const rateUserController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    UserService.rateUserService(req.body, res.locals.jwt)
  )

  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, 400, data))

  return responseHandler(res, 200, data)
}

const userOverviewController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(UserService.userOverviewServices())

  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, 400, data))

  return responseHandler(res, 200, data)
}

const userAnalysisController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    UserService.userAnalysisService(req.query)
  )

  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, 400, data))

  return responseHandler(res, 200, data)
}

const authLoginController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    UserService.authLoginService(req.body)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const authCreateUserController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    UserService.authCreateUserService(req.body)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

module.exports = {
  createUserController,
  userLoginController,
  searchUser,
  rateUserController,
  userOverviewController,
  userAnalysisController,
  authLoginController,
  authCreateUserController,
}
