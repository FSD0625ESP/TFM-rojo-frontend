import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ["dayjs", "dayjs/plugin/relativeTime"],
    esbuildOptions: {
      target: "esnext",
    },
  },
  build: {
    commonjsOptions: {
      include: [/dayjs/, /node_modules/],
      transformMixedEsModules: true,
    },
  },
  server: {
    hmr: {
      overlay: false, //desactivar overlay de errores para que no bloquee las capturas de Cypress
    },
  },
});
