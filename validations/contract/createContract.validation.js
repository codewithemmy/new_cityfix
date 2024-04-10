const createContractValidation = {
  assignedTo: {
    notEmpty: true,
    errorMessage: "assignedTo name cannot be empty",
  },
  contractPurpose: {
    notEmpty: true,
    errorMessage: "contractPurpose cannot be empty",
  },
}

module.exports = { createContractValidation }
