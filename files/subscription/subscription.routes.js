const subscriptionRoute = require("express").Router()
const { isAuthenticated, adminVerifier } = require("../../utils")

const {
  createSubscriptionController,
  getSubscriptionsController,
  updateSubscriptionController,
  deleteSubscriptionController,
} = require("./subscription.controller")

subscriptionRoute.get("/", getSubscriptionsController)

subscriptionRoute.use(isAuthenticated, adminVerifier)

subscriptionRoute.post("/", createSubscriptionController)

subscriptionRoute.patch("/:id", updateSubscriptionController)
subscriptionRoute.delete("/:id", deleteSubscriptionController)

module.exports = subscriptionRoute
