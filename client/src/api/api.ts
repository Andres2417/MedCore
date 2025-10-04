import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3002/api", // backend local
});

export default api;
