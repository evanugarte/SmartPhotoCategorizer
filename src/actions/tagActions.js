import axios from "axios";
import { GET_TAGS, GET_PHOTOS_BY_TAG } from "./types";
import { Auth } from "aws-amplify";

export const getPhotoTags = (query = {}) => dispatch => {
  (async () => {
    var userData;
    if (query.email === null) {
      userData = await Auth.currentSession();
      if (userData != null) {
        userData = {
          userid: userData.idToken.payload["cognito:username"],
          email: userData.idToken.payload.email
        };
      }
  } else {
    userData = query;
  }
    await axios
      .get("https://backend172.ngrok.io/users/getTags", {
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
  (async () => {
    await axios
      .get("https://backend172.ngrok.io/users/getPhotoByTag", {
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
