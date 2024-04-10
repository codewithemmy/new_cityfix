const {
  AlphaNumeric,
  hashPassword,
  verifyToken,
  generateOtp,
  isValidPassword,
} = require("../../utils")
const { sendMailNotification } = require("../../utils/email")
const createHash = require("../../utils/createHash")
const { AuthFailure, AuthSuccess } = require("./auth.messages")
const { UserRepository } = require("../user/user.repository")

// const { AdminRepository } = require("../admin/admin.repository")

class AuthService {
  static async verifyUser(body) {
    const { otp } = body
    const confirmOtp = await UserRepository.findSingleUserWithParams({
      verificationOtp: otp,
    })

    if (!confirmOtp) return { success: false, msg: AuthFailure.VERIFY_OTP }

    confirmOtp.isVerified = true
    confirmOtp.verificationOtp = ""
    confirmOtp.verified = Date.now()
    await confirmOtp.save()

    const accountType = confirmOtp.accountType

    /** send confirmation mail or sms to user */

    return {
      success: true,
      msg: AuthSuccess.VERIFY_OTP,
      accountType,
    }
  }

  static async forgotPassword(payload) {
    const { email, phoneNumber } = payload
    console.log("email", email)
    const user = await UserRepository.findSingleUserWithParams({ email })

    if (!user) return { success: false, msg: AuthFailure.FETCH }

    const { otp } = generateOtp()

    //if user is validated send opt

    //save otp to compare
    user.verificationOtp = otp
    await user.save()

    /**send otp to email or phone number*/
    const substitutional_parameters = {
      resetOtp: otp,
    }

    await sendMailNotification(
      email,
      "Reset Password",
      substitutional_parameters,
      "RESET_OTP"
    )

    return { success: true, msg: AuthSuccess.OTP_SENT, id: user._id }
  }

  static async resetPassword(body, id) {
    const { newPassword } = body

    const findUser = await UserRepository.findSingleUserWithParams({
      _id: id,
    })

    if (!findUser) return { success: false, msg: AuthFailure.FETCH }

    const passwordPattern = isValidPassword(newPassword)

    if (!passwordPattern)
      return {
        success: false,
        msg: `Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, 8 characters long.`,
      }

    findUser.password = await hashPassword(newPassword)
    findUser.verificationOtp = ""

    const saveUser = await findUser.save()

    if (!saveUser) return { success: false, msg: AuthFailure.PASSWORD_RESET }

    return { success: true, msg: AuthSuccess.PASSWORD_RESET }
  }

  static async verifyOtpService(payload) {
    const { email, phoneNumber } = payload
    const user = await UserRepository.findSingleUserWithParams({
      $or: [{ phoneNumber: phoneNumber }, { email: email }],
    })

    if (!user) return { success: false, msg: AuthFailure.FETCH }

    const { otp, expiry } = generateOtp()

    user.verificationOtp = otp

    await user.save()

    /** once the created send otp mail for verification, if accountType is citybuilder send otp to phone number*/
    const substitutional_parameters = {
      name: user.lastName,
      emailOtp: otp,
    }

    await sendMailNotification(
      email,
      "Verify OTP",
      substitutional_parameters,
      "VERIFICATION"
    )

    // await onRequestOTP(otp, validPhone.phone)

    return {
      success: true,
      msg: AuthSuccess.OTP_SENT,
      otp: otp,
    }
  }
}

module.exports = AuthService
