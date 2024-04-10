const { BAD_REQUEST, SUCCESS } = require("../../../constants/statusCode")
const { responseHandler } = require("../../../core/response")
const { manageAsyncOps } = require("../../../utils")
const { CustomError } = require("../../../utils/errors")
const { ConversationService } = require("./conversation.service")

const getConversationsController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ConversationService.fetchConversations(req.query, res.locals.jwt._id)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const updateViewConversationController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ConversationService.updateViewConversation(req.params.id)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

module.exports = {
  getConversationsController,
  updateViewConversationController,
}
