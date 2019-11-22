import axios from "axios";
import { SOCIAL_LOG_IN } from "./types";
export const loginWithFacebookGoogle = (signInInfo, history, 
  setAuthenticated) => dispatch => {
  axios
    .post("http://localhost:4000/users/signup", signInInfo)
    .then(res => {
      dispatch({
        type: SOCIAL_LOG_IN,
        payload: res.data
      });
      setAuthenticated(true);
      history.push("/");
      alert("Successfully login facebook account client.");
    })
    .catch(error => {
      alert("There was an error login facebook account client.");
      console.log(error);
    });
};