import { GET_ERRORS } from "./types";

export const setError = data => {
  return {
    type: GET_ERRORS,
    payload: data
  };
};
