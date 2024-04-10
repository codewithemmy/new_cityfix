const { User } = require("../../files/user/user.model")

const loginUserValidation = {
  email: {
    notEmpty: true,
    errorMessage: "Email cannot be empty",
    isEmail: {
      errorMessage: "Invalid email address",
    },
  },
  password: {
    notEmpty: true,
    errorMessage: "Password cannot be empty",
  },
}

module.exports = { loginUserValidation }
