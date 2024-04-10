const mongoose = require("mongoose")
const { queryConstructor } = require("../../utils")
const { LIMIT, SKIP, SORT } = require("../../constants")
const { ContractRepository } = require("./contract.repository")
const { ContractFailure, ContractSuccess } = require("./contract.messages")
const { NotificationService } = require("../notification/notification.service")
const { UserRepository } = require("../user/user.repository")
const { UserFailure } = require("../user/user.messages")
const { sendMailNotification } = require("../../utils/email")

class ContractService {
  static async createContractService(payload, locals) {
    const contractCount = await ContractRepository.findContractWithParams(
      {
        assignedBy: new mongoose.Types.ObjectId(locals._id),
        assignedTo: new mongoose.Types.ObjectId(payload.assignedTo),
        contractStatus: "ongoing",
      },
      {}
    )

    if (contractCount.length >= 3)
      return {
        success: false,
        msg: ContractFailure.COUNT,
      }

    const contract = await ContractRepository.create({
      assignedBy: new mongoose.Types.ObjectId(locals._id),
      ...payload,
    })

    if (!contract) return { success: false, msg: ContractFailure.CREATE }

    return {
      success: true,
      msg: ContractSuccess.CREATE,
      contract,
    }
  }

  static async getContractService(payload) {
    const contract = await ContractRepository.searchContract(payload)

    if (!contract) return { success: false, msg: ContractFailure.FETCH }

    return {
      success: true,
      msg: ContractSuccess.FETCH,
      contract,
    }
  }

  static async startContractService(payload, locals) {
    const user = await UserRepository.findSingleUserWithParams(
      {
        _id: new mongoose.Types.ObjectId(locals._id),
      },
      {}
    )

    if (!user) return { success: false, msg: UserFailure.USER_FOUND }
    const contract = await ContractRepository.findSingleContractWithParams({
      _id: payload,
    })

    if (!contract) return { success: false, msg: ContractFailure.DECLINE }

    contract.status = "accepted"
    contract.contractStatus = "ongoing"
    const saveStatus = await contract.save()

    const contractor = await UserRepository.findSingleUserWithParams(
      {
        _id: new mongoose.Types.ObjectId(saveStatus.assignedBy),
      },
      {}
    )

    //send notification to user
    await NotificationService.create({
      userId: new mongoose.Types.ObjectId(locals._id),
      recipientId: new mongoose.Types.ObjectId(contractor._id),
      message: `Hi, ${contractor.firstName} has accepted your contract request, you can now send a message`,
    })

    await NotificationService.create({
      userId: new mongoose.Types.ObjectId(saveStatus.assignedBy),
      recipientId: new mongoose.Types.ObjectId(locals._id),
      message: `Hi ${user.firstName}, you accepted the contract proposed by ${contractor.firstName}`,
    })
    const substitutional_parameters = {
      assignor: contractor.firstName,
      assignee: user.firstName,
    }

    await sendMailNotification(
      contractor.email,
      "Contract Status",
      substitutional_parameters,
      "CONTRACT"
    )

    return {
      success: true,
      msg: ContractSuccess.ACCEPT,
    }
  }

  static async declineContractService(payload) {
    const contract = await ContractRepository.findSingleContractWithParams({
      _id: payload,
    })

    if (!contract) return { success: false, msg: ContractFailure.DECLINE }

    contract.contractStatus = "declined"
    await contract.save()

    return {
      success: true,
      msg: ContractSuccess.DECLINE,
    }
  }

  static async endContractService(payload) {
    const contract = await ContractRepository.findSingleContractWithParams({
      _id: payload,
    })

    if (!contract) return { success: false, msg: ContractFailure.END_CONTRACT }

    contract.contractStatus = "completed"
    await contract.save()

    return {
      success: true,
      msg: ContractSuccess.DECLINE,
    }
  }
}
module.exports = { ContractService }
