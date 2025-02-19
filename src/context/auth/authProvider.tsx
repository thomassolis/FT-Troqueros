import React, {createContext, useState} from "react";

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
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({children}: any) =>{
    const [userRole, setUserRole] = useState<string|any>(null);
    const [userName, setUserName] = useState<string|any>(null);
    const [userLastName, setUserLastName] = useState<string|any>(null);
    const [banTime, setBanTime] = useState<string|any>(null);
    const [userEmail, setUserEmail] = useState<string|any>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    console.log('userRole desde contexto: ',userRole)

    return(
        <AuthContext.Provider value = {{userRole, setUserRole, userName, setUserName, userLastName, setUserLastName, banTime, setBanTime, userEmail, setUserEmail, isAuthenticated, setIsAuthenticated}}>
            {children}
        </AuthContext.Provider>
    )
}