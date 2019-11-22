import axios from "axios";
import { SOCIAL_LOG_IN } from "./types";
export const loginWithFacebookGoogle = (signInInfo, history, 
  setAuthenticated) => dispatch => {
  axios
    .post("http://backend172.ngrok.io/users/signup", signInInfo)
    .then(res => {
      dispatch({
        type: SOCIAL_LOG_IN,
        payload: res.data
      });
      setAuthenticated(true);
      history.push("/");
    })
    .catch(error => {
      alert("There was an error login facebook account client.");
      console.error(error);
    });
};