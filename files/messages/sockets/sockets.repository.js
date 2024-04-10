const { Sockets } = require("./sockets.model")

class SocketRepository {
  static createSocket(socketPayload) {
    return Sockets.create(socketPayload)
  }

  static async findSingleSocket(socketPayload) {
    return Sockets.findOne({ ...socketPayload })
  }

  static async fetchTextsByParams(socketPayload) {
    const { limit, skip, sort, ...restOfPayload } = socketPayload
    const sockets = await Sockets.find({
      ...restOfPayload,
    })
      .sort(sort)
      .skip(skip)
      .limit(limit)

    return sockets
  }

  static async deleteUser(socketId) {
    return Sockets.deleteOne({ socketId })
  }

  static async deleteMany(socketPayload) {
    return Sockets.deleteMany({ ...socketPayload })
  }
}

module.exports = { SocketRepository }
