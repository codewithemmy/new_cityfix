const contractRoute = require("express").Router()
const { isAuthenticated } = require("../../utils")

const { checkSchema } = require("express-validator")
const { validate } = require("../../validations/validate")

const {
  createContractController,
  getContractController,
  startContractController,
  declineContractController,
  endContractController,
} = require("./contract.controller")

const {
  createContractValidation,
} = require("../../validations/contract/createContract.validation")

contractRoute.use(isAuthenticated)

//routes
contractRoute.route("/end/:id").put(endContractController)
contractRoute
  .route("/")
  .post(
    validate(checkSchema(createContractValidation)),
    createContractController
  )
contractRoute.route("/start/:id").put(startContractController)
contractRoute.route("/").get(getContractController)
contractRoute.route("/decline/:id").put(declineContractController)

module.exports = contractRoute
