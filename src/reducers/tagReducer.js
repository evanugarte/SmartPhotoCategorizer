import { GET_PHOTO_TAGS } from "../actions/types";

const initialState = {
  images: null
};

export default function(state = initialState, action) {
  switch (action.type) {
  case GET_PHOTO_TAGS:
    return {
      ...state,
      tags: action.payload
    };
  default:
    return state;
  }
}
