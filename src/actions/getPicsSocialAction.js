import axios from "axios";
import { GET_PICS_SOCIAL } from "./types";

export const getPicsSocialAction = (query, history) => dispatch => {
  axios
    .get("http://localhost:4000/users/getPhotoSocial", {params: 
    {email: query.email}})
    .then(res => {
      dispatch({
        type: GET_PICS_SOCIAL,
        payload: res.data
      });
    })
    .catch(err =>
      console.error(err));
};
