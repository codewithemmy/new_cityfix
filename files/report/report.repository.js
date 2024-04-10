const { Report } = require("./report.model")
const mongoose = require("mongoose")

class ReportRepository {
  static async create(payload) {
    return Report.create(payload)
  }

  static async findReportWithParams(payload, select) {
    return Report.find({ ...payload })
      .select(select)
      .populate({
        path: "reporterId",
        select: "firstName lastName name profileImage accountType",
      })
  }

  static async validateReport(payload) {
    return Report.exists({ ...payload })
  }

  static async findAllReportParams(payload) {
    const { limit, skip, sort, ...restOfPayload } = payload

    const report = await Report.find({ ...restOfPayload })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate({
        path: "reporterId",
        select: "firstName lastName name profileImage accountType",
      })

    return report
  }

  static async findReportAndUpdate(id, payload) {
    const report = await Report.findByIdAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id),
      },
      { ...payload }
    )

    return report
  }

  static async reportAnalysisService(payload) {
    let { limit, skip, sort, ...query } = payload

    let { from, to, search, _id } = query

    if (!search) search = ""

    let extraParams = {}

    if (from && to)
      extraParams.date = {
        $gte: from,
        $lte: to,
      }

    if (_id)
      extraParams = {
        _id: new mongoose.Types.ObjectId(_id),
      }

      //  const report = await Report.find()
    const report = await Report.aggregate([
      {
        $addFields: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        },
      },
      {
        $lookup: {
          from: "user",
          localField: "reporterId",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                firstName: 1,
                lastName: 1,
                email: 1,
                accountType: 1,
                profileImage: 1,
              },
            },
          ],
          as: "reporter",
        },
      },
      {
        $lookup: {
          from: "user",
          localField: "reportedUser",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                firstName: 1,
                lastName: 1,
                email: 1,
                accountType: 1,
                profileImage: 1,
              },
            },
          ],
          as: "reportedUser",
        },
      },
      {
        $match: {
          $and: [
            {
              $or: [
                { "reporter.firstName": { $regex: search, $options: "i" } },
                { "reporter.lastName": { $regex: search, $options: "i" } },
                { "reporter.email": { $regex: search, $options: "i" } },
              ],
              ...extraParams,
            },
          ],
        },
      },
    ])
      .sort(sort)
      .skip(skip)
      .limit(limit)

    return report
  }

  static async countAllReportParams() {
    return await Report.countDocuments()
  }
}

module.exports = { ReportRepository }
