
const createReviewValidation = {
  reviewedMadeFor: {
    notEmpty: true,
    errorMessage: "reviewedMadeFor name cannot be empty",
  },
  rating: {
    notEmpty: true,
    errorMessage: "rating cannot be empty",
  },
  comment: {
    notEmpty: true,
    errorMessage: "comment cannot be empty",
  },
}

module.exports = { createReviewValidation }
