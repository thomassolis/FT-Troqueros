import { useEffect, useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { ProtectRoute } from '../../api/Login/login.route';
import { AuthContext } from '../../context/auth/authProvider';

export const ProtectedRoute = () => {
  // const { isAuthenticated, setIsAuthenticated, loading } = useContext(AuthContext)!;

  // useEffect(() => {
  //   const validateToken = async () => {
  //     try {
  //       const response = await ProtectRoute();        
  //       setIsAuthenticated(response.success === true);
  //     } catch (error) {
  //       console.error('Error al validar el token', error);
  //       setIsAuthenticated(false);
  //     }
  //   };

  //   // Solo validar si no está cargando y no hay un estado de autenticación
  //   if (!loading) {
  //     validateToken();
  //   }
  // }, [loading, setIsAuthenticated]);

  // if (loading) return <p>Cargando...</p>;

  // return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
  return <Outlet />;
};