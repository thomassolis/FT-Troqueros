import { createContext, useState, Dispatch, SetStateAction, useEffect } from "react";

interface contextSearchValue {
    searchValue: string | null
    setSearchValue: Dispatch<SetStateAction<string | null>>;
}

export const searchValueContext = createContext <contextSearchValue | null >(null);

export const SearchValueProvider = ({children}:any) =>{
    const [searchValue, setSearchValue] = useState<string | any>(null); 

    // Efecto que se ejecuta cuando cambia la URL (pathname o search)
    useEffect(() => {
        setSearchValue(''); // Resetear a cadena vacía cuando la URL cambia
    }, [window.location.pathname, window.location.search]);

    return(
        <searchValueContext.Provider value={{searchValue, setSearchValue}}>
            {children}
        </searchValueContext.Provider>
    )
}

