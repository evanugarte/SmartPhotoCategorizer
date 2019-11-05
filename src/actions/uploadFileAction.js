import axios from "axios";
import { UPLOAD_FILE } from "./types";

export const uploadFileAction = (file, history) => dispatch => {
  var formData = new FormData();

  Object.keys(file).forEach(key => {
    formData.append(key, file[key]);
  });


  axios
    .post(" http://localhost:4000/users/upload", formData)
    .then(res => {
      history.push("/");
      dispatch({
        type: UPLOAD_FILE,
        payload: res.data
      });
    })
    // eslint-disable-next-line
    .catch(err => console.log(err));
};
