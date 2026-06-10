import { useState, useEffect } from "react";
import { apiGet } from "./api.js";

// Relatório financeiro: resumo de gastos de todas as categorias da restauração.
export default function Relatorio() {
  const [projetos, setProjetos] = useState([]);
  const [pecas, setPecas] = useState([]);

  useEffect(() => {
    async function carregar() {
      setProjetos(await apiGet("/projetos"));
      setPecas(await apiGet("/pecas"));
    }
    carregar();
  }, []);

  function pecasDoProjeto(idProjeto) {
    return pecas.filter((p) => p.id_projeto === idProjeto);
  }

  function gastoDoProjeto(idProjeto) {
    return pecasDoProjeto(idProjeto)
      .filter((p) => p.status === 1)
      .reduce((soma, p) => soma + p.valor, 0);
  }

  const gastoTotal = pecas.filter((p) => p.status === 1).reduce((soma, p) => soma + p.valor, 0);
  const compradas = pecas.filter((p) => p.status === 1).length;

  return (
    <div>
      <h2>Relatório Financeiro</h2>

      <div className="painel-resumo">
        <div className="resumo">
          <span>Gasto total</span>
          <strong>R$ {gastoTotal.toFixed(2)}</strong>
        </div>
        <div className="resumo">
          <span>Peças compradas</span>
          <strong>
            {compradas} de {pecas.length}
          </strong>
        </div>
        <div className="resumo">
          <span>Categorias</span>
          <strong>{projetos.length}</strong>
        </div>
      </div>

      <div className="card relatorio-card">
        {projetos.length === 0 && <span className="vazio">Sem categorias cadastradas.</span>}
        {projetos.map((p) => {
          const gasto = gastoDoProjeto(p.id_projeto);
          const total = pecasDoProjeto(p.id_projeto).length;
          const compradasAqui = pecasDoProjeto(p.id_projeto).filter((x) => x.status === 1).length;
          const saldo = p.orcamento_limite - gasto;
          return (
            <div className="linha-relatorio" key={p.id_projeto}>
              <span>
                <strong>{p.titulo}</strong> ({compradasAqui}/{total} peças)
              </span>
              <span>
                Gasto: R$ {gasto.toFixed(2)}
                {p.orcamento_limite > 0 && (
                  <>
                    {" | Orçamento: R$ " + p.orcamento_limite.toFixed(2) + " | "}
                    <span className={saldo < 0 ? "perigo-texto" : ""}>Saldo: R$ {saldo.toFixed(2)}</span>
                  </>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
