import Select from 'react-select';
import { SelectOptionTypes } from '../../../../../types/Select/select';
import { ServiceType } from '../../../../../../context/Requests/DynamicRequestsOptions';
import { Controller, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { RequestsFormValues } from '../../../../../types/forms/RequestsForm/requestsForm';
import { Control } from 'react-hook-form';
import dayjs from 'dayjs';
import { RouteRow } from '../../../../../../context/Requests/DynamicRequestsOptions';
import { Dispatch } from 'react';
import { SetStateAction } from 'react';
import { UseFormReset } from 'react-hook-form';
import { ContainerSizeData } from '../../../../../others/Data/ContainerSize';
import { Icon } from '@iconify/react/dist/iconify.js';
import { WarningAlert } from '../../../../Alerts/Warning/Warning';

interface DeleteServiceParams {
  serviceID: string;
}
interface ServicesSelectionTableProps {
  titles: string[];
  serviceTypes: ServiceType[]|undefined;
  servicesSelect: SelectOptionTypes[]
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
    isLoading?: boolean
    // Función para obtener rutas para el select
    getRoutesForSelect: (serviceID?: number | string) => Promise<void>;
     // Función para obtener información de rutas
    getRoutesInformation: (
      serviceID: number,
      groupIndex: number,
      rowNumber: number
    ) => Promise<void>;
    
    // Función para manejar cambios en entrega vacío
    handleEntregaVacioChange: (rowIndex: number, value: boolean) => void;
    
    // Función para eliminar un servicio
    deleteService: (params: DeleteServiceParams) => Promise<void>;
  
    selectDataMap: Record<string, SelectOptionTypes[]>;
}

export const ServicesSelectionTableOption2: React.FC<ServicesSelectionTableProps> = ({     
  control,    
  rows, 
  setRows,  
  setRoutesInformation,  
  isEditMode,    
  register,  
    handleEntregaVacioChange,
  getRoutesInformation,
  getRoutesForSelect,  
  selectDataMap,
  isLoading,
  deleteService
}) => {      
  return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm text-center bg-troquerosGray shadow-md rounded-lg text-black">
          <thead>
          <tr className="bg-orange-300">
            {isEditMode?(
              ['Tipo de Servicio', 'Origen-Destino', 'Tarifa', 'Sh-Vacío', 'Contenedor', 'Comentario'].map((opt)=>(
                <th className="p-3 font-medium border border-gray-600">{opt}</th>
              ))
              
            ):(
              ['Tipo de Servicio', 'Rutas', 'Origen-Destino', 'Tarifa', 'Sh-Vacío', 'Contenedor', 'Comentario'].map((opt)=>(
                <th className="p-3 font-medium border border-gray-600">{opt}</th>
              ))
            )}
            
          </tr>
          </thead>
          <tbody className='bg-white'>
            {rows?.map((row, rowIndex) => {
              const fieldName = `servicios.${rowIndex}` as const;               
              return(
                <>
                  <tr className='border border-black ' style={{border:'solid 12px black !important'}}>
                    <td className="p-3 border border-gray-300 align-middle text-black" rowSpan={2}>{row.serviceType}</td>

                    {!isEditMode &&
                    <td className="p-3 border border-gray-300 align-middle" rowSpan={2}>
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
                    <td className="p-3 border-b border-gray-300 text-black">{row.lugar_origen}</td>
                    <td className="p-3 border border-gray-300 align-middle text-black" rowSpan={2}>
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
                    
                    <td className="p-3 border border-gray-300 text-black">
                      <input 
                        type="text" 
                        className='h-[20%] rounded-md py-2 w-[95%] border-gray-300 border'
                        {...register(`${fieldName}.sh`)}
                      />
                    </td>
                    <td className="p-3 border-b border-gray-300">
                      <input 
                        type="text" 
                        className='h-[20%] rounded-md py-2 w-[95%] border-gray-300 border text-black'
                        {...register(`${fieldName}.numero_contenedor`)}
                      />
                    </td>
                    <td className="p-3 border border-gray-300 text-black" rowSpan={2}>
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
                    
                    {isEditMode && (
                      <td className="p-3 border border-gray-300 text-black bg-troquerosGray" rowSpan={2}>
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
                    )}

                  </tr>
                  <tr >
                    <td className="p-3 border border-gray-300 text-black">{row.lugar_destino}</td>
                    <td className="p-3 border border-gray-300 flex">
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
                    <td className="p-3 border border-gray-300">
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

                    
                  
                  </tr>
                </>
            )})}
          </tbody>
        </table>
      </div>
  );
};
