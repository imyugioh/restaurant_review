import Validator from "validator";
import isEmpty from "./is-empty";

const validateRestaurant = data => {
  let errors = {};
  data.name = !isEmpty(data.name) ? data.name : "";

  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};

export default validateRestaurant;
