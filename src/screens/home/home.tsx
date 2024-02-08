import { useEffect, useState } from "react";
import reactLogo from "../../assets/react.svg";
import viteLogo from "/vite.svg";
import "../../App.css";
import { useAuth } from "../../hooks/useAuth";
import { getOrganizations } from "../../service/organization/";
import { useAxios } from "../../hooks/useAxios";
import "../session/session.scss";

type IndustryProps = {
  id: string;
  fantasy_name: string;
};

export function Home() {
  const axiosInstance = useAxios();
  const { logout } = useAuth();
  const [count, setCount] = useState(0);
  const [industries, setIndustries] = useState<IndustryProps[]>([]);

  useEffect(() => {
    handleGetOrganizations();
  }, [count]);

  function handleGetOrganizations() {
    getOrganizations(axiosInstance, "industry")
      .then((response) => {
        console.log("Requisição bem sucedida", response.status);
        setIndustries(response.data);
      })
      .catch((err) => {
        setIndustries([]);
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
      <h1 className="title">Refresh Token</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          Chamar requisição {count}
        </button>
        {!!industries &&
          industries.map((industry) => (
            <p key={industry.id}>{industry.fantasy_name}</p>
          ))}
      </div>
      <p className="read-the-docs">Clique para deslogar</p>
      <button type="button" className="login-button" onClick={logout}>
        Sair
      </button>
    </>
  );
}
