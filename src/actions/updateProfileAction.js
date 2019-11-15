import axios from "axios";
import { UPDATE_PROFILE, GET_PROFILE } from "./types";

export const updateProfileFileAction = (file, history) => dispatch => {
  var formData = new FormData();

  Object.keys(file).forEach(key => {
    formData.append(key, file[key]);
  });


  axios
    .post("http://localhost:4000/users/updateprofile", formData)
    .then(res => {
      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data
      });
      history.push("/");
    })
    .catch(err => console.error(err));
};

export const getProfileFileAction = (query, history) => dispatch => {
  axios
    .post(" http://localhost:4000/users/getprofile", query)
    .then(res => {
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      });
    })
    .catch(err => console.error(err));
};