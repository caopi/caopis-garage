import { useState } from "react";
import { apiEnviar } from "./api.js";
import fotoCarro from "./assets/delrey.jpg";

// Tela de login: o site só abre depois de acertar usuário e senha.
export default function Login({ aoEntrar }) {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  async function entrar(evento) {
    evento.preventDefault();
    const resposta = await apiEnviar("POST", "/login", { usuario, senha });
    if (resposta.ok) {
      // Guarda a senha no navegador para os próximos pedidos à API
      localStorage.setItem("senha", senha);
      aoEntrar();
    } else {
      setErro("Usuário ou senha incorretos.");
    }
  }

  return (
    <div className="tela-login">
      <form className="caixa-login" onSubmit={entrar}>
        <img className="foto-carro" src={fotoCarro} alt="Ford Del Rey" />
        <h1 className="logo">🛠️ Caopi's Garage</h1>
        <input value={usuario} onChange={(e) => setUsuario(e.target.value)} placeholder="Usuário" required />
        <input value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Senha" type="password" required />
        {erro && <p className="erro-login">{erro}</p>}
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
