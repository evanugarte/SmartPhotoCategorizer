import axios from "axios";
import { GET_PROFILE } from "./types";
import { Auth } from "aws-amplify";

export const updateProfileFileAction = (file, history) => dispatch => {
  var formData = new FormData();

  Object.keys(file).forEach(key => {
    formData.append(key, file[key]);
  });


  axios
    .post("http://localhost:4000/users/updateprofile", formData)
    .then(res => {
      history.push("/");
    })
    .catch(err => console.error(err));
};

export const getProfileFileAction = (history) => dispatch => {
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
      .get("http://localhost:4000/users/getprofile", {params:
    {userid: userData.userid}})
      .then(res => {
        dispatch({
          type: GET_PROFILE,
          payload: res.data
        });
      })
      .catch(err => console.error(err));
  })();
};