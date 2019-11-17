import axios from "axios";
import { GET_PHOTO_TAGS } from "./types";
import { Auth } from "aws-amplify";

export const getPhotoTags = () => dispatch => {
  var userData;
  (async () => {
    userData = await Auth.currentSession();
    if (userData != null){
      userData = {
        userid: userData.idToken.payload["cognito:username"],
        email: userData.idToken.payload.email
      };
    }
    await axios
      .get("http://localhost:4000/users/getTags", {params: 
    {userid: userData.userid}})
      .then(res => {
        console.log("webak ", res);
        
        dispatch({
          type: GET_PHOTO_TAGS,
          payload: res.data
        });
      })
      .catch(err =>
        console.error(err));
  })();
};
