import { useState, useEffect } from "react";
import { apiGet, apiEnviar } from "./api.js";

export default function Pecas({ projeto, aoVoltar }) {
  const [pecas, setPecas] = useState([]);
  const [editando, setEditando] = useState(null);
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");

  async function carregar() {
    setPecas(await apiGet("/projetos/" + projeto.id_projeto + "/pecas"));
  }

  useEffect(() => {
    carregar();
  }, []);

  const gasto = pecas.filter((p) => p.status === 1).reduce((soma, p) => soma + p.valor, 0);
  const totalPrevisto = pecas.reduce((soma, p) => soma + p.valor, 0);

  function limparFormulario() {
    setEditando(null);
    setDescricao("");
    setValor("");
  }

  async function salvar(evento) {
    evento.preventDefault();
    const dados = { descricao, valor: Number(valor), id_projeto: projeto.id_projeto };
    if (editando) {
      await apiEnviar("PUT", "/pecas/" + editando, dados);
    } else {
      await apiEnviar("POST", "/pecas", dados);
    }
    limparFormulario();
    carregar();
  }

  function preencherParaEditar(p) {
    setEditando(p.id_peca);
    setDescricao(p.descricao);
    setValor(p.valor);
  }

  async function trocarStatus(p) {
    await apiEnviar("PUT", "/pecas/" + p.id_peca + "/status", { status: p.status === 1 ? 0 : 1 });
    carregar();
  }

  async function excluir(p) {
    if (confirm(`Excluir a peça "${p.descricao}"?`)) {
      await apiEnviar("DELETE", "/pecas/" + p.id_peca);
      carregar();
    }
  }

  return (
    <div>
      <button className="secundario" onClick={aoVoltar}>
        ← Voltar para os Projetos
      </button>
      <h2>Peças: {projeto.titulo}</h2>
      <div className="painel-resumo">
        <div className="resumo">
          <span>Comprado</span>
          <strong>R$ {gasto.toFixed(2)}</strong>
        </div>
        <div className="resumo">
          <span>Total previsto</span>
          <strong>R$ {totalPrevisto.toFixed(2)}</strong>
        </div>
        {projeto.orcamento_limite > 0 && (
          <div className="resumo">
            <span>Orçamento</span>
            <strong>R$ {projeto.orcamento_limite.toFixed(2)}</strong>
          </div>
        )}
      </div>

      <form className="formulario" onSubmit={salvar}>
        <input value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descrição (ex: Jogo de pistões)" required />
        <input value={valor} onChange={(e) => setValor(e.target.value)} placeholder="Valor (R$)" type="number" step="0.01" required />
        <button type="submit">{editando ? "Salvar Alterações" : "+ Adicionar Peça"}</button>
        {editando && (
          <button type="button" className="secundario" onClick={limparFormulario}>
            Cancelar
          </button>
        )}
      </form>

      {pecas.length === 0 && <p className="vazio">Nenhuma peça cadastrada ainda.</p>}

      {pecas.map((p) => (
        <div className="card" key={p.id_peca}>
          <label className="checagem">
            <input type="checkbox" checked={p.status === 1} onChange={() => trocarStatus(p)} />
            <span className={p.status === 1 ? "comprado" : ""}>
              {p.descricao} — R$ {p.valor.toFixed(2)}
            </span>
          </label>
          <div className="acoes">
            <button className="secundario" onClick={() => preencherParaEditar(p)}>
              Editar
            </button>
            <button className="perigo" onClick={() => excluir(p)}>
              Excluir
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
