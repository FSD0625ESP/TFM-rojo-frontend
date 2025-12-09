import { useState, useEffect } from "react";
import { Toaster } from "./components/ui/sonner";
import { SplashScreen } from "./pages/SplashScreen.jsx";
import { MainRoutes } from "./routes/mainRoutes.jsx";

function App() {
  const [splashLoader, setSplashLoader] = useState(() => {
    //desactivar splash screen durante tests de Cypress
    if (window.Cypress || import.meta.env.VITE_DISABLE_SPLASH === "true") {
      return false;
    }
    return sessionStorage.getItem("splashShown") !== "open";
  });

  useEffect(() => {
    if (splashLoader) {
      const timer = setTimeout(() => {
        sessionStorage.setItem("splashShown", "open");
        setSplashLoader(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [splashLoader]);

  return (
    <>
      {/* si ya se ha mostrado, no vuelve a mostrarlo si recagamos */}
      {splashLoader ? <SplashScreen /> : <MainRoutes />}
      {/* este componente permite mostrar los toasts */}
      <Toaster />
    </>
  );
}

export default App;
