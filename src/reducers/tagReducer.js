import { GET_TAGS, GET_PHOTOS_BY_TAG } from "../actions/types";
import { arrayBufferToBase64 } from "./userReducer";

const initialState = {
  tags: null,
  photosByTag: null
};

export default function(state = initialState, action) {
  switch (action.type) {
  case GET_TAGS:
    return {
      ...state,
      tags: action.payload
    };
  case GET_PHOTOS_BY_TAG:
    action.payload.forEach(item => {
      // console.log(item);
      if (item.photo !== null) {
        item.photo.data = arrayBufferToBase64(item.photo.data);
      } else {
        item.photo.data = { data: null };
      }
    });
    return {
      ...state,
      photosByTag: action.payload
    };
  default:
    return state;
  }
}
