const transactionRoute = require("express").Router()
const { checkSchema } = require("express-validator")
const {
  createTransactionValidation,
} = require("../../validations/transaction/createTransaction.validation")

const { validate } = require("../../validations/validate")
const { isAuthenticated } = require("../../utils")
const {
  paymentTransactionController,
  paystackWebHook,
} = require("./controller/transaction.controller")

transactionRoute.post("/paystack-webhook", paystackWebHook)

transactionRoute.use(isAuthenticated)

transactionRoute
  .route("/initiate")
  .post(
    validate(checkSchema(createTransactionValidation)),
    paymentTransactionController
  )

//routes
module.exports = transactionRoute
