const { default: mongoose } = require("mongoose")
const { queryConstructor } = require("../../../utils")
const { ConversationRepository } = require("./conversation.repository")
const { ConversationMessages } = require("./conversation.messages")

class ConversationService {
  static async createConversation(conversationPayload) {
    return ConversationRepository.createConversation(conversationPayload)
  }

  static async fetchConversations(conversationPayload, userId) {
    const { error, limit, skip, sort } = queryConstructor(
      conversationPayload,
      "updatedAt",
      "Conversation"
    )
    if (error) return { success: false, msg: error }

    const conversations =
      await ConversationRepository.fetchConversationsByParams({
        $or: [
          { entityOneId: new mongoose.Types.ObjectId(userId) },
          { entityTwoId: new mongoose.Types.ObjectId(userId) },
        ],
        limit,
        skip,
        sort,
      })

    if (conversations.length === 0)
      return {
        success: false,
        msg: ConversationMessages.NO_CONVERSATIONS_FETCHED,
      }

    return {
      success: true,
      msg: ConversationMessages.FETCH,
      data: conversations,
    }
  }

  static async updateViewConversation(params) {
    const conversations = await ConversationRepository.updateConversation(
      {
        _id: new mongoose.Types.ObjectId(params),
      },
      { status: "viewed" }
    )

    if (!conversations)
      return {
        success: false,
        msg: `Unable to update conversation`,
      }

    return {
      success: true,
      msg: `Conversation update successful`,
    }
  }
}

module.exports = { ConversationService }
