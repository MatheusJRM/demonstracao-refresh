import { createContext, useEffect, useState } from "react";
import { createSession } from "../service/login";
import { STORAGE_KEYS } from "../utils/storage-keys";
import { getCookieData } from "../utils/get-cookie-data";

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
  data: SessionData;
  setData: React.Dispatch<React.SetStateAction<SessionData>>;
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
  }, []);

  function signIn(email: string, password: string) {
    const body = {
      login: email,
      password: password,
    };
    createSession(body)
      .then((response) => {
        // PEGANDO DADOS DA RESPOSTA
        // setData(response.data);

        // PEGANDO DADOS DO COOKIE
        setData({
          permissionsArray: JSON.parse(getCookieData("permission")),
          refreshToken: getCookieData("refreshToken"),
          token: getCookieData("token"),
          user: JSON.parse(getCookieData("user")),
        });

        // ARMAZANANDO NO LOCAL STORAGE
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

  return (
    <AuthContext.Provider
      value={{
        token: data.token,
        refreshToken: data.refreshToken,
        user: data.user,
        permissions: data.permissionsArray,
        isAuthenticated,
        data,
        setData,
        signIn,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
