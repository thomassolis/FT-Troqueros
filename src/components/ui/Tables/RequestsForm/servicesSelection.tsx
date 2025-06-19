import Select from 'react-select';
import { SelectData } from '../../../../api/Requests/requests.route';
import { useState, useEffect, useMemo, useContext } from 'react';
import { TransformSelectData } from '../../../../functions/transformSelectData/TransformSelectData';
import { SelectOptionTypes } from '../../../types/Select/select';
import { ServiceType } from '../../../../context/Requests/DynamicRequestsOptions';
import { dynamicRequestsContext } from '../../../../context/Requests/DynamicRequestsOptions';
import { Controller, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { RequestsFormValues } from '../../../types/forms/RequestsForm/requestsForm';
import { Control } from 'react-hook-form';
import { Input } from '../../inputs/input';
interface ServicesSelectionTableProps {
  titles: string[];
  serviceTypes: ServiceType[];
  servicesSelect: SelectOptionTypes[]
  routeIDsByRow: Record<string, string>;
  setRouteIDsByRow: React.Dispatch<React.SetStateAction<Record<string, string>>>;   
  setRoutesInformation: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  routesInformation: Record<string, any>;
  control: Control<RequestsFormValues>
  register: UseFormRegister<RequestsFormValues>;
  setValue: UseFormSetValue<RequestsFormValues>;
}

export const ServicesSelectionTable: React.FC<ServicesSelectionTableProps> = ({ 
  titles, 
  serviceTypes ,
  servicesSelect,
  control,
  register,
  setValue
}) => {
  const [selectData, setSelectData] = useState<SelectOptionTypes[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // const [rows, setRows] = useState<any[]>([]);
  const {rows, setRows, routesInformation, setRoutesInformation, routeIDsByRow, setRouteIDsByRow} = useContext(dynamicRequestsContext)!;
  

  // Generamos las filas basadas en todos los serviceTypes
  useEffect(() => {
    const newRows = serviceTypes.flatMap((st, index) =>
      Array.from({ length: st.quantity }).map((_, i) => {
        const rowNumber = i + 1;
        const groupIndex = index;
        const composedKey = `${st.id}-${rowNumber}`;
        const routeID = routeIDsByRow[composedKey];

        const extra = routeID ? routesInformation[composedKey] : {
          lugar_origen: '',
          lugar_destino: '',
          tarifa: '',
          routeID: ''
        };

        return {
          serviceTypeId: st.id,
          serviceType: st.selectedValue,
          rowNumber,
          serviceID: st.serviceID,
          groupIndex,
          rowIndex: index * st.quantity + i,
          id_servicio_datos: routeID ?? '',
          ...extra
        };
      })
    );

    setRows(newRows);
  }, [serviceTypes, routesInformation, routeIDsByRow]);

  useEffect(()=>{
    console.log('rows: ', rows);
  }, [rows])


    const getRoutesForSelect = async(serviceID:number|string) => {
      try{
        setIsLoading(true)
        const response = await SelectData({ type: 'routes', serviceID: serviceID })        
        const transformedData = TransformSelectData({type:'routes', data:response})        
        setSelectData(transformedData ?? []);
      }catch(error){
        console.error('Error en: getRoutesForSelect', error)
      }finally{
        setIsLoading(false);
      }
    }

const getRoutesInformation = async (
  serviceID: number,
  groupIndex: number,
  rowNumber: number
) => {

  const composedKey = `${groupIndex}-${rowNumber}`; // esto ya está bien, porque ahora groupIndex es id


  try {
    const response = await SelectData({ type: 'routesInfo', serviceID: serviceID });
    // Si response es un array, toma solo el primero
    const route = Array.isArray(response) ? response[0] : response;

    // Limpia y guarda solo los campos necesarios
    const flatInfo = {
      lugar_origen: route?.lugar_origen ?? '',
      lugar_destino: route?.lugar_destino ?? '',
      tarifa: route?.tarifa ?? '',
      routeID: route?.id_servicio_datos ?? ''
    };

    if (route?.id_servicio_datos) {
      // Guarda la información en routesInformation por composedKey
      setRoutesInformation(prev => ({
        ...prev,
        [composedKey]: flatInfo
      }));

      // Asocia composedKey con el id_servicio_datos
      setRouteIDsByRow(prev => ({
        ...prev,
        [composedKey]: route.id_servicio_datos
      }));
    }
  } catch (error) {
    console.error('Error en getRoutesInformation', error);
  }
};



useEffect(() => {
  rows.forEach((row, rowIndex) => {
    const composedKey = `${row.serviceTypeId}-${row.rowNumber}`;
    const fieldPath = `servicios.${rowIndex}.tarifa` as const;

    if (row.tarifa !== undefined && row.tarifa !== "") {
      setValue(fieldPath, row.tarifa);
    }

    const idFieldPath = `servicios.${rowIndex}.id_servicio_datos` as const;
    if (row.id_servicio_datos) {
      setValue(idFieldPath, row.id_servicio_datos);
    }

    const checkboxFieldPath = `servicios.${rowIndex}.entrega_vacio` as const;
    if (row.entrega_vacio !== undefined) {
      setValue(checkboxFieldPath, row.entrega_vacio);
    }
  });
}, [rows, setValue]);


  return (
    <table className="w-full border border-gray-300 text-sm text-left text-black">
      <thead className="bg-gray-100">
        <tr>
          {titles.map((title, index) => (
            <th key={index} className="border border-gray-300 px-4 py-2 font-semibold text-center">
              {title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => {
          const fieldName = `servicios.${rowIndex}` as const;

          return(
          <tr key={`${row.serviceType}-${rowIndex}`}>
            <td className="border border-gray-400 px-4 py-2">
              {row.serviceType}
            </td>
            <td className="border border-gray-400 px-4 py-2">
              <Controller
                name={`${fieldName}.id_servicio_datos`}
                control={control}
                render={({ field }) => (
                <Select
                {...field}
                  placeholder={'Seleccione una ruta'}
                  options={selectData}
                  value={selectData.find(selectData => selectData.value === field.value)} // Para mostrar el label correcto
                  isLoading={isLoading}                        
                      onChange={(selectedOption) => {
                        // Actualiza el valor del formulario
                        field.onChange(selectedOption?.value);
                        // Obtiene la información de la ruta
                        if (selectedOption?.value) {
                          getRoutesInformation(
                            Number(selectedOption.value),
                            row.serviceTypeId,
                            row.rowNumber
                          );
                        }
                      }}
                  onMenuOpen={() => getRoutesForSelect(row.serviceID)}
                />
              )}
              />

            </td>
            <td className="border border-gray-400 px-4 py-2">
              {row.lugar_origen}
            </td>
            <td className="border border-gray-400 px-4 py-2">
              {row.lugar_destino}
            </td>

              <td className="border border-gray-400 px-4 py-2">
                <Controller
                  name={`${fieldName}.tarifa`}
                  control={control}
                  // defaultValue={row.tarifa || ''} // Asegura el valor inicial
                  render={({ field }) => {
                    // Sincronización bidireccional
                    const currentValue = routesInformation[`${row.serviceTypeId}-${row.rowNumber}`]?.tarifa || field.value;
                    
                    return (
                      <input
                        type="number"
                        value={row.tarifa || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value); // Actualiza react-hook-form
                          
                          // Actualiza el estado local
                          const composedKey = `${row.serviceTypeId}-${row.rowNumber}`;
                          setRoutesInformation(prev => ({
                            ...prev,
                            [composedKey]: {
                              ...prev[composedKey],
                              tarifa: value
                            }
                          }));
                        }}
                        className="w-[40%] border border-gray-300 rounded px-2 py-1"
                      />
                    );
                  }}
                />
              </td>

              
              <td className="border border-gray-400 px-4 py-2 text-center">
                <Controller
                  name={`${fieldName}.entrega_vacio`}
                  control={control}
                  defaultValue={false}
                  render={({ field }) => (
                    <input
                      type="checkbox"
                      checked={field.value || false}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  )}
                />
              </td>           
          </tr>
          )
        })}
      </tbody>
    </table>
  );
};
