import { UPDATE_PROFILE, GET_PROFILE } from "../actions/types";


// const initialState = {
//   userInfo: {avatar: null, email: null, password: null, userid: null}
// };
//TODO: remove dummy email below
const initialState = {
  userInfo: {avatar: null, email: "dummyemail@gmail.com", password: null, userid: "asd123"}
};

function arrayBufferToBase64(buffer) {
  var binary = "";
  var bytes = [].slice.call(new Uint8Array(buffer));
  bytes.forEach(b => (binary += String.fromCharCode(b)));
  return window.btoa(binary);
}
export default function (state = initialState, action) {
  switch (action.type) {
  case GET_PROFILE:
    if(action.payload.avatar !== null){
      var base64Flag = "data:image/jpeg;base64,";
      var imageStr = arrayBufferToBase64(action.payload.avatar.data);
      const img = base64Flag + imageStr;
      action.payload.avatar.data = img;
    }
    return  {
      ...state,
      userInfo: action.payload
    };
  case UPDATE_PROFILE:
    return  {
      ...state,
      userInfo: action.payload
    };
  default:
    return state;
  }
}
