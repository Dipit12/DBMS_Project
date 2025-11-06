import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:4000",
});

// Always attach token if available
const token = localStorage.getItem("token");
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}
