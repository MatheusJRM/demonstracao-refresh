import { useEffect, useState } from "react";
import reactLogo from "../../assets/react.svg";
import viteLogo from "/vite.svg";
import "../../App.css";
import { useAuth } from "../../hooks/useAuth";
import { getOrganizations } from "../../service/organization";

export function Home() {
  const { logout } = useAuth();
  const [count, setCount] = useState(0);

  useEffect(() => {
    handleGetOrganizations();
  }, [count]);

  function handleGetOrganizations() {
    getOrganizations("industry")
      .then((response) => {
        console.log({ response });
        alert("FUNÇÃO REALIZADA COM SUCESSO!");
      })
      .catch((err) => {
        console.log(err.response);

        if (err.response.status === 401) {
          alert("TOKEN INVÁLIDO!");
        }
      });
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <button type="button" className="login-button" onClick={logout}>
        Sair
      </button>
    </>
  );
}
