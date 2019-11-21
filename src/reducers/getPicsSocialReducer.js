import { GET_PICS_SOCIAL } from "../actions/types";
import { arrayBufferToBase64 } from "./userReducer";

const initialState = {
  photoData: []
};

export default function(state = initialState, action) {
  switch (action.type) {
  case GET_PICS_SOCIAL:
    action.payload.forEach(item => {
      if (item.photo !== null) {
        item.photo.data = arrayBufferToBase64(item.photo.data);
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
