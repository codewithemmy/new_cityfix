const { application, app } = require("./app")
const dotenv = require("dotenv")
const path = require("path")
const connectToDatabase = require("./db")
const { config } = require("./config")

const httpServer = require("http").Server(app)
const { socketConnection } = require("../files/messages/sockets")

dotenv.config({ path: path.join(__dirname, "../.env") })

const port = config.PORT || 5500

const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
  },
})

const startServer = () => {
  socketConnection(io)
  application(io)
  connectToDatabase()

  httpServer.listen(port, () => {
    console.log(`Application running on port ${port}`)
  })

  // Handle unhandled promise rejections and exceptions
  process.on("unhandledRejection", (err) => {
    console.log(err.message)
    process.exit(1)
  })

  process.on("uncaughtException", (err) => {
    console.log(err.message)
    process.exit(1)
  })
}

module.exports = startServer
