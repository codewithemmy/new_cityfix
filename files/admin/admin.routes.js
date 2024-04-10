const adminRoute = require("express").Router()
const { isAuthenticated, adminVerifier } = require("../../utils/index")
const { uploadManager } = require("../../utils/multer")
const {
  getReportAnalysis,
  reportResponseController,
} = require("../report/report.controller")
const { reviewListController } = require("../review/review.controller")
const {
  createCampaignController,
  getCampaignController,
  editCampaignController,
  deleteCampaignController,
} = require("../campaign/campaign.controller")
const {
  getUserController,
  searchUserController,
} = require("../user/controllers/profile.controller")
const {
  userOverviewController,
  userAnalysisController,
} = require("../user/controllers/user.controller")
const {
  adminSignUpController,
  adminLogin,
  createUserController,
  disableOrEnableController,
  deleteUserController,
  fetchAdminController,
  createMarketerController,
  enableOrDisableAdminController,
  updateAdminController,
} = require("./admin.controller")

//admin route
adminRoute.route("/").post(adminSignUpController)
adminRoute.route("/login").post(adminLogin)

adminRoute.use(isAuthenticated)

//user
adminRoute.route("/user").get(getUserController)
adminRoute.route("/search").get(searchUserController)
adminRoute.route("/create-user").post(createUserController)
adminRoute.route("/delete/:id").delete(adminVerifier, deleteUserController)
adminRoute.route("/overview").get(userOverviewController)
adminRoute.route("/user-analysis").get(userAnalysisController)
adminRoute.route("/disable/:id").patch(disableOrEnableController)

//report
adminRoute.route("/report-analysis").get(getReportAnalysis)
adminRoute.route("/report-response/:id").patch(reportResponseController)

//reviews
adminRoute.route("/review-list").get(reviewListController)

//campaign
adminRoute
  .route("/campaign")
  .post(
    uploadManager("blogImage").single("image"),
    adminVerifier,
    createCampaignController
  )
adminRoute.route("/campaign").get(getCampaignController)

adminRoute
  .route("/campaign/:id")
  .patch(uploadManager("blogImage").single("image"), editCampaignController)

adminRoute.route("/campaign/:id").delete(deleteCampaignController)

//admin profile
adminRoute.route("/me").get(fetchAdminController)

//create marketer
adminRoute.route("/create-marketer").put(createMarketerController)

//admin route for normal admin
adminRoute.route("/status/:id").patch(enableOrDisableAdminController)

adminRoute
  .route("/update")
  .patch(uploadManager("citifixWallPaper").single("image"), updateAdminController)

module.exports = adminRoute
