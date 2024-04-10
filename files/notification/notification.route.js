const notificationRoute = require("express").Router()
const { isAuthenticated } = require("../../utils")

notificationRoute.use(isAuthenticated)

const {
  fetchNotifications,
  postNotifications,
  updateNotification,
} = require("./notification.controller")

notificationRoute.use(isAuthenticated)
//route
notificationRoute
  .route("/")
  .get(fetchNotifications)
  .post(postNotifications)
  .patch(updateNotification)

module.exports = notificationRoute
