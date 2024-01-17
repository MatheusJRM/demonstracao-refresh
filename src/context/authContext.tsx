import { createContext, useEffect, useState } from "react";
import { createSession } from "../service/login";
import { STORAGE_KEYS } from "../utils/storage-keys";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { api } from "../service/api/api";
// import { refreshToken } from "../service/login/post-refresh-token";

type Organization = {
  idOrganization: string;
  fantasy_name: string;
  phone: string;
  responsable: string;
  cnpj: string;
  type: string;
};

type UserInfo = {
  avatar: string;
  avatarUrl: string;
  name: string;
  email: string;
  phone: string;
  organization: Organization;
};

type SessionData = {
  user: UserInfo;
  token: string;
  refreshToken: string;
  permissionsArray: string[];
};

interface AuthContextProps {
  token: string;
  refreshToken: string;
  user: UserInfo;
  permissions: string[];
  isAuthenticated: boolean;
  signIn(email: string, password: string): void;
  logout(): void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthContext = createContext({} as AuthContextProps);

export function AuthProvider({ children }: AuthProviderProps) {
  const [data, setData] = useState({} as SessionData);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storageToken = localStorage.getItem(STORAGE_KEYS.TOKEN_KEY);
    const storageRefreshToken = localStorage.getItem(
      STORAGE_KEYS.REFRESH_TOKEN_KEY
    );
    const storageUser = localStorage.getItem(STORAGE_KEYS.USER_KEY);
    const storagePermissions = localStorage.getItem(
      STORAGE_KEYS.PERMISSIONS_KEY
    );

    if (
      storageToken &&
      storageRefreshToken &&
      storageUser &&
      storagePermissions
    ) {
      const oldToken: {
        scoop: string;
        iat: number;
        exp: number;
        sub: string;
      } = jwtDecode(storageToken);
      const isExpired = dayjs.unix(oldToken.exp).diff(dayjs()) < 1;
      if (!isExpired) {
        api.defaults.headers["Authorization"] = `Bearer ${storageToken}`;
        api.defaults.headers["permissions"] = storagePermissions;

        setData({
          user: JSON.parse(storageUser),
          token: storageToken,
          refreshToken: storageRefreshToken,
          permissionsArray: JSON.parse(storagePermissions),
        });

        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    }
  }, []);

  function signIn(email: string, password: string) {
    const body = {
      login: email,
      password: password,
    };
    createSession(body)
      .then((response) => {
        api.defaults.headers["Authorization"] = `Bearer ${response.data.token}`;
        api.defaults.headers["permissions"] = JSON.stringify(
          response.data.permissionsArray
        );
        setData(response.data);
        localStorage.setItem(
          STORAGE_KEYS.USER_KEY,
          JSON.stringify(response.data.user)
        );
        localStorage.setItem(STORAGE_KEYS.TOKEN_KEY, response.data.token);
        localStorage.setItem(
          STORAGE_KEYS.REFRESH_TOKEN_KEY,
          response.data.refreshToken
        );
        localStorage.setItem(
          STORAGE_KEYS.PERMISSIONS_KEY,
          JSON.stringify(response.data.permissionsArray)
        );
        setIsAuthenticated(true);
      })
      .catch((err) => {
        console.log(err);
        alert("Erro ao efetuar login");
      });
  }

  function logout() {
    setIsAuthenticated(false);
    localStorage.clear();
  }

  // api.interceptors.request.use(
  //   (request) => {
  //     const storageToken = localStorage.getItem(STORAGE_KEYS.TOKEN_KEY);
  //     if (storageToken) {
  //       const oldToken: {
  //         scoop: string;
  //         iat: number;
  //         exp: number;
  //         sub: string;
  //       } = jwtDecode(storageToken);
  //       const isExpired = dayjs.unix(oldToken.exp).diff(dayjs()) < 1;
  //       if (isExpired) {
  //         const storageRefreshToken = localStorage.getItem(
  //           STORAGE_KEYS.REFRESH_TOKEN_KEY
  //         );
  //         const body = {
  //           refreshToken: `Bearer ${storageRefreshToken}`,
  //         };
  //         refreshToken(body).then((response) => {
  //           console.log("RESPOSTA REFRESH", response.data);
  //           request.headers["Authorization"] = `Bearer ${response.data.token}`;
  //           api.defaults.headers[
  //             "Authorization"
  //           ] = `Bearer ${response.data.token}`;
  //           localStorage.setItem(STORAGE_KEYS.TOKEN_KEY, response.data.token);
  //           localStorage.setItem(
  //             STORAGE_KEYS.REFRESH_TOKEN_KEY,
  //             response.data.refreshToken
  //           );
  //         });
  //         return Promise.resolve(request);
  //       }
  //     }
  //     return request;
  //   },
  //   (error) => {
  //     return Promise.reject(error);
  //   }
  // );

  // api.interceptors.response.use(
  //   (response) => {
  //     return response;
  //   },
  //   (error) => {
  //     if (error.response.status === 401) {
  //       const storageRefreshToken = localStorage.getItem(
  //         STORAGE_KEYS.REFRESH_TOKEN_KEY
  //       );
  //       const body = {
  //         refreshToken: `Bearer ${storageRefreshToken}`,
  //       };
  //       refreshToken(body).then((response) => {
  //         console.log("RESPOSTA REFRESH", response.data);
  //         error.config.headers[
  //           "Authorization"
  //         ] = `Bearer ${response.data.token}`;
  //         api.defaults.headers[
  //           "Authorization"
  //         ] = `Bearer ${response.data.token}`;
  //         localStorage.setItem(STORAGE_KEYS.TOKEN_KEY, response.data.token);
  //         localStorage.setItem(
  //           STORAGE_KEYS.REFRESH_TOKEN_KEY,
  //           response.data.refreshToken
  //         );
  //       });
  //       return error.config;
  //     } else {
  //       return Promise.reject(error);
  //     }
  //   }
  // );

  return (
    <AuthContext.Provider
      value={{
        token: data.token,
        refreshToken: data.refreshToken,
        user: data.user,
        permissions: data.permissionsArray,
        isAuthenticated,
        signIn,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
