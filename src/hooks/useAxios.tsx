import axios from "axios";
import { STORAGE_KEYS } from "../utils/storage-keys";
import { sendRefreshToken } from "../service/login/post-refresh-token";
import { useAuth } from "./useAuth";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";

export function useAxios() {
  const { token, refreshToken, data, setData } = useAuth();

  const api = axios.create({
    baseURL: import.meta.env.VITE_API,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  api.interceptors.request.use(
    async (request) => {
      const oldToken: { exp: number } = jwtDecode(token);
      const isExpired = dayjs.unix(oldToken.exp).diff(dayjs()) < 1;

      if (!isExpired) return request;

      const body = {
        refreshToken: `Bearer ${refreshToken}`,
      };

      const response = await sendRefreshToken(body);

      console.log("RESPOSTA REFRESH", response.data);

      localStorage.setItem(STORAGE_KEYS.TOKEN_KEY, response.data.token);
      localStorage.setItem(
        STORAGE_KEYS.REFRESH_TOKEN_KEY,
        response.data.refreshToken
      );

      setData({
        ...data,
        token: response.data.token,
        refreshToken: response.data.refreshToken,
      });

      document.cookie = `token=${response.data.token}`;
      document.cookie = `refreshToken=${response.data.refreshToken}`;

      request.headers.Authorization = `Bearer ${response.data.token}`;
      api.defaults.headers["Authorization"] = `Bearer ${response.data.token}`;

      return request;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // api.interceptors.response.use(
  //   (response) => {
  //     return response;
  //   },
  //   async (error) => {
  //     if (error.response.status === 401) {
  //       const body = {
  //         refreshToken: `Bearer ${refreshToken}`,
  //       };

  //       const response = await sendRefreshToken(body);

  //       console.log("RESPOSTA REFRESH", response.data);

  //       error.config.headers["Authorization"] = `Bearer ${response.data.token}`;
  //       api.defaults.headers["Authorization"] = `Bearer ${response.data.token}`;

  //       localStorage.setItem(STORAGE_KEYS.TOKEN_KEY, response.data.token);
  //       localStorage.setItem(
  //         STORAGE_KEYS.REFRESH_TOKEN_KEY,
  //         response.data.refreshToken
  //       );

  //       document.cookie = `token=${response.data.token}`;
  //       document.cookie = `refreshToken=${response.data.refreshToken}`;

  //       setData({
  //         ...data,
  //         token: response.data.token,
  //         refreshToken: response.data.refreshToken,
  //       });

  //       return axios(error.config);
  //     } else {
  //       return Promise.reject(error);
  //     }
  //   }
  // );

  return api;
}
