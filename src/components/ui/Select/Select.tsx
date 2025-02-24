import { useState } from "react";
import { Icon } from "@iconify/react";

interface SelectProps {
    statusOptions: string [];
}

// Función para asignar color según el valor seleccionado
const getStatusColor = (status: string) => {
    return status === "Disponible" ? "text-green-600" : "text-red-500";
};

export const Select = ({statusOptions}:SelectProps) => {
    // Estado inicial con la primera opción del array
    const [selectedOption, setSelectedOption] = useState<string>(statusOptions[0]);

    // Manejador de cambios en el select
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOption(event.target.value);
    };

    return (
        <div className="relative w-full">
            <select
                className={`appearance-none rounded-md p-2 px-3 w-full border border-gray-300 font-bold ${getStatusColor(selectedOption)}`}
                onChange={handleChange}
                value={selectedOption}
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
