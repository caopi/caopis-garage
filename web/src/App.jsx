import { useState, useEffect } from "react";
import { apiGet } from "./api.js";
import Login from "./Login.jsx";
import Projetos from "./Projetos.jsx";
import Pecas from "./Pecas.jsx";
import Relatorio from "./Relatorio.jsx";
import Radio from "./Radio.jsx";
import fotoCarro from "./assets/delrey.jpg";

// O aplicativo é focado em um único carro
// Este componente controla o login e qual tela aparece na área principal.
export default function App() {
  const [logado, setLogado] = useState(localStorage.getItem("senha") !== null);
  const [carro, setCarro] = useState(null);
  const [tela, setTela] = useState("projetos"); // "projetos" ou "relatorio"
  const [projeto, setProjeto] = useState(null); // projeto aberto no momento

  useEffect(() => {
    if (!logado) return;
    async function carregar() {
      const veiculos = await apiGet("/veiculos");
      if (Array.isArray(veiculos)) {
        setCarro(veiculos[0]);
      } else {
        sair(); // a senha guardada no navegador não vale mais
      }
    }
    carregar();
  }, [logado]);

  function sair() {
    localStorage.removeItem("senha");
    setLogado(false);
    setCarro(null);
    setProjeto(null);
    setTela("projetos");
  }

  if (!logado) {
    return <Login aoEntrar={() => setLogado(true)} />;
  }

  if (!carro) {
    return <p className="carregando">Carregando a garagem...</p>;
  }

  function trocarTela(nome) {
    setTela(nome);
    setProjeto(null);
  }

  // Decide qual tela mostrar
  let conteudo;
  if (projeto) {
    conteudo = <Pecas projeto={projeto} aoVoltar={() => setProjeto(null)} />;
  } else if (tela === "relatorio") {
    conteudo = <Relatorio />;
  } else {
    conteudo = <Projetos veiculo={carro} aoAbrirProjeto={setProjeto} />;
  }

  return (
    <div className="app">
      <aside className="menu">
        <img className="foto-carro" src={fotoCarro} alt="Ford Del Rey" />
        <h1 className="logo">🛠️ Caopi's Garage</h1>
        <p className="subtitulo">
          {carro.modelo} • {carro.ano}
          <br />
          Placa {carro.placa}
        </p>
        <button className={tela === "projetos" ? "ativo" : ""} onClick={() => trocarTela("projetos")}>
          🔧 Projetos de Restauração
        </button>
        <button className={tela === "relatorio" ? "ativo" : ""} onClick={() => trocarTela("relatorio")}>
          📊 Relatório Financeiro
        </button>
        <Radio />
        <button className="botao-sair" onClick={sair}>
          🚪 Sair
        </button>
      </aside>
      <main className="principal">{conteudo}</main>
    </div>
  );
}
