import { useState, useEffect } from "react";
import { SplashScreen } from "./pages/SplashScreen.jsx";
import { MainRoutes } from "./routes/mainRoutes.jsx";

function App() {
  const [loading, setLoading] = useState(() => {
    return sessionStorage.getItem("splashShown") !== "true";
  });

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        sessionStorage.setItem("splashShown", "true");
        setLoading(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  return loading ? <SplashScreen /> : <MainRoutes />;
}

export default App;
