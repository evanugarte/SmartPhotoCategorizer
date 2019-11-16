import { combineReducers } from "redux";
import userReducer from "./userReducer";
import uploadReducer from "./uploadReducer";
import getPicsSocialReducer from "./getPicsSocialReducer";

export default combineReducers({
  user: userReducer,
  upload: uploadReducer,
  photos: getPicsSocialReducer
});
