import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import Sidebar from "./components/Sidebar/Sidebar";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";
import Dashboard from "./pages/Dashboard/Dashboard";
import Goals from "./pages/Goals/Goals";
import ProgressPage from "./pages/Progress/Progress"; // Ta page calendrier
import Profil from "./pages/Profil/Profil";
import Statistics from "./pages/Statistics/Statistics";

const RootLayout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      <Sidebar />
      <main style={{
        flex: 1,
        backgroundColor: '#f8faff',
        padding: '20px',
        marginLeft: '280px'
      }}>
        <Outlet />
      </main>
    </div>
  );
};

const router = createBrowserRouter([
  // 1. Pages simples
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/privacy", element: <PrivacyPolicy /> },

  // 2. Pages avec la Sidebar (Connecte-toi d'abord, puis va sur ces URLs)
  {
    element: <RootLayout />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/objectifs", element: <Goals /> },
      { path: "/calendrier", element: <ProgressPage /> }, // TON CALENDRIER EST ICI
      { path: "/statistiques", element: <Statistics /> },
      { path: "/profil", element: <Profil /> },
    ],
  },

  // Route par défaut (si rien ne correspond, on affiche le Login)
  { path: "/", element: <Login /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}