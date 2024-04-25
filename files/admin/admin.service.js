const mongoose = require("mongoose")
const { AdminRepository } = require("./admin.repository")
const {
  hashPassword,
  verifyPassword,
  tokenHandler,
  queryConstructor,
  isValidPassword,
} = require("../../utils/index")
const { authMessages } = require("./messages/auth.messages")
const { adminMessages } = require("./messages/admin.messages")
const { UserRepository } = require("../user/user.repository")

class AdminAuthService {
  static async adminSignUpService(body) {
    const admin = await AdminRepository.fetchAdmin({
      email: body.email,
    })

    if (admin) {
      return { success: false, msg: authMessages.ADMIN_EXISTS }
    }

    const passwordPattern = isValidPassword(body.password)

   if (!passwordPattern)
     return {
       success: false,
       msg: `Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, 8 characters long.`,
     }

    const password = await hashPassword(body.password)
    const signUp = await AdminRepository.create({ ...body, password })

    return { success: true, msg: authMessages.ADMIN_CREATED, data: signUp }
  }

  static async adminLoginService(body) {
    const admin = await AdminRepository.fetchAdmin({
      email: body.email,
    })

    if (!admin) {
      return {
        success: false,
        msg: authMessages.LOGIN_ERROR,
      }
    }

    const passwordCheck = await verifyPassword(body.password, admin.password)

    if (!passwordCheck) {
      return { success: false, msg: authMessages.LOGIN_ERROR }
    }

    const token = await tokenHandler({
      _id: admin._id,
      email: admin.email,
      accountType: admin.accountType,
      status: admin.status,
      isAdmin: true,
    })

    admin.password = undefined
    return {
      success: true,
      msg: authMessages.ADMIN_FOUND,
      data: { admin, ...token },
    }
  }

  static async getAdminService(userPayload) {
    const { error, params, limit, skip, sort } = queryConstructor(
      userPayload,
      "createdAt",
      "Admin"
    )
    if (error) return { success: false, msg: error }

    const getAdmin = await AdminRepository.findAdminParams({
      ...params,
      limit,
      skip,
      sort,
    })

    if (getAdmin.length < 1)
      return { success: false, msg: authMessages.ADMIN_NOT_FOUND }

    return { success: true, msg: authMessages.ADMIN_FOUND, data: getAdmin }
  }

  static async updateAdminService(data, id) {
    const { body, image } = data

    const admin = await AdminRepository.updateAdminDetails(
      { _id: new mongoose.Types.ObjectId(id) },
      { ...body, image }
    )

    delete admin.password

    if (!admin) {
      return {
        success: false,
        msg: adminMessages.UPDATE_PROFILE_FAILURE,
      }
    } else {
      return {
        success: true,
        msg: adminMessages.UPDATE_PROFILE_SUCCESS,
        admin,
      }
    }
  }

  static async changePassword(body) {
    const { prevPassword } = body

    const admin = await AdminRepository.fetchAdmin({
      _id: new mongoose.Types.ObjectId(body.id),
    })

    if (!admin) return { success: false, msg: authMessages.ADMIN_NOT_FOUND }

    //verify password
    const prevPasswordCheck = await verifyPassword(prevPassword, admin.password)

    if (!prevPasswordCheck)
      return { success: false, msg: authMessages.INCORRECT_PASSWORD }

    //change password
    if (body.password !== body.confirmPassword) {
      return {
        success: false,
        msg: "Passwords mismatch",
      }
    }

    let password = await hashPassword(body.password)

    const changePassword = await AdminRepository.updateAdminDetails(
      { _id: new mongoose.Types.ObjectId(body.id) },
      {
        password,
      }
    )

    if (changePassword) {
      return {
        success: true,
        msg: authMessages.PASSWORD_RESET_SUCCESS,
      }
    } else {
      return {
        success: false,
        msg: authMessages.PASSWORD_RESET_FAILURE,
      }
    }
  }

  static async uploadImageService(data, payload) {
    const { image } = data
    const user = await this.updateAdminService({
      params: { id: mongoose.Types.ObjectId(payload._id) },
      body: { image },
    })
    if (!user) {
      return {
        success: false,
        msg: adminMessages.UPDATE_IMAGE_FAILURE,
      }
    } else {
      return {
        success: true,
        msg: adminMessages.UPDATE_IMAGE_SUCCESS,
        user,
      }
    }
  }

  static async getLoggedInAdminService(adminPayload) {
    const { _id } = adminPayload
    const getAdmin = await AdminRepository.fetchAdmin({
      _id: new mongoose.Types.ObjectId(_id),
    })

    if (!getAdmin) return { success: false, msg: authMessages.ADMIN_NOT_FOUND }

    return { success: true, msg: authMessages.ADMIN_FOUND, data: getAdmin }
  }

  static async disableOrEnableService(userId, body) {
    const user = await UserRepository.findSingleUserWithParams({
      _id: new mongoose.Types.ObjectId(userId),
    })

    if (!user) return { success: false, msg: authMessages.USER_NOT_FOUND }

    const updateUser = await UserRepository.updateUserById(userId, {
      ...body,
    })

    if (!updateUser)
      return { success: false, msg: adminMessages.UPDATE_PROFILE_FAILURE }

    return {
      success: true,
      msg: adminMessages.UPDATE_PROFILE_SUCCESS,
    }
  }

  static async fetchAdminServices(locals) {
    const admin = await AdminRepository.fetchAdmin({
      _id: new mongoose.Types.ObjectId(locals),
    })

    if (!admin) return { success: false, msg: adminMessages.NO_ADMIN_FOUND }

    return {
      success: true,
      msg: adminMessages.ADMIN_FOUND,
      data: admin,
    }
  }

  static async createMarketerService(payload) {
    const user = await UserRepository.findSingleUserWithParams({
      email: payload.email,
    })

    if (!user)
      return { success: false, msg: adminMessages.MARKETER_NOT_CREATED }

    const referral = `cityfix.com/marketer/${user._id}-referral-link`

    const referralUsed = await UserRepository.findSingleUserWithParams({
      referralLink: referral,
    })

    if (referralUsed)
      return { success: false, msg: adminMessages.REFERRAL_USED }

    user.referralLink = referral
    user.accountType = "Marketer"
    const userLink = await user.save()

    return {
      success: true,
      msg: adminMessages.MARKETER_CREATED,
      data: userLink,
    }
  }

  static async disableOrEnableAdminService(adminId, body) {
    const admin = await AdminRepository.fetchAdmin({
      _id: new mongoose.Types.ObjectId(adminId),
    })

    if (!admin) return { success: false, msg: adminMessages.NO_ADMIN_FOUND }

    const updateAdmin = await AdminRepository.updateAdminById(adminId, {
      ...body,
    })

    if (!updateAdmin)
      return { success: false, msg: adminMessages.UPDATE_PROFILE_FAILURE }

    return {
      success: true,
      msg: adminMessages.UPDATE_PROFILE_SUCCESS,
    }
  }
}

module.exports = { AdminAuthService }
