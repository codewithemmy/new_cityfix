const { handleApplicationErrors, notFound } = require("./response")
const express = require("express")
const cors = require("cors")
const xss = require("xss-clean")
const helmet = require("helmet")
const compression = require("compression")
const mongoSanitize = require("express-mongo-sanitize")
const emailValidation = require("./emailCheck")
const routes = require("./routes")

const app = express()

const application = (io) => {
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(helmet())
  app.use(xss())
  app.use(mongoSanitize())
  app.use(compression())
  app.use(cors())
  app.use(emailValidation)

  app.use((req, res, next) => {
    res.io = io
    next()
  })

  app.get("/", (req, res) => {
    res.status(200).json({ message: "citifix is working fine" })
  })

  routes(app)
  app.use(handleApplicationErrors) //application errors handler
  app.use(notFound)
}

module.exports = { app, application }
