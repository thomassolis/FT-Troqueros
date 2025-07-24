import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/auth/authProvider";
import { useContext } from "react";
import { useEffect } from "react";


const ProtectedRoute = () => {
  const auth = useContext(AuthContext);

  if (!auth) return null;

  if (auth.loading) {
    // Puedes usar un spinner en lugar de este texto
    return <p>Cargando...</p>;
  }

  if (!auth.isAuthenticated) {
    // 🚨 Solo cuando ya sabemos que loading terminó y no está autenticado
    return <Navigate to="/" replace />;
  }

    useEffect(() => {
        console.log("isAuthenticated: ", auth?.isAuthenticated);
        console.log("loading: ", auth?.loading);
    }, [auth?.isAuthenticated, auth?.loading]);

  return <Outlet />;
};

export default ProtectedRoute;
