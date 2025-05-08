import { useState, useEffect, useContext } from "react";
import { Icon } from "@iconify/react";
import { sendDataForUpdate } from "../../../api/Home/Vehicles/vehicles.routes";
import { vehicleTypeContext } from "../../../context/vehicleType/vehicleType";
import { statusUpdate } from "../../../api/Home/Vehicles/vehicles.routes";

interface SelectProps {
    statusOptions: string [];
    apiRequest: boolean
    id: string    
    defaultValue:string;
    tableData:[]
}

// Función para asignar color según el valor seleccionado
const getStatusColor = (status: string) => {
    console.log('status en colores: ',status)
    return status === "Disponible" ? "text-green-600" : "text-red-500";
};

export const Select = ({statusOptions, apiRequest, id, defaultValue, tableData}:SelectProps) => {
    console.log('id recibido', id);
    console.log('DEFAULT', defaultValue);
    
    const {vehicleType} = useContext(vehicleTypeContext)!;
    
    console.log('vehicleType',vehicleType)

    // Estado inicial con la primera opción del array    
    const [selectedOption, setSelectedOption] = useState<string>(statusOptions[0]);

    useEffect(()=>{
        console.log('USEeFFECT')
        if(defaultValue === null || defaultValue === 'No Disponible'){
            setSelectedOption(statusOptions[0]);
        }else{
            setSelectedOption(statusOptions[1]);
        }
    }, [selectedOption, tableData])    

    // Manejador de cambios en el select
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        console.log('Chamgeee');
        setSelectedOption(event.target.value);
    };

    useEffect(() => {
        console.log('SELECTED OPTION',selectedOption)
        if (selectedOption !== statusOptions[0]) {
            if (apiRequest) {
                const response = statusUpdate({
                    vehicleType: vehicleType,
                    vehicleID: id,
                    status: selectedOption
                }) 
            }
        }
    }, [selectedOption]);


    

    return (
        <div className="relative w-full">
            <select
                className={`appearance-none rounded-md p-2 px-3 w-full border border-gray-300 font-bold ${getStatusColor(selectedOption)}`}
                onChange={handleChange}
                // value={selectedOption}
                defaultValue={selectedOption}
            >
                {statusOptions.map((option, index) => (
                    <option key={index} value={option} className="text-black">
                        {option}
                    </option>
                ))}
            </select>
            {/* Ícono de flecha personalizada */}
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <Icon icon="ic:baseline-arrow-drop-down" width="24" height="24" className="text-gray-500"/>
            </div>
        </div>
    );
};
