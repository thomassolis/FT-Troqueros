import { useState, useEffect, useContext, useRef } from "react";
import { Icon } from "@iconify/react";
import { vehicleTypeContext } from "../../../context/vehicleType/vehicleType";
import { statusUpdate } from "../../../api/Vehicles/vehicles.routes";
import { changeDriverStatus } from "../../../api/Drivers/Drivers.route";
interface TableData {
    id?: string;
    status?: string;
    [key: string]: any;  // Permitir cualquier clave adicional
}

interface SelectProps {
    statusOptions: string[];
    apiRequest: boolean;
    id: string;
    defaultValue: string;
    tableData: TableData[];
    module?:string
}

// Función para asignar color según el valor seleccionado
const getStatusColor = (status: string) => {
    return status === "Disponible" ? "text-green-600" : "text-red-500";
};

export const Select = ({ statusOptions, apiRequest, id, defaultValue, module }: SelectProps) => {
    const { vehicleType } = useContext(vehicleTypeContext)!;
    const [selectedOption, setSelectedOption] = useState<string>(defaultValue || statusOptions[0]);
    const initialRender = useRef(true);

    useEffect(() => {
        setSelectedOption(defaultValue);
    }, [defaultValue]);

    const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = event.target.value;
        setSelectedOption(newValue);
        if (apiRequest && module === 'Vehicles' ) {
            try {
                await statusUpdate({
                    vehicleType: vehicleType,
                    vehicleID: id,
                    status: newValue
                });
            } catch (error) {
                console.error("Error updating status:", error);
                // Revertir el cambio si falla
                setSelectedOption(defaultValue);
            }
        }else if (apiRequest && module === 'Drivers'){
            try{
                await changeDriverStatus ({
                    id_conductor: id,
                    status: newValue
                })
            }catch(error){
                console.error("Error updating status:", error);
            }
        }
        
        initialRender.current = false;
    };

    return (
        <div className="relative w-full">
            <select
                className={`appearance-none rounded-md p-2 px-3 w-full border border-gray-300 font-bold transition-colors duration-300 ${getStatusColor(selectedOption)}`}
                onChange={handleChange}
                value={selectedOption}
                style={{ color: selectedOption === "Disponible" ? "green" : "red" }}
            >
                {statusOptions.map((option, index) => (
                    <option key={index} value={option} className="text-black font-semibold">
                        {option}
                    </option>
                ))}
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <Icon icon="ic:baseline-arrow-drop-down" width="24" height="24" className="text-gray-500"/>
            </div>
        </div>
    );
};
