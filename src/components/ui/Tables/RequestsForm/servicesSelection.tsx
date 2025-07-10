import Select from 'react-select';
import { SelectData } from '../../../../api/Requests/requests.route';
import { useState, useEffect, useContext, useRef } from 'react';
import { TransformSelectData } from '../../../../functions/transformSelectData/TransformSelectData';
import { SelectOptionTypes } from '../../../types/Select/select';
import { ServiceType } from '../../../../context/Requests/DynamicRequestsOptions';
import { dynamicRequestsContext } from '../../../../context/Requests/DynamicRequestsOptions';
import { Controller, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { RequestsFormValues } from '../../../types/forms/RequestsForm/requestsForm';
import { Control } from 'react-hook-form';
import dayjs from 'dayjs';
import { RouteRow } from '../../../../context/Requests/DynamicRequestsOptions';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Icon } from '@iconify/react/dist/iconify.js';
import { DoubleConfirmationAlert } from '../../Alerts/DoubleConfirmation/doubleConfirmation';
import { WarningAlert } from '../../Alerts/Warning/Warning';

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
  isEditMode: boolean
}

export const ServicesSelectionTable: React.FC<ServicesSelectionTableProps> = ({ 
  titles, 
  serviceTypes ,
  servicesSelect,
  control,
  register,
  setValue,
  rows, 
  setRows,
  routesInformation,
  setRoutesInformation,
  requestData,
  isEditMode,
  requestFormData
}) => {
  // const [selectData, setSelectData] = useState<SelectOptionTypes[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { routeIDsByRow, setRouteIDsByRow } = useContext(dynamicRequestsContext)!;  
  const [selectData, setSelectData] = useState<SelectOptionTypes[]>([]);
  const [selectDataMap, setSelectDataMap] = useState<Record<string, SelectOptionTypes[]>>({});

  const deleteService = async({serviceID}:string) => {
    console.log('service',serviceID)
    console.log('deleteService: ', serviceID, rows);
    const response = await DoubleConfirmationAlert({
      title: '¿Seguro deseas eliminar este servicio?',
      text: 'Se eliminaran todos los datos guardados incluyendo rutas, tarifas, etc',
      id: serviceID,
      type: 'deleteService'      
    });
    console.log(response);
    if(response.success){
      console.log('entré')
      setRows(prev => prev.filter(row => row.serviceTypeId !== serviceID));
    }
  }

  console.log('serviceTypes que llega: ', serviceTypes);

  // Generamos las filas basadas en todos los serviceTypes  
  // Estado para controlar si es la primera carga
    let globalRowIndex = 0;
    useEffect(() => {

      //Al momento de editar la petición, esta función es la que se encarga de llenar los datos de la petición
      if (requestData?.servicios?.length) {

        console.log('Entré al primer IF')
        const newRows: RouteRow[] = requestData.servicios.map((servicio, index) => {
          const composedKey = `${servicio.id_pedidoServicio}-${index + 1}`; 
          return {
            serviceTypeId: servicio.id_pedidoServicio, // o puedes usar Date.now() si prefieres
            serviceType: servicio.servicio,
            rowNumber: index + 1,
            serviceID: String(servicio.id_servicio),
            rowIndex: index, // o usar un contador si prefieres
            id_servicio_datos: String(servicio.id_servicio_datos),
            lugar_origen: servicio.lugar_origen || '',
            lugar_destino: servicio.lugar_destino || '',
            tarifa: servicio.tarifa || '',
            entrega_vacio: servicio.entrega_vacio || false, // si viene de backend, pon el valor real
            fecha_limite: servicio.fecha_limite || '',     // si viene, inclúyelo aquí también
          };
        });

        setRows(newRows);
      }else{        
        console.log('Entré al segundo IF')
        // Función que se encarga de de convertir serviceTypes en el formato que le conviene a la tabla, es decir dividir el quantity con el tipo de servicio y generar una fila por cada una
        const newRows: RouteRow[] = serviceTypes.flatMap((st) => {
          console.log('Entré en NewRow: ');
          return Array.from({ length: st.quantity }).map((_, i) => {
            const rowNumber = i + 1;
            const composedKey = `${st.id}-${rowNumber}`;
            
            // Solo usar datos previos si el serviceType es el mismo (no recién creado)
            const prevRow = rows.find(r => r.serviceTypeId === st.id && r.rowNumber === rowNumber);
            console.log('PrevRows', prevRow);
            
            return {
              serviceTypeId: st.id,
              serviceType: st.selectedValue,
              rowNumber,
              serviceID: st.serviceID,
              rowIndex: globalRowIndex++,
              id_servicio_datos: routeIDsByRow[composedKey] || prevRow?.id_servicio_datos || '',
              lugar_origen: routesInformation[composedKey]?.lugar_origen || prevRow?.lugar_origen || '',
              lugar_destino: routesInformation[composedKey]?.lugar_destino || prevRow?.lugar_destino || '',
              tarifa: routesInformation[composedKey]?.tarifa || prevRow?.tarifa || '',
              entrega_vacio: prevRow?.entrega_vacio || false,
              fecha_limite: prevRow?.fecha_limite || '',
            };
          });
        });
        setRows(newRows);
      }
    }, [routeIDsByRow, serviceTypes, requestData]);

    useEffect(()=>{
      console.log('rows al llegar: ', rows);
    },[rows])    
    console.log('requestData al llegar', requestData)

useEffect(() => {
  const uniqueServiceIDs = Array.from(
    new Set(rows.map(row => row.serviceID).filter(id => id !== undefined && id !== null))
  );

  uniqueServiceIDs.forEach(serviceID => {
    getRoutesForSelect(serviceID);
  });
}, []);

const getRoutesForSelect = async (serviceID?: number | string) => {
  if (!serviceID) return;
  try {
    setIsLoading(true);
    const response = await SelectData({ type: 'routes', serviceID });
    const transformedData = TransformSelectData({ type: 'routes', data: response });

    setSelectDataMap(prev => ({
      ...prev,
      [serviceID]: transformedData ?? [],
    }));
  } catch (error) {
    console.error('Error en: getRoutesForSelect', error);
  } finally {
    setIsLoading(false);
  }
};


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
   rows.forEach((row, index) => {
    setValue(`servicios.${index}.id_servicio_datos`, row.id_servicio_datos);
    setValue(`servicios.${index}.tarifa`, row.tarifa);
    setValue(`servicios.${index}.entrega_vacio`, row.entrega_vacio);
    setValue(`servicios.${index}.fecha_limite`, row.fecha_limite);
  });
}, [rows, setValue]);

  const handleEntregaVacioChange = (rowIndex: number, value: boolean) => {      
    const updatedRows = [...rows];
    updatedRows[rowIndex].entrega_vacio = value;
    setRows(updatedRows); // Actualiza el estado de filas
  };
  return (
    <table className="w-full border border-gray-300 text-sm text-left text-black">
      <thead className="bg-gray-100 border border-gray-300">
        <tr >
          {titles.map((title, index) => (
            <th key={index} className="border border-gray-300 px-4 py-2 font-semibold text-center ">
              {title}
            </th>
          ))} 
          {rows.some(row => row.entrega_vacio) && (
            <th className="border border-gray-300 px-4 py-2 text-center font-semibold">
              Fecha Límite
            </th>
          )}         
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
                render={({ field }) => {
                  
                  // 👇 Aquí va la lógica de options y selectedOption
                  const options = selectDataMap[row.serviceID] || [];
                  const selectedOption =
                    options.find(opt => Number(opt.value) === Number(field.value)) ??
                    row.selectedOption ??
                    (row.lugar_origen && row.lugar_destino && row.id_servicio_datos
                      ? {
                          value: row.id_servicio_datos,
                          label: `${row.lugar_origen} - ${row.lugar_destino}`,
                        }
                      : null);

                  return (
                    <Select
                      {...field}
                      placeholder="Seleccione una ruta"
                      options={options}
                      value={selectedOption}
                      isLoading={isLoading}
                      isDisabled={isEditMode}
                      onChange={(selectedOption) => {
                        field.onChange(selectedOption?.value);

                        const updatedRows = [...rows];
                        updatedRows[rowIndex] = {
                          ...updatedRows[rowIndex],
                          id_servicio_datos: selectedOption?.value || '',
                          selectedOption,
                        };
                        setRows(updatedRows);

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
                  );
                }}
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
                  defaultValue={row.tarifa || ''} // 👈 importante para render inicial
                  render={({ field }) => (
                    <input
                      type="number"
                      value={field.value} // usa field.value (no row.tarifa)
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value);

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
                  )}
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
                <td className="border border-gray-400 px-2 py-2 text-center">
                  
                  <Controller
                      name={`${fieldName}.fecha_limite`}
                      control={control}
                      render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DemoContainer components={["DatePicker"]} sx={{width:'100%'}}>
                                  <DatePicker
                                      label="Selecciona una fecha"
                                      format="DD/MM/YY"
                                      value={field.value ? dayjs(field.value, 'YYYY/MM/DD') : null} // Convierte el string a dayjs
                                      onChange={(date) => {
                                          const formattedDate = dayjs(date).format('YYYY-MM-DD'); // Formatea a DD/MM/YY
                                          field.onChange(formattedDate); // Guarda el string (ej: "25/06/24")
                                      }}
                                      className="bg-white w-full"
                                      // slotProps={{
                                      //     textField: {
                                      //     error: !!errors.fecha_salida,
                                      //     helperText: errors.fecha_salida?.message,
                                      //     },
                                      // }}
                                  />
                              </DemoContainer>
                          </LocalizationProvider>
                      )}  
                  />                  
                </td>
              )}

              {isEditMode ? (
                <td className='text-center px-4'>
                  <Icon
                    icon="line-md:trash"                    
                    width="22"
                    height="22"
                    className="text-red-600 cursor-pointer hover:text-red-400"
                    onClick={
                      rows.length>1 ? (
                        ()=>deleteService({serviceID: row.serviceTypeId})
                      ) : (
                        ()=>WarningAlert({title: 'Oops', text: 'No podrás eliminar este servicio ya que no puede existir una petición sin servicios. Debes eliminar la petición completa desde la tabla principal.'})
                      )                     
                    }
                  />
                </td>
              ):null}


          </tr>
          )
        })}
      </tbody>
    </table>
  );
};
