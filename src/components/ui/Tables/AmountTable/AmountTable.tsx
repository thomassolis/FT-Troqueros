import { useState, useContext } from "react";
import { Input } from "../../inputs/input";
import { Icon } from "@iconify/react/dist/iconify.js";
import { UseFormRegister, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { RequestsFormValues } from "../../../types/forms/RequestsForm/requestsForm";
import { dynamicRequestsContext } from "../../../../context/Requests/DynamicRequestsOptions";

interface AmountTableProps {
    filteredServiceData: {
        lugar_origen?: string;
        lugar_destino?: string;
        tarifa?: number | string;
        descripcion?: string;
        precio?: number | string;
    }[];
    services?: {
        serviceType: string;
        rowIndex: number;
    }[];
    selectedIndex: number;
    register: UseFormRegister<RequestsFormValues>;
    watch: UseFormWatch<RequestsFormValues>;
    setValue: UseFormSetValue<RequestsFormValues>;
    useProvider:boolean
}

export const AmountTable = ({
    filteredServiceData,
    services,
    selectedIndex,
    register,
    watch,
    setValue,
    useProvider
}: AmountTableProps) => {
    console.log('filteredServiceData: ', filteredServiceData);
    const [addExtraPrice, setAddExtraPrice] = useState(false);
    

    // Observamos los valores del formulario
    const descripcion = watch(`servicios.${selectedIndex}.costos_extras.descripcion`);
    const precio = watch(`servicios.${selectedIndex}.costos_extras.precio`);
    const costosExtras = watch(`servicios.${selectedIndex}.costos_extras`) || [];

    const handleSaveExtra = () => {
        if (!descripcion || precio == null) return;

        // Creamos el nuevo costo extra con la estructura correcta
        const nuevoCostoExtra = {
            descripcion,
            precio: Number(precio)
        };

        // Actualizamos manteniendo la inmutabilidad
        const nuevosCostos = Array.isArray(costosExtras) 
            ? [...costosExtras, nuevoCostoExtra]
            : [nuevoCostoExtra];

        setValue(`servicios.${selectedIndex}.costos_extras`, nuevosCostos);
        
        setAddExtraPrice(false);
    };

    // Función para calcular el total
    const calculateTotal = () => {
        const serviciosBase = Array.isArray(filteredServiceData) 
            ? filteredServiceData.reduce((sum, r) => sum + Number(r.tarifa || r.precio || 0), 0)
            : 0;  

        const extras = Array.isArray(costosExtras) 
            ? costosExtras.reduce((sum: number, r: any) => sum + Number(r.precio || 0), 0)
            : 0;
        return serviciosBase + extras;
    };

    //Cabezales de la tabla de precios
    let tableHeaders = []

    if(useProvider){
        tableHeaders = ['Rutas', 'Costo Proveedor', 'Profit', 'Costo Total']
    }else{
        tableHeaders = ['Rutas', 'Costos', 'Subtotal']
    }
    

    return (
        <table className="w-[70%] table-auto border border-gray-400 mt-5">
            <thead className="bg-orange-400">
                <tr>
                    {tableHeaders.map((title, index) => (
                        <th key={index}>
                            <h1 className="text-black">{title}</h1>
                        </th>
                    ))}                        
                </tr>                                                        
            </thead>

            <tbody>
                {/* Filas de servicios base */}
                {filteredServiceData.map((row, index) => (                        
                    <tr key={`base-${index}`}>
                        <td className="py-2 px-4 text-black border border-gray-400">
                            {row.lugar_origen && row.lugar_destino 
                                ? `${row.lugar_origen} - ${row.lugar_destino}`
                                : row.descripcion || 'Servicio'}                            
                        </td>
                        <td className="py-2 px-4 text-black border border-gray-400 text-center">
                            {(!useProvider) ? (
                                `$${Number(row.tarifa || row.precio || 0).toLocaleString()}`
                            ):('Costo Proveedor')}                            
                        </td>

                        <td className="py-2 px-4 text-black border-r border-gray-400 text-center">
                            {useProvider ? (
                            'Profit'
                            ): (
                                null
                            )}
                        </td>


                        {useProvider &&
                        <>
                            <td className="py-2 px-4 text-black border-r border-gray-400 text-center"> 
                                ${Number(row.tarifa || row.precio || 0).toLocaleString()}                               
                            </td>                            
                        </>                        
                        }                        
                    </tr>
                ))}

                {/* Filas de costos extras */}
                {Array.isArray(costosExtras) && costosExtras.map((costo, index) => (
                    <tr key={`extra-${index}`}>
                        <td className="py-2 px-4 text-black border border-gray-400">
                            {costo.descripcion}
                        </td>
                        <td className="py-2 px-4 text-black border border-gray-400 text-center">
                            ${Number(costo.precio || 0).toLocaleString()}
                        </td>
                        <td className="py-2 px-4 text-black border-r border-gray-400 text-center"></td>
                        {useProvider &&
                        <>
                            <td className="py-2 px-4 text-black border-r border-gray-400 text-center"></td>                           
                        </>                        
                        }  
                    </tr>
                ))}

                {/* Formulario para añadir nuevos costos extras */}

                { useProvider === false ?
                    (!addExtraPrice) ? (
                        <tr className="cursor-pointer hover:text-gray-400 text-gray-500 italic text-center">
                            <td colSpan={2} className="py-2 px-4 border border-gray-400" onClick={() => setAddExtraPrice(true)}>
                                Nuevo Costo
                            </td>
                            <td className="py-2 px-4 !border-b-0 border-gray-400"></td>
                        </tr>
                    ) : (
                        <tr>
                            <td className="py-2 px-4 text-center border border-gray-400">
                                <Input 
                                    type="text" 
                                    className2={'py-4 w-full'} 
                                    placeholder="Descripción del trabajo"
                                    {...register(`servicios.${selectedIndex}.costos_extras.descripcion`)}
                                />
                            </td>
                            <td className="py-2 px-4 text-center border border-gray-400">
                                <Input 
                                    type="number"
                                    className2="py-4 w-[40%]"
                                    placeholder="Costo"
                                    {...register(`servicios.${selectedIndex}.costos_extras.precio`, { valueAsNumber: true })}
                                />
                            </td>
                            <td className="py-3 px-4 text-center !border-t border-r-2 border-gray-400 flex justify-center items-center">
                                <Icon 
                                    icon="ph:check-fill" 
                                    width="28" 
                                    height="28" 
                                    className='text-green-500 rounded-md cursor-pointer hover:text-green-700' 
                                    onClick={handleSaveExtra}
                                />
                                <Icon 
                                    icon="basil:cancel-solid" 
                                    width="28" 
                                    height="28"  
                                    className='text-red-600 cursor-pointer hover:text-red-800' 
                                    onClick={() => setAddExtraPrice(false)}
                                />
                            </td>
                            {useProvider &&
                            <>
                                <td className="py-2 px-4 text-black border-r border-gray-400 text-center"></td>                               
                            </>                        
                            }  
                        </tr>
                    ):(<></>)
                }

                {/* Fila de TOTAL */}
                {!useProvider &&
                                <tr className="font-bold">
                    <td className="py-2 px-4 text-right border border-gray-400 text-black" colSpan={2}>
                        TOTAL 
                    </td>
                    <td className="py-2 px-4 text-black border border-gray-400">                        
                        ${calculateTotal().toLocaleString()}
                    </td>
                </tr>
                }

            </tbody>
        </table>
    );
};