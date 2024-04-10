const { BAD_REQUEST, SUCCESS } = require("../../../constants/statusCode")
const { responseHandler } = require("../../../core/response")
const { manageAsyncOps, fileModifier } = require("../../../utils")
const { CustomError } = require("../../../utils/errors")
const { ProfileService } = require("../services/profile.service")

const profileImageController = async (req, res, next) => {
  if (req.file && req.file.size > 1024) {
    res.status(401).send({
      success: false,
      msg: `Image cannot be more than 1MB`,
      error: { success: false, msg: `Image cannot be more than 1MB` },
    })
  }
  const value = fileModifier(req)
  const [error, data] = await manageAsyncOps(
    ProfileService.profileImage(value, res.locals.jwt)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const galleryController = async (req, res, next) => {
  const value = fileModifier(req)
  const [error, data] = await manageAsyncOps(
    ProfileService.galleryService(value, res.locals.jwt)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const getUserController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ProfileService.getUserService(req.query, res.locals.jwt)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const searchUserController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ProfileService.searchUser(req.query)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const userGalleryController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ProfileService.userGalleryService(res.locals.jwt)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const updateUserController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ProfileService.UpdateUserService(req.body, res.locals.jwt)
  )
  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const changePasswordController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ProfileService.changePasswordService(req.body, res.locals.jwt)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}
const deleteUserController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ProfileService.deleteAccountService(res.locals.jwt._id)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const getUserProfileController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ProfileService.getUserProfileService(req.query)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const deleteGalleryController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ProfileService.deleteGalleryService(req.query, res.locals.jwt._id)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const switchUserController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ProfileService.switchUserServices(req.body, res.locals.jwt)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const getReferralsController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ProfileService.getReferralsService(res.locals.jwt._id)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const getCityBuilderCoordController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ProfileService.getCityBuilderCoord(req.query)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const searchByCoordController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ProfileService.searchCityBuilder(req.query)
  )
  console.log("error", error)
  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

module.exports = {
  profileImageController,
  galleryController,
  getUserController,
  searchUserController,
  userGalleryController,
  updateUserController,
  changePasswordController,
  deleteUserController,
  getUserProfileController,
  deleteGalleryController,
  switchUserController,
  getReferralsController,
  getCityBuilderCoordController,
  searchByCoordController,
}
