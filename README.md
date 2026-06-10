# 🛠️ Caopi's Garage — Restauração do Ford Del Rey GL 1.6 (1987)

Aplicação para controlar a reforma do carro: as categorias da restauração
(Motor, Freios, Suspensão...) com orçamento, e as peças de cada uma
(com status de pendente/comprada).

Atividade de Orientação a Objetos: Python + SQLite3, 3 tabelas relacionais
(veiculos → projetos → pecas) com CRUD completo.

## Estrutura

| Arquivo / pasta | O que é |
| --- | --- |
| `database.py` | Classes do projeto (Veiculo, Projeto, Peca) e o GerenciadorBanco, que cuida do SQLite. 
| `api.py` | Servidor Flask: a ponte entre a página web e o banco de dados (com login). |
| `popular_banco.py` | Script que cadastra a lista de peças do Del Rey, organizada por categoria. |
| `web/` | Interface web feita com React + Vite. |
| `oficina_restauracao.db` | O arquivo do banco SQLite (criado automaticamente). |
| `segredo_exemplo.py` | Exemplo de login |

## Como rodar

Abra dois terminais:

**Terminal 1 — API (Python):**

```
python api.py
```

**Terminal 2 — Página web:**

```
cd web
npm install
npm run dev
```

Depois abra no navegador o endereço que o Vite mostrar (ex.: http://localhost:5173).

## Obs

- Renomeie "segredo_exemplo.py" para "segredo.py" com as credenciais desejadas para logar.
- As peças entram com valor R$ 0,00 — clique em "Editar" na peça para colocar o
  preço quando comprar, e marque a caixinha para registrar a compra.
- Defina o orçamento de cada categoria clicando em "Editar" na lista de projetos.
