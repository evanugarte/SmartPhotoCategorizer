import axios from "axios";

export const sharePhotosAction = (sharePhoto) => dispatch => {
  axios
    .post("https://backend172.ngrok.io/users/sharePhotos", sharePhoto)
    .catch(err =>
      console.error(err));
};