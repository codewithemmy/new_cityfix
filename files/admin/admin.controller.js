const { manageAsyncOps, fileModifier } = require("../../utils/index")
const { AdminAuthService } = require("./admin.service")
const { responseHandler } = require("../../core/response")
const { CustomError } = require("../../utils/errors")
const { UserService } = require("../user/services/user.service")
const { ProfileService } = require("../user/services/profile.service")

const adminSignUpController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    AdminAuthService.adminSignUpService(req.body)
  )

  if (error) return next(error)

  if (!data?.success) return next(new CustomError(data.msg, 400, data))

  return responseHandler(res, 200, data)
}

const adminLogin = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    AdminAuthService.adminLoginService(req.body)
  )

  if (error) return next(error)

  if (!data?.success) return next(new CustomError(data.msg, 401, data))

  return responseHandler(res, 200, data)
}

const getAdminController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    AdminAuthService.getAdminService(req.body)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, 400, data))

  return responseHandler(res, 200, data)
}

const getLoggedInAdminController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    AdminAuthService.getLoggedInAdminService(res.locals.jwt)
  )

  if (error) return next(error)

  if (!data.SUCCESS) return next(new CustomError(data.msg, 400, data))

  return responseHandler(res, 200, data)
}

const updateAdminController = async (req, res, next) => {
  const value = await fileModifier(req)
  const [error, data] = await manageAsyncOps(
    AdminAuthService.updateAdminService(value, res.locals.jwt._id)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, 400, data))

  return responseHandler(res, 200, data)
}

const changeAdminPasswordController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    AdminAuthService.changePassword(req.body)
  )
  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, 400, data))

  return responseHandler(res, 200, data)
}

const imageUpload = async (req, res, next) => {
  let value = await fileModifier(req)

  const [error, data] = await manageAsyncOps(
    AdminAuthService.uploadImageService(value, res.locals.jwt)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, 400, data))

  return responseHandler(res, 200, data)
}

const createUserController = async (req, res, next) => {
  req.body.password = "1234"
  const [error, data] = await manageAsyncOps(UserService.createUser(req.body))

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, 400, data))

  return responseHandler(res, 200, data)
}

const disableOrEnableController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    AdminAuthService.disableOrEnableService(req.params.id, req.body)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, 400, data))

  return responseHandler(res, 200, data)
}

const deleteUserController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ProfileService.deleteAccountService(req.params.id)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, 400, data))

  return responseHandler(res, 200, data)
}

const fetchAdminController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    AdminAuthService.fetchAdminServices(res.locals.jwt._id)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, 400, data))

  return responseHandler(res, 200, data)
}

const createMarketerController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    AdminAuthService.createMarketerService(req.body)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, 400, data))

  return responseHandler(res, 200, data)
}

const enableOrDisableAdminController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    AdminAuthService.disableOrEnableAdminService(req.params.id, req.body)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, 400, data))

  return responseHandler(res, 200, data)
}

module.exports = {
  adminSignUpController,
  adminLogin,
  updateAdminController,
  changeAdminPasswordController,
  imageUpload,
  getAdminController,
  getLoggedInAdminController,
  createUserController,
  disableOrEnableController,
  deleteUserController,
  fetchAdminController,
  createMarketerController,
  enableOrDisableAdminController,
}
