import { GET_REVIEWS } from "../actions/types";

const initialState = [];

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_REVIEWS:
      return action.payload;
    default:
      return state;
  }
}
