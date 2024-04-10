const conversationRoute = require("express").Router()
const { isAuthenticated } = require("../../../utils/index")
const {
  getConversationsController,
  updateViewConversationController,
} = require("./conversation.controller")

// conversationRoute.use(isAuthenticated)

//routes
conversationRoute.route("/").get(getConversationsController)
conversationRoute.route("/:id").patch(updateViewConversationController)

module.exports = conversationRoute
