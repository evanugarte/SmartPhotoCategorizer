import axios from "axios";
import { DELETE } from "./types";
import { getPicsSocialAction } from "./getPicsSocialAction";

export const deletePhotoAction = (queryDelete, history) => dispatch => {
  axios
    .delete("http://localhost:4000/users/deleteById", { data: queryDelete })
    .then(res => {
      getPicsSocialAction();
    })
    .catch(err =>
      console.error(err));
};