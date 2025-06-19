import { useContext } from "react"
import { dynamicRequestsContext } from "../../../../context/Requests/DynamicRequestsOptions"
import { formattedServiceDescriptions } from "../../../../functions/cleanData/ServiceTypeDescription/ServiceTypeDescriptionData"
import Select from 'react-select';
import { SelectData } from "../../../../api/Requests/requests.route";
import { TransformSelectData } from "../../../../functions/transformSelectData/TransformSelectData";
import { useState } from "react";
import { SelectOptionTypes } from "../../../types/Select/select";
import { Controller, Control } from "react-hook-form";
import { RequestsFormValues } from "../../../types/forms/RequestsForm/requestsForm";

interface SelectionTeamTableProps {
    title: string[]
    control: Control<RequestsFormValues>
}
export const SelectionTeamTable = ({title, control}: SelectionTeamTableProps) => {
    const {rows} = useContext(dynamicRequestsContext)!;
    const [selectData, setSelectData] = useState<SelectOptionTypes[]>([]);

    ///////
    const [driversData, setDriversData] = useState<SelectOptionTypes[]>([]);
    const [chasisData, setChasisData] = useState<SelectOptionTypes[]>([]);
    const [cabezalData, setCabezalData] = useState<SelectOptionTypes[]>([]);
    const [furgonData, setFurgonData] = useState<SelectOptionTypes[]>([]);
    ///////
    const [selectedOptions, setSelectedOptions] = useState<
        Record<number, { chasis: string | null; furgon: string | null }>
    >({});

    const [isLoading, setIsLoading] = useState<boolean>(false)
    // serviceDescription guardará el formato tipoServicio(LugarOrigen - LugarLLegada) para la primera columna de la tabla
    const serviceDescription = formattedServiceDescriptions(rows)

    console.log('serviceDescription', serviceDescription);

    const getRoutesForSelect = async(type:"service" | "routes" | "customers" | "providers" | "drivers" | "chasis" | 'cabezal' | 'furgon') => {
        try{
            setIsLoading(true);
            const response = await SelectData({type});
            const transformedData = TransformSelectData({type:type, data:response});
            // setSelectData(transformedData ?? []);
            
            if(type === 'drivers'){
                setDriversData(transformedData ?? []);
            } else if (type === 'chasis'){
                setChasisData(transformedData ?? [])
            }else if(type === 'cabezal'){
                setCabezalData(transformedData ?? [])
            }else if(type === 'furgon'){
                setFurgonData(transformedData ?? [])
            }

        }catch(error){
            console.error('');
        }finally{
            setIsLoading(false);
        }
    }

      // Función para manejar el cambio en los Select
    const handleSelectChange = (rowIndex: number, selectType: string, value: string | null) => {    
        setSelectedOptions((prev) => ({
        ...prev,
        [rowIndex]: {
            ...prev[rowIndex],
            [selectType]: value,
        },
        }));
    };

    return (
            <table className="w-full border border-gray-300 text-sm text-left text-black">
                <thead className="bg-gray-100">
                    <tr>
                    {title.map((title, index) => (
                        <th key={index} className="border border-gray-300 px-4 py-2 font-semibold text-center">
                        {title}
                        </th>
                    ))}
                    </tr>
                </thead>

<tbody>
  {serviceDescription.map((service, rowIndex) => {
    const fieldName = `servicios.${rowIndex}` as const;

    return (
      <tr key={rowIndex}>
        <th>{service}</th>

        <th>
          <Controller
            name={`${fieldName}.id_conductor`}
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                onMenuOpen={() => getRoutesForSelect('drivers')}
                options={driversData}
                isLoading={isLoading}                
                // Se asegura de solo guardar el 'value' del select
                onChange={(selectedOption) => field.onChange(selectedOption ? selectedOption.value : null)}
                value={driversData.find((option) => option.value === field.value) || null}
              />
            )}
          />
        </th>

        <th>
          <Controller
            name={`${fieldName}.id_chasis`}
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                onMenuOpen={() => getRoutesForSelect('chasis')}
                options={chasisData}
                isLoading={isLoading}
                onChange={(selectedOption) => field.onChange(selectedOption ? selectedOption.value : null)}
                value={chasisData.find((option) => option.value === field.value) || null}
              />
            )}
          />
        </th>

        <th>
          <Controller
            name={`${fieldName}.id_cabezal`}
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                onMenuOpen={() => getRoutesForSelect('cabezal')}
                options={cabezalData}
                isLoading={isLoading}
                onChange={(selectedOption) => field.onChange(selectedOption ? selectedOption.value : null)}
                value={cabezalData.find((option) => option.value === field.value) || null}
              />
            )}
          />
        </th>

        <th>
          <Controller
            name={`${fieldName}.id_furgon`}
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                onMenuOpen={() => getRoutesForSelect('furgon')}
                options={furgonData}
                isLoading={isLoading}
                onChange={(selectedOption) => field.onChange(selectedOption ? selectedOption.value : null)}                
                value={furgonData.find((option) => option.value === field.value) || null}
              />
            )}
          />
        </th>
      </tr>
    );
  })}
</tbody>



    </table>
    )
}