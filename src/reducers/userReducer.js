import { SIGN_UP } from "../actions/types";

const initialState = {
  userInfo: null
};

export default function(state = initialState, action) {
  switch (action.type) {
  case SIGN_UP:
    return {
      ...state,
      userInfo: action.payload
    };
  default:
    return state;
  }
}
