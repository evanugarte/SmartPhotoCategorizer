import axios from "axios";

export const signup = (query) => {
  axios
    .post("http://backend172.ngrok.io/users/signup", query)
    .catch(err =>
      console.error(err));
};