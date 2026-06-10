// Funções de ajuda para conversar com a API Python (Flask).
// Toda a comunicação da página com o banco de dados passa por aqui.

// Endereço da API:
// - Em casa (npm run dev) fica vazio, e o Vite repassa /api para o Flask local.
// - No Vercel, configuramos a variável VITE_API_URL com o endereço do PythonAnywhere.
const BASE = import.meta.env.VITE_API_URL || "";

// Todo pedido leva a senha guardada no navegador; a API confere antes de responder
function cabecalhos() {
  return {
    "Content-Type": "application/json",
    "X-Senha": localStorage.getItem("senha") || "",
  };
}

export async function apiGet(caminho) {
  const resposta = await fetch(BASE + "/api" + caminho, { headers: cabecalhos() });
  return resposta.json();
}

export async function apiEnviar(metodo, caminho, dados) {
  const resposta = await fetch(BASE + "/api" + caminho, {
    method: metodo, // "POST", "PUT" ou "DELETE"
    headers: cabecalhos(),
    body: dados ? JSON.stringify(dados) : undefined,
  });
  return resposta.json();
}
