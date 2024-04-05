import axios from "axios";

const server = axios.create({
  baseURL: "https://secure-lance-backend.onrender.com/",
});

export default server;
