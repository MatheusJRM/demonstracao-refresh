import { useContext } from "react";

import { AuthContext } from "../context/authContext";

export const useAuth = () => {
  const context = useContext(AuthContext);

  return context;
};
