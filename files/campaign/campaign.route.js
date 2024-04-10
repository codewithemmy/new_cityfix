const campaignRoute = require("express").Router()
const { isAuthenticated } = require("../../utils")
const { getCampaignController } = require("./campaign.controller")

campaignRoute.route("/").get(getCampaignController)

//routes

module.exports = campaignRoute
