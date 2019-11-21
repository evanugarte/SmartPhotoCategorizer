import axios from "axios";
import { SIGN_UP } from "./types";

export const signUpAction = (user, history) => dispatch => {
  //console.log("signupaction-", user);
  axios
    .post(" http://localhost:4000/users/signup", user)
    .then(res => {
      //   history.push("/");
      dispatch({
        type: SIGN_UP,
        payload: res.data
      });
    })
    .catch(err => console.error(err));
};
