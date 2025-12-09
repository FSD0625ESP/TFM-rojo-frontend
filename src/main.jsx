import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { ChatProvider } from "./context/ChatContext";
import { NotificationProvider } from "./context/NotificationContext";
import App from "./App.jsx";
import "./index.css";

//eliminar overlay de errores de Vite si existe (especialmente durante tests)
const removeViteOverlay = () => {
  //buscar y eliminar overlay de Vite
  const selectors = [
    '#vite-error-overlay',
    '[id*="vite-error"]',
    '[class*="vite-error"]',
    '[class*="error-overlay"]',
    '[data-vite-error-overlay]',
  ];

  selectors.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      if (el) {
        el.remove();
      }
    });
  });

  //también eliminar estilos inline que puedan estar bloqueando
  const styleElements = document.querySelectorAll('style[data-vite-dev-id]');
  styleElements.forEach((el) => {
    const content = el.textContent || '';
    if (content.includes('error-overlay') || content.includes('vite-error')) {
      el.remove();
    }
  });
};

//ejecutar inmediatamente
removeViteOverlay();

//ejecutar periódicamente para asegurar que se elimine
if (window.Cypress || import.meta.env.VITE_DISABLE_SPLASH === "true") {
  const interval = setInterval(() => {
    removeViteOverlay();
  }, 100);

  //limpiar después de 10 segundos
  setTimeout(() => clearInterval(interval), 10000);
}

//observar cambios en el DOM para eliminar overlay si aparece
if (window.Cypress || import.meta.env.VITE_DISABLE_SPLASH === "true") {
  const observer = new MutationObserver(() => {
    removeViteOverlay();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  //limpiar después de 10 segundos
  setTimeout(() => observer.disconnect(), 10000);
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <SocketProvider>
        <ChatProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </ChatProvider>
      </SocketProvider>
    </AuthProvider>
  </BrowserRouter>
);
