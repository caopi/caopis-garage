import { useState, useEffect } from "react";
import { apiGet, apiEnviar } from "./api.js";


export default function Projetos({ veiculo, aoAbrirProjeto }) {
  const [projetos, setProjetos] = useState([]);
  const [pecas, setPecas] = useState([]); 
  const [editando, setEditando] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [orcamento, setOrcamento] = useState("");

  async function carregar() {
    setProjetos(await apiGet("/veiculos/" + veiculo.id_veiculo + "/projetos"));
    setPecas(await apiGet("/pecas"));
  }

  useEffect(() => {
    carregar();
  }, []);

  function gastoDoProjeto(idProjeto) {
    const pecasDoProjeto = pecas.filter((p) => p.id_projeto === idProjeto && p.status === 1);
    return pecasDoProjeto.reduce((soma, p) => soma + p.valor, 0);
  }

  function valorTotalDoProjeto(idProjeto) {
    const pecasDoProjeto = pecas.filter((p) => p.id_projeto === idProjeto);
    return pecasDoProjeto.reduce((soma, p) => soma + p.valor, 0);
  }

  function pendentesDoProjeto(idProjeto) {
    return pecas.filter((p) => p.id_projeto === idProjeto && p.status === 0).length;
  }

  function limparFormulario() {
    setEditando(null);
    setTitulo("");
    setOrcamento("");
  }

  async function salvar(evento) {
    evento.preventDefault();
    const dados = { titulo, orcamento_limite: Number(orcamento), id_veiculo: veiculo.id_veiculo };
    if (editando) {
      await apiEnviar("PUT", "/projetos/" + editando, dados);
    } else {
      await apiEnviar("POST", "/projetos", dados);
    }
    limparFormulario();
    carregar();
  }

  function preencherParaEditar(p) {
    setEditando(p.id_projeto);
    setTitulo(p.titulo);
    setOrcamento(p.orcamento_limite);
  }

  async function excluir(p) {
    if (confirm(`Excluir a categoria "${p.titulo}"? As peças dela também serão apagadas.`)) {
      await apiEnviar("DELETE", "/projetos/" + p.id_projeto);
      carregar();
    }
  }

  return (
    <div>
      <h2>Projetos de Restauração</h2>

      <form className="formulario" onSubmit={salvar}>
        <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Categoria (ex: Motor, Freios...)" required />
        <input value={orcamento} onChange={(e) => setOrcamento(e.target.value)} placeholder="Orçamento limite (R$)" type="number" step="0.01" required />
        <button type="submit">{editando ? "Salvar Alterações" : "+ Adicionar Categoria"}</button>
        {editando && (
          <button type="button" className="secundario" onClick={limparFormulario}>
            Cancelar
          </button>
        )}
      </form>

      {projetos.length === 0 && <p className="vazio">Nenhuma categoria ainda. Crie a primeira!</p>}

      {projetos.map((p) => {
        const gasto = gastoDoProjeto(p.id_projeto);
        const totalPecas = valorTotalDoProjeto(p.id_projeto);
        const pendentes = pendentesDoProjeto(p.id_projeto);
        const porcentagem = totalPecas > 0 ? Math.min((gasto / totalPecas) * 100, 100) : 0;
        return (
          <div className="card" key={p.id_projeto}>
            <button className="lixeira" title="Excluir categoria" onClick={() => excluir(p)}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 6h18" />
                <path d="M8 6V4h8v2" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6M14 11v6" />
              </svg>
            </button>
            <div className="info">
              <div className="linha-titulo">
                <strong>{p.titulo}</strong>
                {pendentes > 0 ? (
                  <span className="selo">{pendentes} pendente{pendentes > 1 ? "s" : ""}</span>
                ) : (
                  <span className="selo verde">completo ✔</span>
                )}
              </div>
              <span>
                Gasto: R$ {gasto.toFixed(2)}
                {p.orcamento_limite > 0 && <> de R$ {p.orcamento_limite.toFixed(2)}</>}
              </span>
              {totalPecas > 0 && (
                <div className="barra">
                  <div className="barra-cheia" style={{ width: porcentagem + "%" }}></div>
                </div>
              )}
            </div>
            <div className="acoes">
              <button onClick={() => aoAbrirProjeto(p)}>Abrir Peças</button>
              <button className="secundario" onClick={() => preencherParaEditar(p)}>
                Editar
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
