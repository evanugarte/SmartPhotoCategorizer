import axios from "axios";
import { getPicsSocialAction } from "./getPicsSocialAction";

export const deletePhotoAction = (queryDelete, history) => dispatch => {
  axios
    .delete("http://localhost:4000/users/deleteById", { data: queryDelete })
    .then(res => {
      dispatch(getPicsSocialAction());
    })
    .catch(err =>
      console.error(err));
};