import { formattedServiceDescriptions } from "../../../../functions/cleanData/ServiceTypeDescription/ServiceTypeDescriptionData"
import Select from 'react-select';
import { SelectData } from "../../../../api/Requests/requests.route";
import { TransformSelectData } from "../../../../functions/transformSelectData/TransformSelectData";
import { useEffect, useState } from "react";
import { SelectOptionTypes } from "../../../types/Select/select";
import { Controller, Control } from "react-hook-form";
import { RequestsFormValues } from "../../../types/forms/RequestsForm/requestsForm";
import { RouteRow } from "../../../../context/Requests/DynamicRequestsOptions";
import { UseFormSetValue } from "react-hook-form";
import { useParams } from "react-router-dom";
import isEqual from "lodash.isequal";
import { Dispatch } from "react";
import { SetStateAction } from "react";
import { Servicio } from "../../../types/forms/RequestsForm/requestsForm";
interface SelectionTeamTableProps {
    title: string[];
    control: Control<RequestsFormValues>;
    useProvider: boolean| null | undefined;    
    rows: RouteRow[] | null | undefined;    
    requestFormData: RequestsFormValues | undefined;
    setValue: UseFormSetValue<RequestsFormValues>;
    activeStep:number|undefined;
    setRequestFormData?: Dispatch<SetStateAction<RequestsFormValues>>;
    userRole: "CON" | "ADM" | "SUP" | "CEO";
}
export const SelectionTeamTable = ({title, control,  useProvider, rows, requestFormData, setValue, setRequestFormData, activeStep, userRole}: SelectionTeamTableProps) => {      
  const [_fecha, setFecha] = useState(requestFormData?.fecha_salida??'');
  const [_hora, setHora] = useState(requestFormData?.hora_salida??'');        
  
    // Sincronización cuando requestFormData cambie
  useEffect(() => {
    if (requestFormData) {
      setFecha(requestFormData.fecha_salida ?? "");
      setHora(requestFormData.hora_salida ?? "");
    }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
  }, [requestFormData]);
    ///////
    const [driversData, setDriversData] = useState<SelectOptionTypes[]>([]);
    const [chasisData, setChasisData] = useState<SelectOptionTypes[]>([]);
    const [cabezalData, setCabezalData] = useState<SelectOptionTypes[]>([]);
    const [furgonData, setFurgonData] = useState<SelectOptionTypes[]>([]);
    ///////    
    // Estado para controlar campos deshabilitados POR FILA
    const [disabledFieldsPerRow, setDisabledFieldsPerRow] = useState<
        Record<number, { chasisDisabled: boolean; furgonDisabled: boolean }>
    >({});    

    const {requestID} = useParams<{requestID: string}>();    
    const [isLoading, setIsLoading] = useState<boolean>(false)
    // serviceDescription guardará el formato tipoServicio(LugarOrigen - LugarLLegada) para la primera columna de la tabla

        // Función para actualizar el estado de una fila específica
    const updateDisabledFields = (rowIndex: number, fieldType: 'chasis' | 'furgon', hasValue: boolean) => {
        setDisabledFieldsPerRow(prev => ({
            ...prev,
            [rowIndex]: {
                chasisDisabled: fieldType === 'furgon' && hasValue,
                furgonDisabled: fieldType === 'chasis' && hasValue
            }
        }));
    };
    const serviceDescription = formattedServiceDescriptions(rows??[])

    //Esto se activará al entrar al componente para cargar los datos del select, ya que normalmente se cargan al presionar el select
useEffect(() => {
  if (!requestFormData || !requestFormData.fecha_salida || !requestFormData.hora_salida) return;
  
  
  const loadAllOptions = async () => {
    const { fecha_salida: fecha, hora_salida: hora } = requestFormData;    

    try {
      await Promise.all([        
        getRoutesForSelect('drivers', requestID, fecha, hora),
        getRoutesForSelect('chasis', requestID, fecha, hora),
        getRoutesForSelect('cabezal', requestID, fecha, hora),
        getRoutesForSelect('furgon', requestID, fecha, hora),
      ]);

      // Solo si hay servicios y estamos en modo edición
      if (requestFormData.servicios?.length) {
        requestFormData.servicios.forEach((servicio, index) => {      
          setValue(`servicios.${index}.id_pedidoServicio`, servicio.id_pedidoServicio || '');
        });
      }
    } catch (error) {
      console.error('Error cargando opciones:', error);
    }
  };

  loadAllOptions();
}, [requestFormData?.fecha_salida, requestFormData?.hora_salida, requestID, setValue]);

    const getRoutesForSelect = async(type:"service" | "routes" | "customers" | "providers" | "drivers" | "chasis" | 'cabezal' | 'furgon', IdPeticion?:string|undefined, fecha?:string|undefined, hora?:string|undefined) => {                                
  
        if (!fecha || !hora) {
          console.error('Fecha u hora no definidas:', {fecha, hora});
          return;
        }
        try{          
            setIsLoading(true);
            const response = await SelectData({type, fecha_salida:fecha, hora_salida: hora, requestID: requestID});

            const transformedData = TransformSelectData({type:type, data:response, IdPeticion: IdPeticion});
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


        useEffect(() => {
          if(activeStep ===3){            
            if (!requestFormData) return;
      
            // Filtra el array de servicios para eliminar las tarifas con undefined en 'venta'
            const cleanedServices:Servicio[] = (requestFormData?.servicios||[]).map((service) => {
              const cleanedTarifa =
                (Array.isArray((service as any)?.tarifa)
                  ? (Array.isArray((service as any).tarifa[0]) ? (service as any).tarifa[0] : (service as any).tarifa)
                  : []
                ).filter((item: any) => item?.venta != null);              
      
              return {
                ...service,
                tarifa: cleanedTarifa, // Actualiza la tarifa eliminando los elementos con undefined en venta
              };
            });            
      
            // Actualiza el estado de requestFormData solo si se hicieron cambios
            if (!isEqual(cleanedServices, requestFormData?.servicios??[])) {              
              setRequestFormData?.((prevData) => ({
                ...prevData,
                servicios: cleanedServices,
              }));
            }                  
          }else{
            return;
          }          
    
        }, [activeStep]);  // Este useEffect se ejecuta cuando requestFormData cambia


    return (
      <div className="flex flex-col gap-10">
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
              const rowDisabledFields = disabledFieldsPerRow[rowIndex] || { 
                  chasisDisabled: false, 
                  furgonDisabled: false 
            };          

              return (
                
                <tr key={rowIndex}>
                  <th>{service}</th>

                  <th>
                    <Controller
                      name={`${fieldName}.id_conductor`}
                      control={control}
                      // rules={{required:true}}
                      render={({ field, fieldState: { error } }) => (
                        <Select
                          {...field}
                          isClearable
                          onMenuOpen={() => getRoutesForSelect('drivers','requestID',requestFormData?.fecha_salida, requestFormData?.hora_salida||'09:00:00')}
                          isDisabled={!!useProvider || userRole==='CON'}                          
                          options={driversData}
                          isLoading={isLoading}                          
                          onChange={(selectedOption) => field.onChange(selectedOption ? selectedOption.value : null)}                        
                          // value={driversData.find(o => o.value === field.value) || null}
                          value={driversData.find(option => option.value === field.value) || { label: field.value, value: field.value }}
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              borderColor: error ? '#d32f2f' : state.isFocused ? '#2684FF' : base.borderColor,
                              '&:hover': {
                                borderColor: error ? '#d32f2f' : state.isFocused ? '#2684FF' : base.borderColor,
                              },
                              boxShadow: state.isFocused 
                                ? `0 0 0 1px ${error ? '#d32f2f' : '#2684FF'}` 
                                : 'none',
                            }),
                            placeholder: (base) => ({
                              ...base,
                              color: error ? '#d32f2f' : '#6b7280',
                            }),
                            singleValue: (provided) => {                            
                              const selected = driversData.find(option => option.value === field.value) || { label: field.value, value: field.value }                                               
                              const color = 'success' in selected && selected.success === 1 ? 'red' : 'black'; // Cambia los colores según tu necesidad                              
                              return {
                                ...provided,
                                color: color,
                                fontWeight: 500
                              };
                            },
                            option: (provided, state) => {
                              const data = state.data as any;
                              const color = data?.success === 1 ? 'red' : 'black';
                              return {
                                ...provided,
                                color: state.isSelected ? 'white' : color,
                                backgroundColor: state.isSelected ? '#2684FF' : 'white',
                                ':active': {
                                  backgroundColor: state.isSelected ? '#2684FF' : '#f0f0f0'
                                }
                              };
                            }
                          }}
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
                          onMenuOpen={() => getRoutesForSelect('chasis',requestID,requestFormData?.fecha_salida, requestFormData?.hora_salida||'09:00:00')}
                          isClearable
                          options={chasisData}
                          isDisabled={useProvider || rowDisabledFields.chasisDisabled || userRole==='CON'}
                          isLoading={isLoading}
                          onChange={(selectedOption) => {
                              field.onChange(selectedOption?.value ?? null);                              
                              updateDisabledFields(
                                  rowIndex, 
                                  'chasis', 
                                  !!selectedOption
                              );
                          }}                        
                          value={chasisData.find(option => option.value === field.value) || { label: field.value, value: field.value }}
                          
                          styles={{   
                            singleValue: (provided) => {
                              const selected = chasisData.find(option => option.value === field.value) || { label: field.value, value: field.value }                                               
                              const color = 'success' in selected && selected.success === 1 ? 'red' : 'black';
                              return {
                                ...provided,
                                color: color,
                                fontWeight: 500
                              };
                            },
                            option: (provided, state) => {
                              const data = state.data as any;
                              const color = data?.success === 1 ? 'red' : 'black';
                              return {
                                ...provided,
                                color: state.isSelected ? 'white' : color,
                                backgroundColor: state.isSelected ? '#2684FF' : 'white',
                                ':active': {
                                  backgroundColor: state.isSelected ? '#2684FF' : '#f0f0f0'
                                }
                              };
                            }
                          }}
                        />
                      )}
                    />
                  </th>

                  <th>
                    <Controller
                      name={`${fieldName}.id_cabezal`}
                      // rules={{required:true}}
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <Select
                          {...field}
                          isClearable
                          onMenuOpen={() => getRoutesForSelect('cabezal',requestID,requestFormData?.fecha_salida, requestFormData?.hora_salida||'09:00:00')}
                          options={cabezalData}
                          isDisabled={!!useProvider||userRole==='CON'}
                          isLoading={isLoading}
                          onChange={(selectedOption) => field.onChange(selectedOption ? selectedOption.value : null)}                        
                          value={cabezalData.find(option => option.value === field.value) || { label: field.value, value: field.value }}
                          styles={{
                            singleValue: (provided) => {
                              const selected = cabezalData.find(option => option.value === field.value) || { label: field.value, value: field.value }                
                              const color = 'success' in selected && selected.success === 1 ? 'red' : 'black';

                              return {
                                ...provided,
                                color: color,
                                fontWeight: 500
                              };
                            },
                            option: (provided, state) => {
                              const data = state.data as any;
                              const color = data?.success === 1 ? 'red' : 'black';
                              return {
                                ...provided,
                                color: state.isSelected ? 'white' : color,
                                backgroundColor: state.isSelected ? '#2684FF' : 'white',
                                ':active': {
                                  backgroundColor: state.isSelected ? '#2684FF' : '#f0f0f0'
                                }
                              };
                            },
                            control: (base, state) => ({
                              ...base,
                              borderColor: error ? '#d32f2f' : state.isFocused ? '#2684FF' : base.borderColor,
                              '&:hover': {
                                borderColor: error ? '#d32f2f' : state.isFocused ? '#2684FF' : base.borderColor,
                              },
                              boxShadow: state.isFocused 
                                ? `0 0 0 1px ${error ? '#d32f2f' : '#2684FF'}` 
                                : 'none',
                            }),
                          }}
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
                          onMenuOpen={() => getRoutesForSelect('furgon',requestID,requestFormData?.fecha_salida, requestFormData?.hora_salida||'09:00:00')}
                          isClearable
                          options={furgonData}
                          isLoading={isLoading}
                          isDisabled={useProvider || rowDisabledFields.furgonDisabled || userRole==='CON'}
                          onChange={(selectedOption) => {
                              field.onChange(selectedOption?.value ?? null);
                              updateDisabledFields(
                                  rowIndex, 
                                  'furgon', 
                                  !!selectedOption
                              );
                          }}                        
                          value={furgonData.find(option => option.value === field.value) || { label: field.value, value: field.value }}
                          styles={{
                            singleValue: (provided) => {
                              const selected = furgonData.find(option => option.value === field.value) || { label: field.value, value: field.value }        
                              const color = 'success' in selected && selected.success === 1 ? 'red' : 'black';
                              return {
                                ...provided,
                                color: color,
                                fontWeight: 500
                              };
                            },
                            option: (provided, state) => {
                              const data = state.data as any;
                              const color = data?.success === 1 ? 'red' : 'black';
                              return {
                                ...provided,
                                color: state.isSelected ? 'white' : color,
                                backgroundColor: state.isSelected ? '#2684FF' : 'white',
                                ':active': {
                                  backgroundColor: state.isSelected ? '#2684FF' : '#f0f0f0'
                                }
                              };
                            }
                          }}
                        />
                      )}
                    />
                  </th>
                </tr>
              );
            })}
          </tbody>
        </table>
                
          {/* <NeonWarning message={'Ten en cuenta que parte del equipo seleccionado ya tiene una petición para la fecha y hora seleccionada'}/>         */}
      </div>
    )
}