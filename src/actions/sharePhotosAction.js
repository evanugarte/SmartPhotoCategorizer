import axios from "axios";

export const sharePhotosAction = (sharePhoto) => dispatch => {
  axios
    .post("http://backend172.ngrok.io/users/sharePhotos", sharePhoto)
    .catch(err =>
      console.error(err));
};