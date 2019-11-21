import axios from "axios";

export const sharePhotosAction = (sharePhoto) => dispatch => {
  axios
    .post("http://localhost:4000/users/sharePhotos", sharePhoto)
    .catch(err =>
      console.error(err));
};