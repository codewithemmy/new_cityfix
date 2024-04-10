const mongoose = require("mongoose")
const {
  PaystackPaymentService,
} = require("../../../providers/paystack/paystack")
const {
  TransactionFailure,
  TransactionSuccess,
  TransactionMessages,
} = require("../transaction.messages")
const { TransactionRepository } = require("../transaction.repository")
const { UserRepository } = require("../../user/user.repository")
const {
  SubscriptionRepository,
} = require("../../subscription/subscription.repository")

class TransactionService {
  static paymentProvider

  static async getConfig() {
    this.paymentProvider = new PaystackPaymentService()
  }

  static async initiatePaymentTransaction(payload) {
    const { userId, amount, subscriptionId } = payload
    let currentDate = new Date()
    const user = await UserRepository.findSingleUserWithParams({
      _id: new mongoose.Types.ObjectId(userId),
    })

    if (!user) return { success: false, msg: `Invalid User` }

    if (user.subExpiryDate && user.subExpiryDate > currentDate)
      return { success: false, msg: `User has an existing subscription` }

    const subscription = await SubscriptionRepository.findSingleSubscription({
      _id: new mongoose.Types.ObjectId(subscriptionId),
    })

    if (!subscription) return { success: false, msg: `Invalid subscription Id` }

    await this.getConfig()
    const paymentDetails = await this.paymentProvider.initiatePayment({
      email: user.email,
      amount,
    })

    if (!paymentDetails.success)
      return { success: false, msg: TransactionFailure.INITIATE }

    const transaction = await TransactionRepository.create({
      userId: user._id,
      userType: "User",
      email: user.email,
      amount,
      subscriptionId,
      reference: paymentDetails.data.reference,
      channel: "paystack",
    })

    if (!transaction._id)
      return { success: false, msg: TransactionFailure.INITIATE }

    return {
      success: true,
      msg: TransactionSuccess.INITIATE,
      data: {
        ...paymentDetails,
      },
    }
  }

  static async verifyCardPayment(payload) {
    await this.getConfig()
    return this.paymentProvider.verifyCardPayment(payload)
  }
}

module.exports = { TransactionService }
