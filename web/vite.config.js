import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// O "proxy" faz o seguinte: quando a página pedir algo em /api,
// o Vite repassa o pedido para o servidor Python (Flask) na porta 5000.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
});
