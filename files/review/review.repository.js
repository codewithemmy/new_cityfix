const { Review } = require("./review.model")
const mongoose = require("mongoose")

class ReviewRepository {
  static async create(payload) {
    return Review.create(payload)
  }

  static async validateReview(payload) {
    return Review.exists({ ...payload })
  }

  static async findAllReviewParams(payload) {
    const { limit, skip, sort, ...restOfPayload } = payload

    const report = await Review.find({ ...restOfPayload })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate({ path: "reviewer", select: "name firstName lastName profileImage" })

    return report
  }

  // static async reviewList(payload) {
  //   let { limit, skip, sort, ...query } = payload

  //   let { from, to, _id } = query

  //   let extraParams = {}

  //   if (from && to)
  //     extraParams.date = {
  //       $gte: from,
  //       $lte: to,
  //     }

  //   if (_id)
  //     extraParams = {
  //       _id: new mongoose.Types.ObjectId(_id),
  //     }

  //   const review = await Review.aggregate([
  //     {
  //       $addFields: {
  //         date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: "user",
  //         localField: "reviewer",
  //         foreignField: "_id",
  //         pipeline: [
  //           {
  //             $project: {
  //               name: 1,
  //               firstName: 1,
  //               lastName: 1,
  //               email: 1,
  //               profileImage: 1,
  //             },
  //           },
  //         ],
  //         as: "reviewer",
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: "user",
  //         localField: "reviewedMadeFor",
  //         foreignField: "_id",
  //         pipeline: [
  //           {
  //             $project: {
  //               name: 1,
  //               firstName: 1,
  //               lastName: 1,
  //               email: 1,
  //               profileImage: 1,
  //             },
  //           },
  //         ],
  //         as: "reviewedMadeFor",
  //       },
  //     },
  //     {
  //       $match: {
  //         ...extraParams,
  //       },
  //     },
  //   ])
  //

  //   return review
  // }

  static async reviewList(payload) {
    let { limit, skip, sort, ...query } = payload
    let { from, to, _id } = query
    let extraParams = {}

    if (from && to) {
      extraParams.date = {
        $gte: from,
        $lte: to,
      }
    }

    if (_id) {
      extraParams = {
        _id: new mongoose.Types.ObjectId(_id),
      }
    }

    const review = await Review.aggregate([
      {
        $addFields: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        },
      },
      {
        $lookup: {
          from: "user",
          localField: "reviewer",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                firstName: 1,
                lastName: 1,
                email: 1,
                profileImage: 1,
              },
            },
          ],
          as: "reviewer",
        },
      },
      {
        $lookup: {
          from: "user",
          localField: "reviewedMadeFor",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                firstName: 1,
                lastName: 1,
                email: 1,
                profileImage: 1,
              },
            },
          ],
          as: "reviewedMadeFor",
        },
      },
      {
        $match: {
          ...extraParams,
        },
      },
      {
        $group: {
          _id: null, // Group all documents together (since we want the average of all reviews)
          averageRating: { $avg: "$rating" }, // Calculate the average of the "rating" field
          reviews: { $push: "$$ROOT" }, // Preserve the original review documents in an array
        },
      },
      {
        $project: {
          _id: 0, // Exclude the "_id" field from the result
          averageRating: 1, // Include the calculated average rating in the result
          reviews: {
            $slice: ["$reviews", skip, limit], // Apply skip and limit to the array of reviews
          },
        },
      },
    ])
      .sort(sort)
      .skip(skip)
      .limit(limit)

    return review[0] // Since we grouped all documents together, the result will be a single object.
  }
}

module.exports = { ReviewRepository }
