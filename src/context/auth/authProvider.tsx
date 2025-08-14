import { createContext, useState, useEffect } from "react";
import axios from "axios";

interface AuthContextType {
  userRole: string | null;
  userName: string | null | undefined;
  userLastName: string | null | undefined;
  banTime: string | null;
  userEmail: string | null;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  loading: boolean;
  logout: () => void; // Nueva función de logout
  setUserRole: (role: string | null) => void;
  setUserName: (name: string | null) => void;
  setUserLastName: (lastName: string | null) => void;
  setUserEmail: (email: string | null) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>();
  const [userLastName, setUserLastName] = useState<string | null>();
  const [banTime, setBanTime] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    // Limpiar todos los estados de usuario
    setIsAuthenticated(false);
    setUserRole(null);
    setUserName(null);
    setUserLastName(null);
    setBanTime(null);
    setUserEmail(null);

    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("userLastName");
    
    // Limpiar cookies/tokens si es necesario
    // (Aunque no tengas endpoint /auth/logout)
    document.cookie = 'token=; Max-Age=0; path=/;';
    localStorage.removeItem('authToken');
  };

  useEffect(() => {
    axios
      .get("/auth/validate", { withCredentials: true })
      .then((res) => {
        const { role, name, lastName, banTime, email } = res.data;
        setUserRole(role);
        setUserName(name);
        setUserLastName(lastName);
        setBanTime(banTime);
        setUserEmail(email);
        setIsAuthenticated(true);
      })
      .catch(() => {
        setIsAuthenticated(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userRole,
        userName,
        userLastName,
        banTime,
        setUserName,
        userEmail,
        isAuthenticated,
        setIsAuthenticated,
        setUserRole,
        setUserEmail,
        setUserLastName,
        loading,
        logout // Añadir función de logout

      }}
    >
      {children}
    </AuthContext.Provider>
  );
};