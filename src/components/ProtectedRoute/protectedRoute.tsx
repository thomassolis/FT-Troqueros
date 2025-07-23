import { AuthContext } from "../../context/auth/authProvider";
import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export const ProtectedRoute = () => {
  const { isAuthenticated } = useContext(AuthContext)!;
  const location = useLocation();  

  // if (!isAuthenticated) {
    // return <Navigate to="/" replace state={{ from: location }} />;
  // }

  return <Outlet />; // Aquí se renderizan las rutas hijas protegidas
}
