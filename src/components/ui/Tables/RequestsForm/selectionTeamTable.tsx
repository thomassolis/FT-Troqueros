import { formattedServiceDescriptions } from "../../../../functions/cleanData/ServiceTypeDescription/ServiceTypeDescriptionData"
import Select from 'react-select';
import { SelectData } from "../../../../api/Requests/requests.route";
import { TransformSelectData } from "../../../../functions/transformSelectData/TransformSelectData";
import { useEffect, useState } from "react";
import { SelectOptionTypes } from "../../../types/Select/select";
import { Controller, Control } from "react-hook-form";
import { RequestsFormValues } from "../../../types/forms/RequestsForm/requestsForm";
import { RouteRow } from "../../../../context/Requests/DynamicRequestsOptions";
import { NeonWarning } from "../../Warning/NeonWarning";

interface SelectionTeamTableProps {
    title: string[];
    control: Control<RequestsFormValues>;
    useProvider: boolean;    
    rows: RouteRow[];    
}
export const SelectionTeamTable = ({title, control,  useProvider, rows, requestFormData, setRows, requestData, setValue, register}: SelectionTeamTableProps) => {      

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
    const serviceDescription = formattedServiceDescriptions(rows)

    //Esto se activará al entrar al componente para cargar los datos del select, ya que normalmente se cargan al presionar el select
  useEffect(() => {
    const loadAllOptions = async () => {
      await Promise.all([
        getRoutesForSelect('drivers'),
        getRoutesForSelect('chasis'),
        getRoutesForSelect('cabezal'),
        getRoutesForSelect('furgon'),
      ]);

    if (!requestFormData?.servicios?.length) return;

    requestFormData.servicios.forEach((servicio, index) => {
      const basePath = `servicios.${index}`;
      setValue(`${basePath}.id_pedidoServicio`, servicio.id_pedidoServicio || '');
    });
    };

    loadAllOptions();
  }, [setValue]);


    const getRoutesForSelect = async(type:"service" | "routes" | "customers" | "providers" | "drivers" | "chasis" | 'cabezal' | 'furgon') => {      
        try{
            setIsLoading(true);
            const response = await SelectData({type, fecha_salida:requestFormData.fecha_salida, hora_salida: requestFormData.hora_salida});

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
                      render={({ field }) => (
                        <Select
                          {...field}
                          isClearable
                          onMenuOpen={() => getRoutesForSelect('drivers')}
                          isDisabled={useProvider}
                          options={driversData}
                          isLoading={isLoading}
                          placeholder={'Select...'}
                          onChange={(selectedOption) => field.onChange(selectedOption ? selectedOption.value : null)}                        
                          // value={driversData.find(o => o.value === field.value) || null}
                          value={driversData.find(option => option.value === field.value) || { label: field.value, value: field.value }}
                          styles={{
                            singleValue: (provided, state) => {                            
                              const selected = driversData.find(option => option.value === field.value) || { label: field.value, value: field.value }                 
                              const data = state.data as any;
                              const color = selected?.success === 1 ? 'red' : 'black'; // Cambia los colores según tu necesidad                              
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
                          onMenuOpen={() => getRoutesForSelect('chasis')}
                          isClearable
                          options={chasisData}
                          isDisabled={useProvider || rowDisabledFields.chasisDisabled}
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
                            singleValue: (provided, state) => {
                              const selected = chasisData.find(option => option.value === field.value) || { label: field.value, value: field.value }                                               
                              const color = selected?.success === 1 ? 'red' : 'black'; // Cambia los colores según tu necesidad
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
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          isClearable
                          onMenuOpen={() => getRoutesForSelect('cabezal')}
                          options={cabezalData}
                          isDisabled={useProvider}
                          isLoading={isLoading}
                          onChange={(selectedOption) => field.onChange(selectedOption ? selectedOption.value : null)}                        
                          value={cabezalData.find(option => option.value === field.value) || { label: field.value, value: field.value }}
                          styles={{
                            singleValue: (provided, state) => {
                              const selected = cabezalData.find(option => option.value === field.value) || { label: field.value, value: field.value }                
                              const color = selected?.success === 1 ? 'red' : 'black'; // Cambia los colores según tu necesidad
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
                      name={`${fieldName}.id_furgon`}
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          onMenuOpen={() => getRoutesForSelect('furgon')}
                          isClearable
                          options={furgonData}
                          isLoading={isLoading}
                          isDisabled={useProvider || rowDisabledFields.furgonDisabled}
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
                            singleValue: (provided, state) => {
                              const selected = furgonData.find(option => option.value === field.value) || { label: field.value, value: field.value }        
                              const color = selected?.success === 1 ? 'red' : 'black'; // Cambia los colores según tu necesidad
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