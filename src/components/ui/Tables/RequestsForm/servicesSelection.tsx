import Select from 'react-select';
import { SelectData } from '../../../../api/Requests/requests.route';
import { useState, useEffect, useContext } from 'react';
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
import { Dispatch } from 'react';
import { SetStateAction } from 'react';
import { UseFormReset } from 'react-hook-form';
import { ContainerSizeData } from '../../../others/Data/ContainerSize';

interface ServicesSelectionTableProps {
  titles: string[];
  serviceTypes: ServiceType[]|undefined;
  servicesSelect: SelectOptionTypes[]
  routeIDsByRow: Record<string, string>;
  setRouteIDsByRow: React.Dispatch<React.SetStateAction<Record<string, string>>>;   
  setRoutesInformation: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  routesInformation: Record<string, any>;
  control: Control<RequestsFormValues>
  register: UseFormRegister<RequestsFormValues>;
  setValue: UseFormSetValue<RequestsFormValues>;
  setRows: React.Dispatch<React.SetStateAction<RouteRow[]>>| undefined;  
  rows: RouteRow[]| null | undefined;
  isEditMode: boolean
  isInitialLoad: boolean| undefined;
  setIsInitialLoad: React.Dispatch<React.SetStateAction<boolean>>| undefined;  
  requestFormData?: RequestsFormValues;
  setRequestFormData?: Dispatch<SetStateAction<RequestsFormValues>>; 
  reset?:UseFormReset<RequestsFormValues>
}

export const ServicesSelectionTable: React.FC<ServicesSelectionTableProps> = ({ 
  titles, 
  serviceTypes ,  
  control,  
  setValue,
  rows, 
  setRows,
  routesInformation,
  setRoutesInformation,  
  isEditMode,
  requestFormData,
  setRequestFormData,
  register,
  reset
}) => {      
  const [isLoading, setIsLoading] = useState(false);
  const { routeIDsByRow, setRouteIDsByRow } = useContext(dynamicRequestsContext)!;    
  const [selectDataMap, setSelectDataMap] = useState<Record<string, SelectOptionTypes[]>>({});  
  
const deleteService = async ({ serviceID }: { serviceID: string }) => {
    const response = await DoubleConfirmationAlert({
      title: '¿Seguro deseas eliminar este servicio?',
      text: 'Se eliminaran todos los datos guardados incluyendo rutas, tarifas, etc',
      id: serviceID,
      type: 'deleteService'      
    });
  if (response.success) {
    // 1. Actualiza requestFormData
    const updatedServicios = requestFormData?.servicios?.filter(
      serv => serv.id_pedidoServicio !== Number(serviceID)
    );
    const newData = { ...requestFormData, servicios: updatedServicios };
    
    // 2. Actualiza el estado local
    setRequestFormData?.(newData);
    
    // 3. Sincroniza el formulario con los nuevos datos
    reset?.(newData); // ✨ Clave: reset de React Hook Form
    
    // 4. Actualiza rows
    setRows?.(prev => prev.filter(row => row.serviceTypeId !== Number(serviceID)));
  }
};

useEffect(()=>{
  console.log('Rows en servicesSelection', rows);
},[rows])
  
  // Generamos las filas basadas en todos los serviceTypes  
  // Estado para controlar si es la primera carga
    let globalRowIndex = 0;

    useEffect(() => {
      
      //Al momento de editar la petición, esta función es la que se encarga de llenar los datos de la petición
      if (isEditMode && requestFormData?.servicios?.length) {       
        console.log('requestFormData?.servicios?.length: ', requestFormData?.servicios?.length);
        console.log('EditMode') 
        const newRows: RouteRow[] = requestFormData.servicios.map((servicio, index) => {     
          console.log('requestFormData.servicios: ', requestFormData.servicios);
          return {
            serviceTypeId: servicio.id_pedidoServicio, // o puedes usar Date.now() si prefieres
            serviceType: servicio.servicio,
            rowNumber: index + 1,
            serviceID: String(servicio.id_servicio),
            rowIndex: index, // o usar un contador si prefieres
            id_servicio_datos: String(servicio.id_servicio_datos),
            lugar_origen: servicio.lugar_origen || '',
            lugar_destino: servicio.lugar_destino || '',
            tarifa: servicio.tarifa || 0,
            entrega_vacio: servicio.entrega_vacio || false, // si viene de backend, pon el valor real
            fecha_limite: servicio.fecha_limite || '',     // si viene, inclúyelo aquí también
            selectedOption: servicio?.selectedOption || '', 
          };
        });

        setRows?.(newRows);
      }else{        
        let rowNumberCounter = 1; 
        // Función que se encarga de de convertir serviceTypes en el formato que le conviene a la tabla, es decir dividir el quantity con el tipo de servicio y generar una fila por cada una
        const newRows: RouteRow[] = serviceTypes?.flatMap((st) => {
          
          return Array.from({ length: st.quantity }).map((_, i) => {
            const rowNumber = i + 1;            
            const composedKey = `${st.id}-${rowNumberCounter}`;
            
            // Solo usar datos previos si el serviceType es el mismo (no recién creado)
            const prevRow = rows?.find(r => r.serviceTypeId === st.id && r.rowNumber === rowNumber);
                        
            return {
              serviceTypeId: st.id,
              serviceType: st.selectedValue,
              rowNumber: rowNumberCounter++,
              serviceID: st.serviceID,
              rowIndex: globalRowIndex++,
              id_servicio_datos: routeIDsByRow[composedKey] || prevRow?.id_servicio_datos || '',
              lugar_origen: routesInformation[composedKey]?.lugar_origen || prevRow?.lugar_origen || '',
              lugar_destino: routesInformation[composedKey]?.lugar_destino || prevRow?.lugar_destino || '',
              tarifa: routesInformation[composedKey]?.tarifa || prevRow?.tarifa || '',
              entrega_vacio: prevRow?.entrega_vacio || false,
              fecha_limite: prevRow?.fecha_limite || '',
              selectedOption: prevRow?.selectedOption || '', 
            };
          });
        })?? [];
        setRows?.(newRows);
        // setRequestFormData(newRows);    
      }
    }, [routeIDsByRow, serviceTypes]);
    //}, [routeIDsByRow, serviceTypes, requestFormData]); 

    useEffect(() => {
      if (!isEditMode && rows) {
        const updatedData = {
          ...requestFormData,
          servicios: rows.map(row => ({
            id_servicio_datos: row.id_servicio_datos,
            tarifa: row.tarifa,
            entrega_vacio: row.entrega_vacio,
            fecha_limite: row.fecha_limite,
            servicio: row.serviceType,
            lugar_origen: row.lugar_origen,
            lugar_destino: row.lugar_destino,
            rowIndex:row.rowIndex // nueva inclusión
          }))
        };
        
        setRequestFormData?.(updatedData);
        reset?.(updatedData); // Esto actualizará RHF y triggereará watch
      }
    }, [rows, isEditMode]);

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
      setValue(`servicios.${rowNumber - 1}.tarifa`, Number(flatInfo.tarifa));
    }
  } catch (error) {
    console.error('Error en getRoutesInformation', error);
  }
};

  const handleEntregaVacioChange = (rowIndex: number, value: boolean) => {      
    const updatedRows = [...(rows ?? [])];
    updatedRows[rowIndex].entrega_vacio = value;
    setRows?.(updatedRows); // Actualiza el estado de filas
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
        </tr>
      </thead>
      <tbody>
        {rows?.map((row, rowIndex) => {
          const fieldName = `servicios.${rowIndex}` as const;               
          return(
          <tr key={`${row.serviceType}-${rowIndex}`}>
            <td className="border border-gray-400 px-4 py-2 text-center">
              {row.serviceType}
            </td>
            {!isEditMode &&
              <td className="border border-gray-400 px-4 py-2 text-center">
                <Controller
                  name={`${fieldName}.id_servicio_datos`}
                  control={control}
                  rules={{required: true}}
                  render={({ field, fieldState }) => {
                    const options = row.serviceID ? selectDataMap[row.serviceID] ?? [] : [];
                    const selectedOption =
                      options.find(opt => Number(opt.value) === Number(field.value)) ?? row.selectedOption ?? (
                        row.lugar_origen && row.lugar_destino && row.id_servicio_datos
                          ? { value: row.id_servicio_datos, label: `${row.lugar_origen} - ${row.lugar_destino}` }
                          : null
                      );

                    return (
                      isEditMode ? (
                        <td>{row.lugar_origen} - {row.lugar_destino}</td>
                      ) : (
                        <div className="flex flex-col">
                          <Select
                            {...field}
                            placeholder="Seleccione una ruta"
                            options={options}
                            value={selectedOption}
                            isLoading={isLoading}    
                            
                            isDisabled={isEditMode}
                            onChange={(selectedOption) => {
                              const value = typeof selectedOption === 'object' && selectedOption !== null
                              ? selectedOption.value
                              : '';
                                                        
                              // Actualiza react-hook-form
                              field.onChange(value);

                              // Actualiza el estado de filas
                              const updatedRows = [...rows];
                              updatedRows[rowIndex] = {
                                ...updatedRows[rowIndex],
                                id_servicio_datos: String(value), // Usa el valor directamente
                                // Elimina selectedOption o mantenlo como string si es necesario
                                selectedOption: String(value) // Guarda solo el valor (ej: '96')
                              };
                              
                              setRows?.(updatedRows);

                              if (value) {
                                getRoutesInformation(Number(value), row.serviceTypeId, row.rowNumber);
                              }
                            }}
                            onMenuOpen={() => getRoutesForSelect(row.serviceID)}
                            styles={{
                              control: (base, state) => ({
                                ...base,
                                borderColor: fieldState.invalid ? '#d32f2f' : base.borderColor,
                                '&:hover': {
                                  borderColor: fieldState.invalid ? '#d32f2f' : base.borderColor,
                                },
                                boxShadow: state.isFocused
                                  ? `0 0 0 1px ${fieldState.invalid ? '#d32f2f' : '#2684FF'}`
                                  : 'none',
                              }),
                            }}
                          />

                          {fieldState.invalid && (
                            <span className="text-red-500 text-xs mt-1">{fieldState.error?.message}</span>
                          )}
                        </div>
                      )
                    );
                  }}
                />
              </td>
            }
            <td className="border border-gray-400 px-1 py-2 text-center w-[6%]">
              {row.lugar_origen}
            </td>
            <td className="border border-gray-400 px-1 py-2 text-center w-[6%]">
              {row.lugar_destino}
            </td>

              <td className="border border-gray-400 px-1 py-2 text-center w-[8%]">
                <Controller
                  name={`${fieldName}.tarifa`}
                  control={control}
                  rules={{
                    required:true                    
                  }}
                  defaultValue={row.tarifa || 0} // 👈 importante para render inicial
                  render={({ field, fieldState:{error} }) => (
                    <input
                      type="number"
                      {...field}
                      value={field.value || 0}
                      // value={row.tarifa} // usa field.value (no row.tarifa)
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        field.onChange(value);

                          // 2. Actualiza rows
                          const updatedRows = [...(rows ?? [])];
                          updatedRows[rowIndex] = {
                            ...updatedRows[rowIndex],
                            tarifa: value,
                          };
                          setRows?.(updatedRows);

                        const composedKey = `${row.serviceTypeId}-${row.rowNumber}`;
                        setRoutesInformation(prev => ({
                          ...prev,
                          [composedKey]: {
                            ...prev[composedKey],
                            tarifa: value
                          }
                        }));
                      }}
                      className={`w-full border rounded py-1 ${error ? "border-red-500" : "border-gray-300"}`}
                      
                    />
                    
                  )}
                  
                />
                
              </td>

              {/* Nuevos Campos */}
              <td className='border border-gray-400 px-1 py-2 text-center w-[10%]'>                
                <input 
                  type="text" 
                  className='h-[20%] rounded-md py-2 w-[95%]'
                  {...register(`${fieldName}.sh`)}
                />
              </td>  
              <td className='border border-gray-400 px-1 py-2 text-center w-[10%]'>                
                <input 
                  type="text" 
                  className='h-[20%] rounded-md py-2 w-[95%]'
                  {...register(`${fieldName}.numero_contenedor`)}
                />
              </td>              

              <td className='border border-gray-400 px-4 py-2 text-center w-[10%]'>
                <Controller
                  name={`${fieldName}.size_contenedor`}
                  control={control}                  
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={ContainerSizeData}
                      placeholder="Seleccionar"
                      value={ContainerSizeData.find(option => option.value === field.value)}
                      onChange={(selectedOption) => {
                        field.onChange(selectedOption?.value); // Solo guarda el valor, no el objeto completo
                      }}
                      onBlur={field.onBlur}
                      styles={{
                        control: (base) => ({
                          ...base,
                          minHeight: '32px',
                          fontSize: '0.875rem'
                        })
                      }}
                    />
                  )}
                />
              </td>

              <td className="border border-gray-400 py-2 text-center w-[5%]">
                <Controller
                  name={`${fieldName}.entrega_vacio`}
                  control={control}
                  render={({ field }) => {
                    const checked = field.value || false;

                    return (
                      <div className='flex items-center justify-center gap-1'>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            const newValue = e.target.checked;
                            field.onChange(newValue);
                            handleEntregaVacioChange(rowIndex, newValue);
                          }}
                        />
                        {/* Este bloque ahora está DENTRO del mismo <td> */}
                        {checked && (
                          <div className='w-[80%]'>
                            {/* <Controller
                              name={`${fieldName}.fecha_limite`}
                              control={control}
                              rules={{required:'fecha_limite'}}
                              render={({ field, fieldState }) => (
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                  <DemoContainer components={["DatePicker"]} sx={{ width: '100%' }}>
                                    <DatePicker
                                      label="Fecha Límite"
                                      format="DD/MM/YY"
                                      value={field.value ? dayjs(field.value, 'YYYY-MM-DD') : null}
                                      minDate={dayjs().startOf('day')}
                                      shouldDisableDate={(date) => date.isBefore(dayjs(), 'day')}
                                      onChange={(date) => {
                                        const formattedDate = dayjs(date).format('YYYY-MM-DD');
                                        field.onChange(formattedDate);
                                      }}
                                      className="bg-white w-full"                                          
                                      slotProps={{
                                        textField: {
                                          error: fieldState.invalid,
                                          fullWidth: true,
                                          InputProps: {
                                            sx: {
                                              // Ajusta el padding del input
                                              '.MuiInputBase-input': {
                                                paddingRight: '1px', // Reduce el padding derecho donde está el ícono
                                              },
                                              '.MuiInputAdornment-root': {
                                                marginLeft: '1px', // Opcional: reduce el espacio del ícono
                                              }
                                            }
                                          }
                                        }
                                      }}

                                    />
                                  </DemoContainer>
                                </LocalizationProvider>
                              )}
                              
                            /> */}
                            <Controller
                              name={`${fieldName}.fecha_limite`}
                              control={control}
                              rules={{ required: 'fecha_limite' }}
                              render={({ field, fieldState }) => (
                            <input
                              type="date"
                              value={field.value || ''}
                              onChange={(e) => {
                                const formattedDate = dayjs(e.target.value).format('YYYY-MM-DD');
                                field.onChange(formattedDate);
                              }}
                              min={dayjs().format('YYYY-MM-DD')}
                              className={`
                                w-full px-4 py-3 rounded-lg border
                                focus:outline-none focus:ring-2 focus:border-transparent
                                transition-all duration-200
                                ${
                                  fieldState.invalid
                                    ? 'border-red-500 focus:ring-red-200 bg-red-50'
                                    : 'border-gray-300 focus:ring-blue-200 hover:border-gray-400'
                                }
                                shadow-sm
                                text-gray-700
                                font-medium
                              `}
                            />
                              )}
                            />

                          </div>
                        )}
                      </div>
                    );
                  }}
                />
              </td>

              <td className='border border-gray-400 px-4 py-2 text-center w-[10%]'>
                <Controller
                  name={`${fieldName}.comentario`}
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm min-h-[80px]"
                      rows={3}
                      placeholder="Escribe un comentario..."
                    />
                  )}
                />
              </td>

              {isEditMode ? (
                <td className='text-center px-4'>
                  <Icon
                    icon="line-md:trash"                    
                    width="22"
                    height="22"
                    className="text-red-600 cursor-pointer hover:text-red-400"
                    onClick={
                      rows.length>1 ? (
                        () => deleteService({ serviceID: String(row.serviceTypeId) })
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
