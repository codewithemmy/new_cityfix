const campaignRoute = require("express").Router()
const { isAuthenticated, adminVerifier } = require("../../utils")
const { uploadManager } = require("../../utils/multer")
const {
  getCampaignController,
  createCampaignController,
  editCampaignController,
  deleteCampaignController,
} = require("./campaign.controller")

campaignRoute.route("/").get(getCampaignController)

campaignRoute.use(isAuthenticated)
//campaign
campaignRoute
  .route("/blog")
  .post(uploadManager("image").single("image"), createCampaignController)

campaignRoute
  .route("/blog/:id")
  .patch(uploadManager("image").single("image"), editCampaignController)

campaignRoute.route("/blog/:id").delete(deleteCampaignController)

module.exports = campaignRoute
