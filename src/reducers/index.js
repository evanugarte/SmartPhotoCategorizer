import { combineReducers } from "redux";
import userReducer from "./userReducer";
import uploadReducer from "./uploadReducer";

export default combineReducers({
  user: userReducer,
  upload: uploadReducer,
});
