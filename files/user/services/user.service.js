const mongoose = require("mongoose")
const {
  hashPassword,
  tokenHandler,
  verifyPassword,
  queryConstructor,
  sanitizePhoneNumber,
  generateOtp,
  isValidPassword,
} = require("../../../utils")
const { UserSuccess, UserFailure } = require("../user.messages")
const { UserRepository } = require("../user.repository")
const { LIMIT, SKIP, SORT } = require("../../../constants")
const { sendMailNotification } = require("../../../utils/email")
const { AdminRepository } = require("../../admin/admin.repository")
const { authMessages } = require("../../admin/messages/auth.messages")

class UserService {
  static async createUser(payload) {
    const { lastName, email, referralId } = payload
    const validPhone = sanitizePhoneNumber(payload.phoneNumber)

    const phoneExist = await UserRepository.validateUser({
      phoneNumber: validPhone.phone,
    })
    if (phoneExist) return { success: false, msg: UserFailure.PHONE_EXIST }

    const userExist = await UserRepository.validateUser({
      email: payload.email,
    })

    if (userExist) return { success: false, msg: UserFailure.EXIST }
    const passwordPattern = isValidPassword(payload.password)

    if (!passwordPattern)
      return {
        success: false,
        msg: `Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, 8 characters long.`,
      }

    const { otp, expiry } = generateOtp()

    //hash password
    const user = await UserRepository.create({
      ...payload,
      phoneNumber: validPhone.phone,
      verificationOtp: otp,
      password: await hashPassword(payload.password),
    })

    if (!user._id) return { success: false, msg: UserFailure.CREATE }

    if (referralId) {
      //validate the user
      const referral = await UserRepository.findSingleUserWithParams({
        _id: referralId,
        accountType: "Marketer",
      })

      referral.referrals++
      referral.usersReferred.push(user._id)
      await referral.save()
    }

    /** once the created send otp mail for verification, if accountType is citybuilder send otp to phone number*/
    const substitutional_parameters = {
      name: lastName,
      emailOtp: user.verificationOtp,
      email,
    }

    await sendMailNotification(
      email,
      "Sign-Up",
      substitutional_parameters,
      "VERIFICATION"
    )

    return {
      success: true,
      msg: UserSuccess.CREATE,
      data: user,
    }
  }

  static async userLogin(payload) {
    const { email, phoneNumber, password } = payload

    if (email == "example@cityfixadmin.com") {
      const admin = await AdminRepository.fetchAdmin({
        email: email,
      })

      if (!admin) {
        return {
          success: false,
          msg: authMessages.LOGIN_ERROR,
        }
      }

      const passwordCheck = await verifyPassword(password, admin.password)

      if (!passwordCheck) {
        return { success: false, msg: authMessages.LOGIN_ERROR }
      }

      const adminToken = await tokenHandler({
        _id: admin._id,
        email: admin.email,
        accountType: admin.accountType,
        isAdmin: true,
      })

      const adminProfile = {
        _id: admin._id,
        email: admin.email,
        accountType: admin.accountType,
        ...adminToken,
      }

      // admin.password = undefined
      return {
        success: true,
        msg: authMessages.ADMIN_FOUND,
        data: adminProfile,
      }
    }

    const userProfile = await UserRepository.findSingleUserWithParams({
      email: email,
    })

    if (!userProfile) return { success: false, msg: `Not a valid user` }

    if (!userProfile.isVerified)
      return { success: false, msg: UserFailure.VERIFIED }

    // confirm if user has been deleted
    if (userProfile.isDelete)
      return { success: false, msg: UserFailure.SOFT_DELETE }

    if (!userProfile) return { success: false, msg: UserFailure.USER_FOUND }

    const isPassword = await verifyPassword(password, userProfile.password)

    if (!isPassword) return { success: false, msg: UserFailure.PASSWORD }

    let token

    token = await tokenHandler({
      isAdmin: false,
      _id: userProfile._id,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      phoneNumber: userProfile.phoneNumber,
      email: userProfile.email,
      accountType: userProfile.accountType,
      status: userProfile.status,
    })

    const user = {
      _id: userProfile._id,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      phoneNumber: userProfile.phoneNumber,
      email: userProfile.email,
      accountType: userProfile.accountType,
      status: userProfile.status,
      ...token,
    }

    //return result
    return {
      success: true,
      msg: `Login Successful`,
      data: user,
    }
  }

  static async rateUserService(payload, locals) {
    const { rating, comment, userId } = payload
    const { _id } = locals

    const rateUser = await UserRepository.updateUserDetails(userId, {
      review: {
        rating: rating,
        comment: comment,
        ratedBy: new mongoose.Types.ObjectId(_id),
      },
    })

    if (!rateUser) return { success: false, msg: UserFailure.UPDATE }

    return { success: true, msg: UserSuccess.UPDATE }
  }

  static async userOverviewServices() {
    const userOverview = await UserRepository.userOverview()

    if (!userOverview) return { success: false, msg: UserFailure.FETCH }

    return { success: true, msg: UserSuccess.FETCH, data: userOverview }
  }

  static async userAnalysisService(payload) {
    if (isNaN(payload.month) || payload.month < 1 || payload.month > 12)
      return { success: false, msg: `Incorrect Month or Number passed` }

    const analysis = await UserRepository.userAnalysis(payload.month)

    if (!analysis) return { SUCCESS: false, msg: UserFailure.FETCH }

    return { success: true, msg: UserSuccess.FETCH, data: analysis }
  }

  static async authLoginService(payload) {
    const { email } = payload

    const userProfile = await UserRepository.findSingleUserWithParams({
      email: email,
    })

    if (!userProfile) return { success: false, msg: UserFailure.USER_EXIST }

    if (userProfile.isVerified !== true)
      return { success: false, msg: UserFailure.VERIFIED }

    //confirm if user has been deleted
    if (userProfile.isDelete)
      return { success: false, msg: UserFailure.SOFT_DELETE }

    if (!userProfile) return { success: false, msg: UserFailure.USER_FOUND }

    let token

    token = await tokenHandler({
      _id: userProfile._id,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      email: userProfile.email,
      isAdmin: false,
    })

    const user = {
      _id: userProfile._id,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      email: userProfile.email,
      accountType: userProfile.accountType,
      status: userProfile.status,
      ...token,
    }

    //return result
    return {
      success: true,
      msg: UserSuccess.FETCH,
      data: user,
    }
  }

  static async authCreateUserService(payload) {
    const { firstName, lastName, email, accountType } = payload

    const userExist = await UserRepository.validateUser({
      email: payload.email,
    })

    if (userExist) return { success: false, msg: UserFailure.EXIST }

    //hash password
    const user = await UserRepository.create({
      firstName,
      lastName,
      email,
      accountType,
      isVerified: true,
    })

    if (!user._id) return { success: false, msg: UserFailure.CREATE }

    /** once the created send otp mail for verification, if accountType is citybuilder send otp to phone number*/
    const substitutional_parameters = {
      name: lastName,
    }

    await sendMailNotification(
      email,
      "Sign-Up",
      substitutional_parameters,
      "GOOGLE_SIGNUP"
    )

    let token

    token = await tokenHandler({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: false,
    })

    const loginDetails = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      accountType: user.accountType,
      status: user.status,
      ...token,
    }

    //return result
    return {
      success: true,
      msg: UserSuccess.CREATE,
      data: loginDetails,
    }
  }
}

module.exports = { UserService }
