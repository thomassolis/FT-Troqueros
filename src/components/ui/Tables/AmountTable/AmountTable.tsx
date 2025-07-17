import { useState, useEffect } from "react";
import { Input } from "../../inputs/input";
import { Icon } from "@iconify/react/dist/iconify.js";
import { UseFormRegister, UseFormWatch, UseFormSetValue, FieldErrors } from "react-hook-form";
import { RequestsFormValues } from "../../../types/forms/RequestsForm/requestsForm";
import { FieldError } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { DoubleConfirmationAlert } from "../../Alerts/DoubleConfirmation/doubleConfirmation";

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
    errors: FieldErrors<RequestsFormValues>
}


export const AmountTable = ({
    filteredServiceData,
    services,
    selectedIndex,
    register,
    watch,
    setValue,
    useProvider,
    requestFormData,
    errors
}: AmountTableProps) => {
    const [addExtraPrice, setAddExtraPrice] = useState(false);
    const location = useLocation();
    const isEditMode = location.pathname.includes('edit')             
    console.log('requestFormData en Amount', requestFormData);
    // Observamos los valores del formulario
    const descripcion = watch(`servicios.${selectedIndex}.costos_extras.descripcion`);
    const precio = watch(`servicios.${selectedIndex}.costos_extras.precio`);
    const costosExtras = watch(`servicios.${selectedIndex}.costos_extras`) || [];
    const nuevos_costos_extras = watch(`servicios.${selectedIndex}.nuevos_costos_extras`) || [];

    const handleSaveExtra = () => {  
    if (!descripcion || precio == null) return;    
    const nuevoCostoExtra = {
        descripcion,
        precio: Number(precio)
    };

    const path = isEditMode
        ? `servicios.${selectedIndex}.nuevos_costos_extras`
        : `servicios.${selectedIndex}.costos_extras`;

    const currentExtras = watch(path);
    const safeExtras = Array.isArray(currentExtras) ? currentExtras : [];

    setValue(path, [...safeExtras, nuevoCostoExtra]);

    setAddExtraPrice(false);    
    };


    // Función para calcular el total
    const calculateTotal = () => {
    const serviciosBase = Array.isArray(filteredServiceData) 
        ? filteredServiceData.reduce((sum, r) => sum + Number(r.tarifa || r.precio || 0), 0)
        : 0;

    // Costos extras existentes
    const extrasExistentes = Array.isArray(costosExtras) 
        ? costosExtras.reduce((sum, r) => sum + Number(r.precio || 0), 0)
        : 0;

    // Nuevos costos extras (solo en edición)
    const nuevosExtras = isEditMode
    ? Array.isArray(watch(`servicios.${selectedIndex}.nuevos_costos_extras`))
        ? watch(`servicios.${selectedIndex}.nuevos_costos_extras`).reduce((sum, r) => sum + Number(r.precio || 0), 0)
        : 0
    : 0;


    return serviciosBase + extrasExistentes + nuevosExtras;
    };

    //Cabezales de la tabla de precios
    let tableHeaders = []

    if(useProvider){
        tableHeaders = ['Ruta', 'Costo Proveedor', 'Profit', 'Costo Total']
    }else{
        tableHeaders = ['', 'Ruta / Costos Extra', 'Costos', 'SubTotal']
    }

        const pathBase = requestFormData?.servicios?.[selectedIndex]?.costos_extras
  ? `servicios.${selectedIndex}.costos_extras`
  : `servicios.${selectedIndex}.nuevos_costos_extras`;

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
                        {costosExtras.length > 0 ? (
                            <td></td>
                        ):null}                        
                        <td className="py-2 px-4 text-black border border-gray-400">
                            {row.lugar_origen && row.lugar_destino 
                                ? `${row.lugar_origen} - ${row.lugar_destino}`
                                : row.descripcion || 'Servicio'}                            
                        </td>
                        <td className={`py-2 px-4 border border-gray-400 text-center ${useProvider?('text-red-600'):('text-black')}`}>
                            {(!useProvider) ? (
                                `$${Number(row.tarifa || row.precio || 0).toLocaleString()}`
                            ):(`$${requestFormData.precio_proveedor}`)}                            
                        </td>

                        <td className={`py-2 px-4 text-black border-r border-gray-400 text-center ${useProvider?('text-green-600'):('text-black')}`}>
                            {useProvider ? (
                                `${row.tarifa-requestFormData.precio_proveedor}`
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
                        <td align="center" className="">
                            <Icon
                            icon="line-md:trash"
                            width="25"
                            height="25"
                            className="text-red-600 cursor-pointer hover:text-red-400"
                            onClick={async() => {
                                if (isEditMode) {
                                        const response = await DoubleConfirmationAlert({
                                            title: '¿Estás seguro que deseas eliminar este costo extra?',
                                            text: '',
                                            type: 'deleteExtraPrice',
                                            id: costo.id_costos_extras,
                                        });
                                        if(response.success){
                                            const nuevosCostos = costosExtras.filter((_, i) => i !== index);
                                            setValue(`servicios.${selectedIndex}.costos_extras`, nuevosCostos);
                                        }
                         
                                } else {
                                    // Filtrar y actualizar los costos_extras
                                    const nuevosCostos = costosExtras.filter((extra, i) => i !== index);
                                    setValue(`servicios.${selectedIndex}.costos_extras`, nuevosCostos);
                                }
                            }}
                            />

                        </td>
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
                
                    {Array.isArray(nuevos_costos_extras) && nuevos_costos_extras.map((costo, index)=>(
                        <tr key={`extra-${index}`}>
                            <td align="center" className="">
                                <Icon
                                    icon="line-md:trash"
                                    width="25"
                                    height="25"
                                    className="text-red-600 cursor-pointer hover:text-red-400"            
                                    onClick={()=>{                                        
                                        // nuevos_costos_extras.filter((costo)=>costo)
                                        const nuevosCostos = nuevos_costos_extras.filter((_, i) => i !== index);                                        
                                        setValue(`servicios.${selectedIndex}.nuevos_costos_extras`, nuevosCostos);

                                    }}
                                />
                            </td>
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
                    ))  }              
           

                {/* Formulario para añadir nuevos costos extras */}

                { useProvider === false ?
                    (!addExtraPrice) ? (
                        <tr className="cursor-pointer hover:text-gray-400 text-gray-500 italic text-center">
                            <td colSpan={2} className="py-2 px-4 border border-gray-400" onClick={() => setAddExtraPrice(true)}>
                                Nuevo Costo
                            </td>
                            <td className="py-2 px-4 border border-gray-400"></td>
                        </tr>
                    ) : (
                        <tr>
                            {costosExtras.length > 0 ? (
                                <td></td>
                            ):null}                             
                            <td className="py-2 px-4 text-center border border-gray-400">
                            <Input
                                type="text"
                                className2={`py-4 w-full ${errors?.servicios?.[selectedIndex]?.costos_extras?.descripcion ? "border-red-500" : ""}`}
                                placeholder="Descripción del precio extra"
                                {...register(`servicios.${selectedIndex}.costos_extras.descripcion`)}
                            />
                            {errors?.servicios?.[selectedIndex]?.costos_extras?.descripcion && (
                                <p className="text-red-500">
                                    {(errors.servicios[selectedIndex]?.costos_extras?.descripcion as FieldError).message}
                                </p>
                            )}
                            </td>
                            <td className="py-2 px-4 text-center border border-gray-400">
                                <Input 
                                    type="number"
                                    className2="py-4 w-[40%]"
                                    placeholder="Costo"
                                    {...register(`servicios.${selectedIndex}.costos_extras.precio`, { valueAsNumber: true, required:true })}
                                />
                            </td>
                            <td className={`py-3 px-4 text-center ${costosExtras.length>0 ? 'border-none':'border border-gray-400'} flex justify-center items-center`}>
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