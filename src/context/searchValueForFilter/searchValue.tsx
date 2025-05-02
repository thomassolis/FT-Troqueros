import { createContext, useState, Dispatch, SetStateAction } from "react";

interface contextSearchValue {
    searchValue: string | null
    setSearchValue: Dispatch<SetStateAction<string | null>>;
}

export const searchValueContext = createContext <contextSearchValue | null >(null);

export const SearchValueProvider = ({children}:any) =>{
    const [searchValue, setSearchValue] = useState<string | any>(null); 
    return(
        <searchValueContext.Provider value={{searchValue, setSearchValue}}>
            {children}
        </searchValueContext.Provider>
    )
}

