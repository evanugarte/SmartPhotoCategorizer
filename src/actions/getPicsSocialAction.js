import axios from "axios";
import { GET_PICS_SOCIAL } from "./types";
import { Auth } from "aws-amplify";

export const getPicsSocialAction = (query = {}, history) => dispatch => {
  (async () => {
    var userData;
    if (query.email === null) {
      userData = await Auth.currentSession();
      if (userData != null){
        userData = {
          userid: userData.idToken.payload["cognito:username"],
          email: userData.idToken.payload.email
        };
      }
    } else {
      userData = query;
    }
    await axios
      .get("http://backend172.ngrok.io/users/getPhotoSocial", {params: 
    {userid: userData.userid}})
      .then(res => {
        dispatch({
          type: GET_PICS_SOCIAL,
          payload: res.data
        });
      })
      .catch(err =>
        console.error(err));
  })();
};
