const { responseHandler } = require("../../core/response")
const { manageAsyncOps } = require("../../utils")
const { CustomError } = require("../../utils/errors")
const { NotificationService } = require("./notification.service")

const fetchNotifications = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    NotificationService.fetchNotifications(req.query)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, 400, data))

  return responseHandler(res, 200, data)
}

const postNotifications = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    NotificationService.validateNotificationRecipient(req.body)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, 400, data))

  return responseHandler(res, 200, data)
}

const updateNotification = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    NotificationService.updateNotificationService(res.locals.jwt._id)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, 400, data))

  return responseHandler(res, 200, data)
}

module.exports = { fetchNotifications, postNotifications, updateNotification }
