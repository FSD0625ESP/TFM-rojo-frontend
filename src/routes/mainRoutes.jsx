import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";
import { AuthLayout } from "../layouts/AuthLayout";
import { PrivateRoute } from "../components/PrivateRoute";

import { Login } from "../pages/Login";
import { Signup } from "../pages/Signup";
import { ForgotPassword } from "../pages/ForgotPassword";
import { ResetPassword } from "../pages/ResetPassword";

import { StartNav } from "../components/StartNav";
import { Statistics } from "../pages/Statistics";
import { Teams } from "../pages/Teams";
import { Matchs } from "../pages/Matchs";
import { Chats } from "../pages/Chats";

import { ProfileNav } from "../components/ProfileNav";
import { MyProfile } from "../pages/MyProfile";
import { MyTeam } from "../pages/MyTeam";
import { MyStats } from "../pages/MyStats";
import { MySettings } from "../pages/MySettings";

//definición de rutas principales de la aplicación
export function MainRoutes() {
  return (
    <Routes>
      {/* Rutas públicas con AuthLayout */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Redirección desde raíz "/" a "/start/statistics" */}
      <Route index element={<Navigate to="/start/statistics" replace />} />

      {/* Rutas privadas con AppLayout */}
      <Route path="/" element={<AppLayout />}>
        {/* Start */}
        <Route path="start" element={<StartNav />}>
          {/* Redirección desde /start a /start/statistics */}
          <Route index element={<Navigate to="statistics" replace />} />

          <Route path="statistics" element={<Statistics />} />
          <Route
            path="teams"
            element={
              <PrivateRoute>
                <Teams />
              </PrivateRoute>
            }
          />
          <Route
            path="matchs"
            element={
              <PrivateRoute>
                <Matchs />
              </PrivateRoute>
            }
          />
          <Route
            path="chats"
            element={
              <PrivateRoute>
                <Chats />
              </PrivateRoute>
            }
          />
        </Route>

        {/* Profile y sus subrutas */}
        <Route
          path="profile"
          element={
            <PrivateRoute>
              <ProfileNav />
            </PrivateRoute>
          }
        >
          {/* Redirección desde "/profile" a "/profile/my-profile" */}
          <Route index element={<Navigate to="my-profile" replace />} />

          <Route
            path="my-profile"
            element={
              <PrivateRoute>
                <MyProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="my-team"
            element={
              <PrivateRoute>
                <MyTeam />
              </PrivateRoute>
            }
          />
          <Route
            path="my-stats"
            element={
              <PrivateRoute>
                <MyStats />
              </PrivateRoute>
            }
          />
          <Route
            path="my-settings"
            element={
              <PrivateRoute>
                <MySettings />
              </PrivateRoute>
            }
          />
        </Route>
      </Route>
    </Routes>
  );
}
