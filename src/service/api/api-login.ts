import axios from "axios";

export const apiLogin = axios.create({
  baseURL: import.meta.env.VITE_API_LOGIN_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
