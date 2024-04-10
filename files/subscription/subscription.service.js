const { queryConstructor, verifyRole } = require("../../utils");
const mongoose = require("mongoose");
const { SubscriptionMessage } = require("./subscription.messages");
const { SubscriptionRepository } = require("./subscription.repository");

class SubscriptionService {
  static async createSubscriptionService(payload) {
    const { name } = payload;

    const subscription = await SubscriptionRepository.findSingleSubscription({
      name,
      isDeleted: false,
    });

    if (subscription)
      return { success: false, msg: SubscriptionMessage.SUBSCRIPTION_EXIST };

    const newSubscription = await SubscriptionRepository.create({ ...payload });

    if (!newSubscription)
      return { success: false, msg: SubscriptionMessage.CREATE_FAIL };

    return { success: true, msg: SubscriptionMessage.CREATE_SUCCESSFUL };
  }

  static async getSubscription(query) {
    const { error, params, limit, skip, sort } = queryConstructor(
      query,
      "createdAt",
      "Subscription"
    );

    if (error) return { success: false, msg: error };

    const allSubscription =
      await SubscriptionRepository.findSubscriptionWithParams({
        ...params,
        isDeleted: false,
        limit,
        skip,
        sort,
      });

    if (allSubscription.length === 0)
      return { success: false, msg: SubscriptionMessage.NO_SUBSCRIPTION_FOUND };

    return {
      success: true,
      msg: SubscriptionMessage.FETCH,
      data: allSubscription,
    };
  }

  static async updateSubscriptionService(data) {
    const { params, body } = data;

    const subscription = await SubscriptionRepository.updateSubscription(
      { _id: new mongoose.Types.ObjectId(params.id) },
      {
        ...body,
      }
    );

    if (!subscription)
      return { success: false, msg: SubscriptionMessage.UPDATE_FAIL };

    return { success: true, msg: SubscriptionMessage.UPDATE_SUCCESSFUL };
  }

  static deleteSubscriptionService = async (data) => {
    const deleteSubscription = await this.updateSubscriptionService(data);

    if (!deleteSubscription)
      return { success: false, msg: SubscriptionMessage.DELETE_FAIL };

    return { success: true, msg: SubscriptionMessage.DELETE_SUCCESSFUL };
  };
}

module.exports = { SubscriptionService };
