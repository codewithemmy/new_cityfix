const { Transaction } = require("./transaction.model")

class TransactionRepository {
  static async create(transactionPayload) {
    return Transaction.create({ ...transactionPayload })
  }

  static async fetchOne(payload) {
    return Transaction.findOne({ ...payload }).populate({
      path: "subscriptionId",
    })
  }

  static async fetch(payload, select) {
    return Transaction.find({ ...payload }).select(select)
  }

  static async updateTransactionDetails(transactionPayload, update) {
    const transaction = await Transaction.findOneAndUpdate(
      {
        ...transactionPayload,
      },
      { ...update },
      { new: true, runValidation: true } //returns details about the update
    )

    return transaction
  }
}

module.exports = { TransactionRepository }
