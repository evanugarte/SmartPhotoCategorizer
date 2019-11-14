import axios from "axios";
import { UPDATE_PROFILE } from "./types";

export const profileFileAction = (file, history) => dispatch => {
  var formData = new FormData();

  Object.keys(file).forEach(key => {
    formData.append(key, file[key]);
  });


  axios
    .post(" http://localhost:4000/users/profile", formData)
    .then(res => {
      history.push("/");
      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data
      });
    })
    .catch(err => console.debug(err));
};
