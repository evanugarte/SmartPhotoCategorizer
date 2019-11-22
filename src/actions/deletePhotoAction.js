import axios from "axios";
import { getPicsSocialAction } from "./getPicsSocialAction";

export const deletePhotoAction = (queryDelete, userInfo) => dispatch => {
  axios
    .delete("https://backend172.ngrok.io/users/deleteById", 
    { data: queryDelete })
    .then(res => {
      dispatch(getPicsSocialAction(userInfo));
    })
    .catch(err =>
      console.error(err));
};