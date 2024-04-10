const dotenv = require("dotenv")
const path = require("path")
dotenv.config({ path: path.join(__dirname, "../.env") })

module.exports.config = {
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  SOCKET_SERVER: process.env.SOCKET_IO,
  PAYSTACK_URL: process.env.PAYSTACK_BASE_URL,
  PAYSTACK_KEY: process.env.PAYSTACK_SK_KEY,
}
