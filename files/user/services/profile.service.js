const { default: mongoose } = require("mongoose")
const {
  hashPassword,
  tokenHandler,
  verifyPassword,
  queryConstructor,
  sanitizePhoneNumber,
  generateOtp,
  isValidPassword,
} = require("../../../utils")
const createHash = require("../../../utils/createHash")
const { UserSuccess, UserFailure } = require("../user.messages")
const { UserRepository } = require("../user.repository")
const { LIMIT, SKIP, SORT } = require("../../../constants")
const {
  ProfileFailure,
  ProfileSuccess,
} = require("../messages/profile.messages")

const { ReviewService } = require("../../review/review.service")

class ProfileService {
  static async profileImage(payload, locals) {
    const { image } = payload

    const updateUser = await UserRepository.updateUserProfile(
      { _id: locals._id },
      {
        profileImage: image,
      }
    )

    if (!updateUser) return { success: false, msg: UserFailure.FETCH }

    return { success: true, msg: ProfileSuccess.UPDATE }
  }

  static async galleryService(payload, locals) {
    const { image } = payload

    const updateUser = await UserRepository.updateUserDetails(locals._id, {
      gallery: image,
    })

    if (!updateUser) return { success: false, msg: UserFailure.FETCH }

    return { success: true, msg: ProfileSuccess.UPDATE }
  }

  static async getUserService(userPayload) {
    const { error, params, limit, skip, sort } = queryConstructor(
      userPayload,
      "createdAt",
      "User"
    )
    if (error) return { success: false, msg: error }

    const allUsers = await UserRepository.findAllUsersParams({
      ...params,
      limit,
      skip,
      sort,
    })

    if (allUsers.length < 1) return { success: false, msg: UserFailure.FETCH }

    return { success: true, msg: UserSuccess.FETCH, data: allUsers }
  }

  static async searchUser(payload) {
    const { search, accountType } = payload
    let query

    if (accountType && search) {
      query = {
        $or: [
          { profession: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
        accountType,
      }
    } else if (accountType) {
      query = {
        accountType: accountType,
      }
    } else {
      query = {
        $or: [
          { profession: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }
    }

    const user = await this.getUserService(query)

    if (!user) return { success: false, msg: UserFailure.SEARCH_ERROR }

    return {
      success: true,
      msg: UserSuccess.FETCH,
      data: user,
    }
  }

  static async userGalleryService(locals) {
    const user = await UserRepository.findSingleUserWithParams({
      _id: locals._id,
    })

    if (!user) return { success: false, msg: UserFailure.FETCH }

    return { success: true, msg: UserSuccess.FETCH, data: user.gallery }
  }

  static async UpdateUserService(body, locals) {
    delete body.email
    const user = await UserRepository.findSingleUserWithParams({
      _id: locals._id,
    })

    let locationCoord

    if ((body.lng && body.lat) || body.address) {
      locationCoord = {
        address: body.address,
        type: "Point",
        coordinates: [parseFloat(body.lng), parseFloat(body.lat)],
      }
    }

    if (!user) return { success: false, msg: UserFailure.FETCH }

    const updateUser = await UserRepository.updateUserProfile(
      { _id: locals._id },
      {
        ...body,
        locationCoord,
      }
    )

    if (!updateUser) return { success: false, msg: UserFailure.UPDATE }

    if (
      updateUser.state &&
      updateUser.localGovernment &&
      updateUser.profession &&
      updateUser.ninDriverLicense
    ) {
      updateUser.profileUpdated = true
      await updateUser.save()
    }

    return { success: true, msg: UserSuccess.UPDATE }
  }

  static async changePasswordService(body, locals) {
    const { currentPassword, newPassword } = body

    const user = await UserRepository.findSingleUserWithParams({
      _id: locals._id,
    })

    if (!user) return { success: false, msg: UserFailure.UPDATE }

    const isPassword = await verifyPassword(currentPassword, user.password)

    if (!isPassword) return { success: false, msg: UserFailure.UPDATE }

    const passwordPattern = isValidPassword(newPassword)

    if (!passwordPattern)
      return {
        success: false,
        msg: `Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, 8 characters long.`,
      }


    user.password = await hashPassword(newPassword)
    const updateUser = await user.save()

    if (!updateUser) return { success: false, msg: UserFailure.UPDATE }

    return { success: true, msg: UserSuccess.UPDATE }
  }

  static async deleteAccountService(locals) {
    const deleteAccount = await UserRepository.deleteAccount({
      _id: new mongoose.Types.ObjectId(locals),
    })

    if (!deleteAccount) return { success: false, msg: UserFailure.DELETE }

    return { success: true, msg: UserSuccess.DELETE }
  }

  static async getUserProfileService(payload) {
    const user = await this.getUserService(payload)

    if (!user) return { success: false, msg: UserFailure.FETCH }

    return {
      success: true,
      msg: UserSuccess.FETCH,
      data: user,
    }
  }

  static async deleteGalleryService(payload, locals) {
    let { url } = payload

    const isGallery = await UserRepository.findSingleUserWithParams({
      _id: new mongoose.Types.ObjectId(locals),
      gallery: { $in: url },
    })

    if (!isGallery) return { success: false, msg: UserFailure.FETCH }

    const deleteGallery = await UserRepository.updateUserById(locals, {
      $pull: { gallery: url },
    })

    if (!deleteGallery) {
      return { success: false, msg: UserFailure.DELETE }
    } else {
      return {
        success: true,
        msg: UserSuccess.DELETE,
      }
    }
  }

  static async switchUserServices(payload, locals) {
    const user = await UserRepository.findSingleUserWithParams({
      _id: new mongoose.Types.ObjectId(locals._id),
    })

    if (!user) return { success: false, msg: UserFailure.SWITCH }

    await UserRepository.updateUserById(locals._id, {
      ...payload,
    })

    return { success: true, msg: UserSuccess.SWITCH, data: user }
  }

  static async getReferralsService(id) {
    const referrals = await UserRepository.findSingleUserWithParams(
      {
        _id: new mongoose.Types.ObjectId(id),
      },
      { usersReferred: 1 },
      "usersReferred"
    )

    if (!referrals) return { success: false, msg: UserFailure.FETCH }

    return {
      success: true,
      msg: UserSuccess.FETCH,
      data: referrals,
    }
  }

  static async getCityBuilderCoord(userPayload) {
    const { error, params, limit, skip, sort } = queryConstructor(
      userPayload,
      "createdAt",
      "User"
    )
    if (error) return { success: false, msg: error }

    const allUsers = await UserRepository.findCityBuilderByCoordinates({
      ...params,
      limit,
      skip,
      sort,
    })

    if (allUsers.length < 1) return { success: true, msg: UserSuccess.LOCATION }

    return { success: true, msg: UserSuccess.FETCH, data: allUsers }
  }

  static async searchCityBuilder(payload) {
    const { search, accountType, lat, lng } = payload
    let query

    if (accountType && search && lat && lng) {
      query = {
        $or: [
          { profession: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
        accountType,
        lat,
        lng,
      }
    } else if (accountType && lat && lng) {
      query = {
        accountType: accountType,
        lat,
        lng,
      }
    } else {
      query = {
        search: "",
      }
    }

    const cityBuilder = await this.getCityBuilderCoord(query)

    if (!cityBuilder) return { success: false, msg: UserFailure.SEARCH_ERROR }

    return {
      success: true,
      msg: UserSuccess.FETCH,
      data: cityBuilder,
    }
  }
}

module.exports = { ProfileService }
