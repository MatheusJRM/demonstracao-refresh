import { BrowserRouter } from "react-router-dom";
import { Router } from "./routes/router";
import "./App.css";
import { AuthProvider } from "./context/authContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
