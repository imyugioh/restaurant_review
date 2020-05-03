import { GET_ALL_RESTAURANTS } from "../actions/types";

const initialState = [];

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_RESTAURANTS:
      return action.payload;
    default:
      return state;
  }
}
