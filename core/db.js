const mongoose = require("mongoose")
const { config } = require("./config")

const connectToDatabase = async () => {
  mongoose.set("strictQuery", false)

  mongoose.connect(`${config.MONGO_URL}`)

  const conn = mongoose.connection.on("connected", () => {
    console.log("Database Connected")
  })

  return { conn }
}

module.exports = connectToDatabase
