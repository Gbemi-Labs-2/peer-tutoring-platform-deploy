import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const codespaceHost =
  process.env.CODESPACE_NAME &&
  process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN
    ? `${process.env.CODESPACE_NAME}-5173.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`
    : undefined;

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    ...(codespaceHost ? { allowedHosts: [codespaceHost] } : {}),
    proxy: {
      "/api/v1": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
