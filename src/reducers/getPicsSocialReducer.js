import { GET_PICS_SOCIAL } from "../actions/types";

const initialState = {
  photoData: null
};
function arrayBufferToBase64 (buffer) {
  var binary = "";
  var bytes = [].slice.call(new Uint8Array(buffer));
  bytes.forEach(b => (binary += String.fromCharCode(b)));
  return window.btoa(binary);
}
export default function (state = initialState, action) {
  switch (action.type) {
  case GET_PICS_SOCIAL:
    action.payload.map(item => {
      if (item.photo !== null){
        var base64Flag = "data:image/jpeg;base64,";
        var imageStr = arrayBufferToBase64(item.photo.data);
        const img = base64Flag + imageStr;
        item.photo.data = img;
      } else {
        item.photo.data = { data: null };
      }
    });
    return {
      ...state,
      photoData: action.payload
    };
  default:
    return state;
  }
}
