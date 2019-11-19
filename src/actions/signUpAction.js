import axios from "axios";

export const signup = (query) => {
  axios
    .post("http://localhost:4000/users/signup", query)
    .catch(err =>
      console.error(err));
};