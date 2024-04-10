const { Campaign } = require("./campaign.model")
const mongoose = require("mongoose")

class CampaignRepository {
  static async create(payload) {
    return Campaign.create(payload)
  }

  static async findCampaignWithParams(payload, select) {
    return Campaign.find({ ...payload }).select(select)
  }

  static async findSingleCampaignWithParams(payload, select) {
    return Campaign.findOne({ ...payload }).select(select)
  }

  static async validateCampaign(payload) {
    return Campaign.exists({ ...payload })
  }

  static async findAllCampaignParams(payload) {
    const { limit, skip, sort, ...restOfPayload } = payload

    const campaign = await Campaign.find({ ...restOfPayload })
      .sort(sort)
      .skip(skip)
      .limit(limit)

    return campaign
  }

  static async updateCampaignDetails(id, params) {
    return Campaign.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id) },
      { $push: { ...params } } //returns details about the update
    )
  }

  static async fetchAndUpdateCampaign(id, params) {
    return Campaign.findByIdAndUpdate(
      { _id: new mongoose.Types.ObjectId(id) },
      { ...params },
      { new: true, runValidators: true }
    )
  }

  static async updateSetCampaign(payload, params) {
    return Campaign.findOneAndUpdate({ ...payload }, { $set: { ...params } })
  }
  static async deleteCampaign(id) {
    return Campaign.findByIdAndDelete({ _id: new mongoose.Types.ObjectId(id) })
  }

  static async countsByStatus(query) {
    const campaignCount = await Campaign.countDocuments().where({ ...query })
    return campaignCount
  }
}

module.exports = { CampaignRepository }
