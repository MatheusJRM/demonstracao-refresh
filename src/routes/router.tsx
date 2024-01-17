import { Route, Routes } from "react-router-dom";
import { Home } from "../screens/home/home";
import { useAuth } from "../hooks/useAuth";
import { Session } from "../screens/session/session";

export function Router() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Home /> : <Session />} />
    </Routes>
  );
}
