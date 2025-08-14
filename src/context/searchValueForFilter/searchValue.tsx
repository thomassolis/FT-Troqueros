import { createContext, useState, Dispatch, SetStateAction, useEffect } from "react";

interface contextSearchValue {
    searchValue: string | number 
    setSearchValue: Dispatch<SetStateAction<string | null>>;
    selectedOption: {value: string, label: string} | null
    setSelectedOption: Dispatch<SetStateAction<{value: string, label: string} | null>>;
}

export const searchValueContext = createContext <contextSearchValue | null >(null);

export const SearchValueProvider = ({children}:any) =>{
    const [searchValue, setSearchValue] = useState<string | any>(null); 
    const [selectedOption, setSelectedOption] = useState<{value: string, label: string} | null>({value: 'id', label: 'ID'});    

    // Efecto que se ejecuta cuando cambia la URL (pathname o search)
    useEffect(() => {
        setSearchValue(''); // Resetear a cadena vacía cuando la URL cambia
    }, [window.location.pathname, window.location.search]);

    return(
        <searchValueContext.Provider value={{searchValue, setSearchValue, selectedOption, setSelectedOption}}>
            {children}
        </searchValueContext.Provider>
    )
}

