import { createContext, useState, Dispatch, SetStateAction } from "react";

interface contextVehicleType {
    vehicleType?: string | null
    setVehicleType?: Dispatch<SetStateAction<string | null>>;
}

export const vehicleTypeContext = createContext <contextVehicleType | null>(null);

export const VehicleTypeProvider = ({children}:any) =>{
    const [vehicleType, setVehicleType] = useState<string|any>(null);    
    return(
        <vehicleTypeContext.Provider value={{vehicleType, setVehicleType}}>
            {children}
        </vehicleTypeContext.Provider>
    )
}

