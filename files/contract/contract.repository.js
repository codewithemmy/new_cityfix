const { Contract } = require("./contract.model")
const mongoose = require("mongoose")

class ContractRepository {
  static async create(payload) {
    return Contract.create(payload)
  }

  static async findContractWithParams(payload, select) {
    return Contract.find({ ...payload }).select(select)
  }

  static async findSingleContractWithParams(payload, select) {
    return Contract.findOne({ ...payload }).select(select)
  }

  static async validateContract(payload) {
    return Contract.exists({ ...payload })
  }

  static async findAllContractsParams(payload) {
    const { limit, skip, sort, ...restOfPayload } = payload

    const contract = await Contract.find({ ...restOfPayload })
      .sort(sort)
      .skip(skip)
      .limit(limit)

    return contract
  }

  static async updateContractDetails(id, params) {
    return Contract.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id) },
      { $push: { ...params } } //returns details about the update
    )
  }

  static async updateSetContract(payload, params) {
    return Contract.findOneAndUpdate({ ...payload }, { $set: { ...params } })
  }

  static async countsByStatus(query) {
    const userCount = await Contract.countDocuments().where({ ...query })
    return userCount
  }

  static async searchContract(query) {
    let { search, contractStatus, assignedTo, assignedBy } = query

    if (!search) search = ""
    let twoDaysAgo = new Date()
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

    let extraParams = {}
    let extras = {}

    if (contractStatus) extraParams.contractStatus = contractStatus
    if (contractStatus === "pending") {
      extras = {
        createdAt: { $gte: twoDaysAgo }, // Less than or equal to two days ago
      }
    }

    if (assignedTo)
      extraParams.assignedTo = new mongoose.Types.ObjectId(assignedTo) // Update the field name based on how the "User" model references are stored in the "Contract" model

    if (assignedBy)
      extraParams.assignedBy = new mongoose.Types.ObjectId(assignedBy) // Update the field name based on how the "User" model references are stored in the "Contract" model

    const ContractSearch = await Contract.aggregate([
      {
        $addFields: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        },
      },
      {
        $lookup: {
          from: "user", // Collection name of the "User" model
          localField: "assignedBy", // Field in the "Contract" model that references the "User" model
          foreignField: "_id", // Field in the "User" model that corresponds to the reference
          pipeline: [
            { $project: { firstName: 1, name: 1, email: 1, profileImage: 1 } },
          ],
          as: "contractor", // Output field that will contain the matched "User" document
        },
      },
      {
        $lookup: {
          from: "user", // Collection name of the "User" model
          localField: "assignedTo", // Field in the "Contract" model that references the "User" model
          foreignField: "_id", // Field in the "User" model that corresponds to the reference
          pipeline: [
            { $project: { firstName: 1, name: 1, email: 1, profileImage: 1 } },
          ],
          as: "cityBuilder", // Output field that will contain the matched "User" document
        },
      },
      {
        $match: {
          $and: [
            {
              $or: [{ contractPurpose: { $regex: search, $options: "i" } }],
            },
          ],
          ...extraParams,
          ...extras,
        },
      },
    ])
    return ContractSearch
  }
}

module.exports = { ContractRepository }
