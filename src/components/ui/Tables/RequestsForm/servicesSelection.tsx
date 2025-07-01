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
import { RouteRow } from '../../../../context/Requests/DynamicRequestsOptions';

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
  setRows: React.Dispatch<React.SetStateAction<RouteRow[]>>;  
  rows: RouteRow[];
}

export const ServicesSelectionTable: React.FC<ServicesSelectionTableProps> = ({ 
  titles, 
  serviceTypes ,
  servicesSelect,
  control,
  register,
  setValue,
  rows, 
  setRows

}) => {
  const [selectData, setSelectData] = useState<SelectOptionTypes[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const {routesInformation, setRoutesInformation, routeIDsByRow, setRouteIDsByRow} = useContext(dynamicRequestsContext)!;
  const [isEntregaVacioSelected, setIsEntregaVacioSelected] = useState(false);
  
  useEffect(()=>{
    console.log('serviceTypes: ', serviceTypes);
  }, [serviceTypes])

  // Generamos las filas basadas en todos los serviceTypes
useEffect(() => {
let globalRowIndex = 0; // Fuera del flatMap

const newRows: RouteRow[] = serviceTypes.flatMap((st) => {
    return Array.from({ length: st.quantity }).map((_, i) => {
        const rowNumber = i + 1;
        const composedKey = `${st.id}-${rowNumber}`;
        const routeID = routeIDsByRow[composedKey] || '';

        const extra = routesInformation[composedKey] || {
            lugar_origen: '',
            lugar_destino: '',
            tarifa: '',
            routeID: '',
            entrega_vacio: false,
        };

        const row = {
            serviceTypeId: st.id,
            serviceType: st.selectedValue,
            rowNumber,
            serviceID: st.serviceID,
            rowIndex: globalRowIndex++, // Índice único incremental
            id_servicio_datos: routeID,
            ...extra,
        };

        return row;
    });
});

    setRows(newRows);
}, [serviceTypes, routesInformation, routeIDsByRow]);

  console.log('rows recibido en la seleccion de servicio: ', rows);
  useEffect(()=>{
    console.log('rows en la seleccion de servicio: ', rows);
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

    console.log('Route:', route);
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


  const handleEntregaVacioChange = (rowIndex: number, value: boolean) => {      
    const updatedRows = [...rows];
    updatedRows[rowIndex].entrega_vacio = value;
    setRows(updatedRows); // Actualiza el estado de filas
  };
  return (
    <table className="w-full border border-gray-300 text-sm text-left text-black">
      <thead className="bg-gray-100">
        <tr>
          {titles.map((title, index) => (
            <th key={index} className="border border-gray-300 px-4 py-2 font-semibold text-center ">
              {title}
            </th>
          ))}
          {isEntregaVacioSelected && 
            <th className="border border-gray-400 px-4 py-2 text-center">Fecha Límite</th>
          }          
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => {
          const fieldName = `servicios.${rowIndex}` as const;

          return(
          <tr key={`${row.serviceType}-${rowIndex}`}>
            <td className="border border-gray-400 px-4 py-2 text-center">
              {row.serviceType}
            </td>
            <td className="border border-gray-400 px-4 py-2 text-center">
              <Controller
                name={`${fieldName}.id_servicio_datos`}
                control={control}
                defaultValue={row.id_servicio_datos}
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
            <td className="border border-gray-400 px-4 py-2 text-center">
              {row.lugar_origen}
            </td>
            <td className="border border-gray-400 px-4 py-2 text-center">
              {row.lugar_destino}
            </td>

              <td className="border border-gray-400 px-4 py-2 text-center w-[10%]">
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
                        className="w-full border border-gray-300 rounded px-2 py-1"
                      />
                    );
                  }}
                />
              </td>

              
              <td className="border border-gray-400 px-4 py-2 text-center">
                <Controller
                  name={`${fieldName}.entrega_vacio`}
                  control={control}
                  // defaultValue={false}
                  render={({ field }) => (
                    <input
                      type="checkbox"
                      checked={field.value || false}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setIsEntregaVacioSelected(checked);

                        // 1. Actualiza el campo principal (entrega_vacio)
                        field.onChange(checked);
                        // 2. Actualiza el estado local de la fila
                        handleEntregaVacioChange(rowIndex, checked);
                      }}
                    />
                  )}
                />
              </td>        


              {/* Muestra la columna adicional solo si esta fila tiene entrega_vacio en true */}
              {row.entrega_vacio && (
                <td className="border border-gray-400 px-4 py-2 text-center">
                  {/* Aquí puedes poner el contenido específico para esta fila */}
                  <Input
                    type='date'
                    className2={'w-[90%] py-2 px-4'}
                    {...register(`${fieldName}.fecha_limite`)}
                  />
                </td>
              )}


          </tr>
          )
        })}
      </tbody>
    </table>
  );
};
