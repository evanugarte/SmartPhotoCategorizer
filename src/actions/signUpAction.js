import axios from "axios";

export const signup = (query) => {
  axios
    .post("https://backend172.ngrok.io/users/signup", query)
    .catch(err =>
      console.error(err));
};