import { combineReducers } from "redux";
import userReducer from "./userReducer";
import uploadReducer from "./uploadReducer";
import getPicsSocialReducer from "./getPicsSocialReducer";
import tagReducer from "./tagReducer";

export default combineReducers({
  user: userReducer,
  upload: uploadReducer,
  photos: getPicsSocialReducer,
  tags: tagReducer
});
