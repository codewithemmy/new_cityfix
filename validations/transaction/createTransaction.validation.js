const createTransactionValidation = {
  amount: {
    notEmpty: true,
    errorMessage: "amount name cannot be empty",
  },
  userId: {
    notEmpty: true,
    errorMessage: "userId cannot be empty",
  },
  subscriptionId: {
    notEmpty: true,
    errorMessage: "subscriptionId cannot be empty",
  },
}

module.exports = { createTransactionValidation }
