import axios from "axios";
import { GET_PROFILE } from "./types";
import { Auth } from "aws-amplify";

export const updateProfileFileAction = (file, history) => dispatch => {
  var formData = new FormData();

  Object.keys(file).forEach(key => {
    formData.append(key, file[key]);
  });


  axios
    .post("http://backend172.ngrok.io/users/updateprofile", formData)
    .then(res => {
      history.push("/");
    })
    .catch(err => console.error(err));
};

export const getProfileFileAction = (query = {}, history) => dispatch => {
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
      .get("http://backend172.ngrok.io/users/getprofile", {params:
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