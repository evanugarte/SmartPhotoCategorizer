import { UPDATE_PROFILE } from "../actions/types";
import imageholder from '../components/user.png';


const initialState = {
  userInfo: {email: "dummyemail@gmail.com", password: "dummypass", avatar:[{source: imageholder}] }
};

export default function (state = initialState, action) {
  switch (action.type) {
  case UPDATE_PROFILE:
    return  {
      ...state,
      userInfo: action.payload
    };
  default:
    return state;
  }
}
