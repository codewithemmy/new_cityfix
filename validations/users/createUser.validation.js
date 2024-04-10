const { User } = require("../../files/user/user.model")

const createUserValidation = {
  firstName: {
    notEmpty: true,
    errorMessage: "First name cannot be empty",
  },
  lastName: {
    notEmpty: true,
    errorMessage: "Last name cannot be empty",
  },
  email: {
    notEmpty: true,
    errorMessage: "Email cannot be empty",
    isEmail: {
      errorMessage: "Invalid email address",
    },
    custom: {
      options: (v) => {
        return User.find({
          email: v,
        }).then((user) => {
          if (user.length > 0) {
            return Promise.reject("Email already in use")
          }
        })
      },
    },
  },
  password: {
    notEmpty: true,
    errorMessage: "Password cannot be empty",
  },
  phoneNumber: {
    notEmpty: true,
    errorMessage: "Phone Number cannot be empty",
    isLength: {
      errorMessage: "Phone Number should be at least 11 digits long",
      options: { min: 11 },
    },
    custom: {
      options: (v) => {
        return User.find({
          phoneNumber: v,
        }).then((user) => {
          if (user.length > 0) {
            return Promise.reject("Phone number already in use")
          }
        })
      },
    },
  },
}

module.exports = { createUserValidation }
