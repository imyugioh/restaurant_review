const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateReview(data) {
  let errors = {};
  data.comment = !isEmpty(data.comment) ? data.comment : "";

  if (Validator.isEmpty(data.comment)) {
    errors.comment = "Name field is required";
  }

  if (data.rate < 1 || data.rate > 5) {
    errors.rate = "Invalid Rate";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
