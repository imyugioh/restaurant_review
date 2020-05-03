import { combineReducers } from "redux";
import errorReducer from "./errorReducer";
import authReducer from "./authReducer";
import restsReducer from "./restsReducer";
import revsReducer from "./reviewsReducer";
import usersReducer from "./usersReducer";

export default combineReducers({
  errors: errorReducer,
  auth: authReducer,
  rests: restsReducer,
  reviews: revsReducer,
  users: usersReducer
});
