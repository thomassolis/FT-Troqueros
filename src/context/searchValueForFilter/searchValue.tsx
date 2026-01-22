import { createContext, useState, Dispatch, SetStateAction, useEffect } from "react";

interface contextSearchValue {
    searchValue: string | number 
    setSearchValue: Dispatch<SetStateAction<string | null>>;
    selectedOption: {value: string, label: string} | null
    setSelectedOption: Dispatch<SetStateAction<{value: string, label: string} | null>>;
    currentPage: number; 
    setCurrentPage: (page: number) => void; 
    withInvoice: boolean, 
    setWithInvoice: Dispatch<SetStateAction<boolean>>;
    withoutInvoice: boolean, 
    setWithoutInvoice: Dispatch<SetStateAction<boolean>>;
}

export const searchValueContext = createContext <contextSearchValue | null >(null);

export const SearchValueProvider = ({children}:any) =>{
    const [searchValue, setSearchValue] = useState<string | any>(null); 
    const [selectedOption, setSelectedOption] = useState<{value: string, label: string} | null>({value: 'id', label: 'ID'});    
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [withInvoice, setWithInvoice] = useState(true);
    const [withoutInvoice, setWithoutInvoice] = useState(true);
    // Efecto que se ejecuta cuando cambia la URL (pathname o search)    

    useEffect(() => {
        setSearchValue(''); // Resetear a cadena vacía cuando la URL cambia
    }, [window.location.pathname, window.location.search]);

    return(
        <searchValueContext.Provider value={{searchValue, setSearchValue, selectedOption, setSelectedOption, currentPage, setCurrentPage, withInvoice, setWithInvoice, withoutInvoice, setWithoutInvoice}}>
            {children}
        </searchValueContext.Provider>
    )
}

