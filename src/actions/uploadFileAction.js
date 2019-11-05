import axios from "axios";
import { UPLOAD_FILE } from "./types";

export const uploadFileAction = (file, history) => dispatch => {
  var formData = new FormData();

  Object.keys(file).forEach(key => {
    console.log(key + "-" + file[key]);
    formData.append(key, file[key]);
  });
  console.log("============upload action============");
  console.log(JSON.stringify(formData));
  console.log("============upload action============");

  axios
    .post(" http://localhost:4000/users/upload", formData)
    .then(res => {
      history.push("/");
      dispatch({
        type: UPLOAD_FILE,
        payload: res.data
      });
    })
    .catch(err => console.log(err));
};
