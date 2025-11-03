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
import { Squads } from "../pages/Squads";
import { Matches } from "../pages/Matches";
import { Community } from "../pages/Community";

import { ProfileNav } from "../components/ProfileNav";
import { MyProfile } from "../pages/MyProfile";
import { MySquad } from "../pages/MySquad";
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
            path="squads"
            element={
              <PrivateRoute>
                <Squads />
              </PrivateRoute>
            }
          />
          <Route
            path="matches"
            element={
              <PrivateRoute>
                <Matches />
              </PrivateRoute>
            }
          />
          <Route
            path="community"
            element={
              <PrivateRoute>
                <Community />
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
            path="my-squad"
            element={
              <PrivateRoute>
                <MySquad />
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
