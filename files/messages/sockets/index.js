const { default: mongoose } = require("mongoose")
const { SocketRepository } = require("./sockets.repository")
const fs = require("fs")

let userDetails = []

module.exports.socketConnection = async (io) => {
  io.on("connection", async (socket) => {
    console.log(`⚡⚡: ${socket.id} user just connected!`)

    socket.on("addUser", (userId) => {
      console.log({ userId, socketId: socket._id })
      userDetails.push([{ userId, socketId: socket._id }])
    })

    io.emit("userDetails", `${userDetails}, this is for io `)
    socket.emit("userDetails", `${userDetails}, this is for socket `)

    socket.on("join", async (obj) => {
      try {
        //check to delete the socket id with the userId
        await SocketRepository.deleteMany({
          userId: new mongoose.Types.ObjectId(obj.userId),
        })

        //create a new socket
        const socketDetails = await SocketRepository.createSocket({
          socketId: socket.id,
          userId: obj.userId,
          modelType: obj.type,
        })

        //emit error sockets is not generated
        if (!socketDetails._id) {
          socket.emit("join", `Error: ${data.message}`)
        } else {
          socket.emit("join", "Connection Successful")
        }
      } catch (error) {
        console.log("socket error", error)
      }
    })

    socket.on("disconnect", async () => {
      await SocketRepository.deleteUser(socket.id)
    })

    socket.on("error", (error) => {
      fs.writeFileSync("errorlog.txt", `Error: ${error.message} /n`)
    })
  })
}
