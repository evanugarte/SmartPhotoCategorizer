import { UPDATE_PROFILE, GET_PROFILE } from "../actions/types";
//TODO: remove dummy email below
const initialState = {
  userInfo: {avatar: null, email: null, 
    password: null, userid: null}
};

export const arrayBufferToBase64 = (buffer) => {
  var base64Flag = "data:image/jpeg;base64,";
  var binary = "";
  var bytes = [].slice.call(new Uint8Array(buffer));
  bytes.forEach(b => (binary += String.fromCharCode(b)));
  return base64Flag + window.btoa(binary);
};

export default function(state = initialState, action) {
  switch (action.type) {
  case GET_PROFILE:
    if (action.payload.avatar !== null) {
      const img = arrayBufferToBase64(action.payload.avatar.data);
      action.payload.avatar.data = img;
    }
    return {
      ...state,
      userInfo: action.payload
    };
  case UPDATE_PROFILE:
    return {
      ...state,
      userInfo: action.payload
    };
  default:
    return state;
  }
}
