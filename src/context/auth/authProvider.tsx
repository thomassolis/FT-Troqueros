import { createContext, useState, useEffect } from "react";
import axios from "axios";

interface AuthContextType {
  userRole: string | null;
  setUserRole: (role: string | null) => void;
  userName: string | null;
  setUserName: (name: string | null) => void;
  userLastName: string | null;
  setUserLastName: (lastName: string | null) => void;
  banTime: string | null;
  setBanTime: (time: string | null) => void;
  userEmail: string | null;
  setUserEmail: (email: string | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userLastName, setUserLastName] = useState<string | null>(null);
  const [banTime, setBanTime] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

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
        setUserRole,
        userName,
        setUserName,
        userLastName,
        setUserLastName,
        banTime,
        setBanTime,
        userEmail,
        setUserEmail,
        isAuthenticated,
        setIsAuthenticated,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
