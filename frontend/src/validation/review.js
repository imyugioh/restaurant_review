import Validator from "validator";
import isEmpty from "./is-empty";

const validateReview = data => {
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

export default validateReview;
