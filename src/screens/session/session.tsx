import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import "./session.scss";

export function Session() {
  const { isAuthenticated, signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleChangeEmail(event: React.ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }

  function handleChangePassword(event: React.ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
  }

  return (
    <div className={`container ${isAuthenticated ? "hidden" : ""}`}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          signIn(email, password);
        }}
        className="login-form"
      >
        <h2 className="title-form">Inicie sua sessão</h2>

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            placeholder="Informe o email"
            type="email"
            id="email"
            name="email"
            onChange={handleChangeEmail}
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Senha</label>
          <input
            placeholder="Informe a senha"
            type="password"
            id="password"
            name="password"
            onChange={handleChangePassword}
          />
        </div>

        <button type="submit" className="login-button">
          Entrar
        </button>
      </form>
    </div>
  );
}
