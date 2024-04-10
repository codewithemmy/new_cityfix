const mongoose = require("mongoose")
const { config } = require("../../core/config")

const {
  TransactionMessages,
} = require("../../files/transaction/transaction.messages")
const {
  TransactionRepository,
} = require("../../files/transaction/transaction.repository")

const RequestHandler = require("../../utils/axios.provision")
const { providerMessages } = require("../providers.messages")
const {
  NotificationService,
} = require("../../files/notification/notification.service")
const { UserRepository } = require("../../files/user/user.repository")

class PaystackPaymentService {
  paymentRequestHandler = RequestHandler.setup({
    baseURL: config.PAYSTACK_URL,
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${config.PAYSTACK_KEY}`,
      "Accept-Encoding": "gzip,deflate,compress",
    },
  })

  checkSuccessStatus(status, gatewayResponse) {
    if (status === "success") return { success: true, msg: gatewayResponse }

    return { success: false, msg: gatewayResponse }
  }

  async verifySuccessOfPayment(payload) {
    const statusVerification = this.checkSuccessStatus(
      payload.status,
      payload.gateway_response
    )

    let responseStatus = "pending"
    if (statusVerification.success) {
      responseStatus = "confirmed"
    } else {
      responseStatus = "failed"
    }

    const updatedExisting =
      await TransactionRepository.updateTransactionDetails(
        { reference: payload.reference },
        { status: responseStatus, metaData: JSON.stringify(payload) }
      )

    if (!updatedExisting)
      return { success: false, msg: TransactionMessages.PAYMENT_FAILURE }

    return {
      success: statusVerification.success,
      msg: statusVerification.msg,
    }
  }

  async initiatePayment(paymentPayload) {
    const { email, amount } = paymentPayload

    const paystackResponse = await this.paymentRequestHandler({
      method: "POST",
      url: "/transaction/initialize",
      data: {
        amount,
        email,
      },
    })

    if (!paystackResponse.status)
      return { success: false, msg: providerMessages.INITIATE_PAYMENT_FAILURE }

    const paystackData = paystackResponse.data.data

    const response = {
      authorizationUrl: paystackData.authorization_url,
      accessCode: paystackData.access_code,
      reference: paystackData.reference,
    }

    return {
      success: true,
      msg: providerMessages.INITIATE_PAYMENT_SUCCESS,
      data: response,
    }
  }

  async verifyCardPayment(payload) {
    //check success of transaction
    const { data } = payload
    const transaction = await TransactionRepository.fetchOne({
      reference: data.reference,
    })

    if (!transaction?._id)
      return { success: false, msg: TransactionMessages.TRANSACTION_NOT_FOUND }

    if (transaction?.status != "pending")
      return { success: false, msg: TransactionMessages.DUPLICATE_TRANSACTION }

    const verifyAndUpdateTransactionRecord = await this.verifySuccessOfPayment(
      data
    )

    if (!verifyAndUpdateTransactionRecord.success) {
      return { success: false, msg: verifyAndUpdateTransactionRecord.msg }
    }

    if (!verifyAndUpdateTransactionRecord.success) {
      await NotificationService.create({
        userId: new mongoose.Types.ObjectId(transaction.userId),
        recipient: "Admin",
        message: `Unconfirmed/failed payment of ${data.amount}`,
        title: "Payment",
      })
      return { success: false, msg: TransactionMessages.PAYMENT_FAILURE }
    }

    //if payment is successful, create a notification for the user
    await NotificationService.create({
      userId: new mongoose.Types.ObjectId(transaction.userId),
      recipient: "Admin",
      message: `Successful payment of ${data.amount}`,
      title: "Payment",
    })

    let currentDate = new Date()
    currentDate.setDate(
      currentDate.getDate() + transaction.subscriptionId.duration
    )

    const user = await UserRepository.findSingleUserWithParams({
      _id: new mongoose.Types.ObjectId(transaction.userId),
    })

    if (!user) return { success: false, msg: `Payment made by invalid user` }

    user.subExpiryDate = currentDate
    await user.save()

    return { success: true, msg: TransactionMessages.PAYMENT_SUCCESS }
  }
}

module.exports = { PaystackPaymentService }
