import axios from "axios";
import { GET_PICS_SOCIAL } from "./types";

export const getPicsSocialAction = (query, history) => dispatch => {

  axios
    .get(" http://localhost:4000/users/getPhotoSocial", {params: query})
    .then(res => {
    //   history.push("/");
      dispatch({
        type: GET_PICS_SOCIAL,
        payload: res.data
      });
    })
    .catch(err =>
      console.error(err));
};
