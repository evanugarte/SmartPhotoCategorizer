import axios from "axios";
import { UPLOAD_FILE } from "./types";

export const uploadFileAction = (file, history) => dispatch => {
  var formData = new FormData();

  Object.keys(file).forEach(key => {
    formData.append(key, file[key]);
  });


  axios
    .post(" https://backend172.ngrok.io/users/upload", formData)
    .then(res => {
      history.push("/");
      dispatch({
        type: UPLOAD_FILE,
        payload: res.data
      });
    })
    .catch(err => console.error(err));
};
