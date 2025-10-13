import { Routes, Route } from "react-router-dom";
import { Home } from "../pages/Home.jsx";
import { Login } from "../pages/Login.jsx";
import { Signup } from "../pages/Signup.jsx";
import { ForgotPassword } from "../pages/ForgotPassword.jsx";

export function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
}
