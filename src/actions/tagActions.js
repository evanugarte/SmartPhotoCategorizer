import axios from "axios";
import { GET_TAGS, GET_PHOTOS_BY_TAG } from "./types";
import { Auth } from "aws-amplify";

export const getPhotoTags = () => dispatch => {
  var userData;
  (async () => {
    userData = await Auth.currentSession();
    if (userData != null) {
      userData = {
        userid: userData.idToken.payload["cognito:username"],
        email: userData.idToken.payload.email
      };
    }
    await axios
      .get("http://localhost:4000/users/getTags", {
        params:
          { userid: userData.userid }
      })
      .then(res => {
        dispatch({
          type: GET_TAGS,
          payload: res.data
        });
      })
      .catch(err =>
        console.error(err));
  })();

};

export const getPhotoByTag = (photoTag) => dispatch => {
  var userData;
  (async () => {
    userData = await Auth.currentSession();
    if (userData != null) {
      userData = {
        userid: userData.idToken.payload["cognito:username"],
        email: userData.idToken.payload.email
      };
    }
    await axios
      .get("http://localhost:4000/users/getPhotoByTag", {
        params:
          { tag: photoTag }
      })
      .then(res => {
        dispatch({
          type: GET_PHOTOS_BY_TAG,
          payload: res.data
        });
      })
      .catch(err =>
        console.error(err));
  })();
};
