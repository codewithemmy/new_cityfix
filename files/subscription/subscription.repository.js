const { Subscription } = require("./subscription.model");

class SubscriptionRepository {
  static async create(payload) {
    return Subscription.create(payload);
  }

  static async validateSubscription(payload) {
    return Subscription.exists({ ...payload });
  }

  static async findSubscriptionWithParams(payload) {
    const { limit, skip, sort, ...restOfPayload } = payload;

    return await Subscription.find({ ...restOfPayload })
      .sort(sort)
      .skip(skip)
      .limit(limit);
  }

  static async findSingleSubscription(payload) {
    return Subscription.findOne({ ...payload });
  }

  static async updateSubscription(params, payload) {
    return Subscription.findOneAndUpdate(
      {
        ...params,
      },
      { ...payload },
      { new: true, runValidators: true } //returns details about the update
    );
  }

  static async deleteSubscriptionDetails(payload) {
    const subscription = await Subscription.findOneAndDelete({
      ...payload,
    });

    return subscription;
  }
}

module.exports = { SubscriptionRepository };
