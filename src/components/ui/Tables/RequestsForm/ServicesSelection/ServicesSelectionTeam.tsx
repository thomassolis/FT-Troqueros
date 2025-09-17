import { SelectData } from '../../../../../api/Requests/requests.route';
import isEqual from "lodash/isEqual";
import { useState, useEffect, useContext, useRef } from 'react';
import { TransformSelectData } from '../../../../../functions/transformSelectData/TransformSelectData';
import { SelectOptionTypes } from '../../../../types/Select/select';
import { ServiceType } from '../../../../../context/Requests/DynamicRequestsOptions';
import { dynamicRequestsContext } from '../../../../../context/Requests/DynamicRequestsOptions';
import {UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { RequestsFormValues } from '../../../../types/forms/RequestsForm/requestsForm';
import { Control } from 'react-hook-form';
import { RouteRow } from '../../../../../context/Requests/DynamicRequestsOptions';
import { DoubleConfirmationAlert } from '../../../Alerts/DoubleConfirmation/doubleConfirmation';
import { Dispatch } from 'react';
import { SetStateAction } from 'react';
import { UseFormReset } from 'react-hook-form';
import { ServicesSelectionTableOption1 } from './options/servicesSelection';
import { ServicesSelectionTableOption2 } from './options/ServicesSelectionTableOption2';
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

export const ServicesSelectionTeam: React.FC<ServicesSelectionTableProps> = ({   
  setIsInitialLoad,
  isInitialLoad,
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
  reset,
  servicesSelect
}) => {      
  const [isLoading, setIsLoading] = useState(false);
  const { routeIDsByRow, setRouteIDsByRow } = useContext(dynamicRequestsContext)!;    
  const [selectDataMap, setSelectDataMap] = useState<Record<string, SelectOptionTypes[]>>({});  
  const [selectedOption, setSelectedOption] = useState<'option1' | 'option2'>('option1');  

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

  
  // Generamos las filas basadas en todos los serviceTypes  
  // Estado para controlar si es la primera carga
    let globalRowIndex = 0;
  
const editHydratedRef = useRef(false); 
useEffect(() => {
  if (!isEditMode) return;                               // Solo en editar
  if (editHydratedRef.current) return;                   // Ya se hidrató
  if (!requestFormData?.servicios?.length) return;       // Aún no hay data

  const newRows: RouteRow[] = requestFormData.servicios.map((servicio, index) => ({
    serviceTypeId: servicio.id_pedidoServicio,
    serviceType: servicio.servicio,
    rowNumber: index + 1,
    serviceID: String(servicio.id_servicio ?? ""),
    rowIndex: index,
    id_servicio_datos: String(servicio.id_servicio_datos ?? ""),
    lugar_origen: servicio.lugar_origen ?? "",
    lugar_destino: servicio.lugar_destino ?? "",
    descripcion: "",
    tarifa: Array.isArray(servicio.tarifa)
      ? servicio.tarifa
      : [{ descripcion: "", costo: 0, venta: 0, profit: 0 }],
    entrega_vacio: !!servicio.entrega_vacio,
    fecha_limite: servicio.fecha_limite ?? "",
    selectedOption: (servicio as any)?.selectedOption ?? "",
  }));

  // Solo setear si realmente cambió
  if (!isEqual(newRows, rows ?? [])) {
    setRows?.(newRows);
  }

  editHydratedRef.current = true; // ✅ no se vuelve a ejecutar
}, [isEditMode, requestFormData?.servicios]); // 👈 deps mínimas y correctas para EDIT

// 🚩 2) CREATE MODE: reconstruir filas cuando cambian las fuentes de creación
useEffect(() => {
  if (isEditMode) return; // No corras esto en editar

  let globalRowIndex = 0;
  let rowNumberCounter = 1;

  const newRows: RouteRow[] =
    serviceTypes?.flatMap((st) =>
      Array.from({ length: st.quantity || 0 }).map((_, i) => {
        const rowNumber = i + 1;
        const composedKey = `${st.id}-${rowNumber}`;
        const prevRow = rows?.find(
          (r) => r.serviceTypeId === st.id && r.rowNumber === rowNumber
        );

        return {
          serviceTypeId: st.id,
          serviceType: st.selectedValue,
          rowNumber,
          serviceID: st.serviceID ?? "",
          rowIndex: globalRowIndex++,
          id_servicio_datos:
            routeIDsByRow[composedKey] ?? prevRow?.id_servicio_datos ?? "",
          lugar_origen:
            routesInformation[composedKey]?.lugar_origen ??
            prevRow?.lugar_origen ??
            "",
          lugar_destino:
            routesInformation[composedKey]?.lugar_destino ??
            prevRow?.lugar_destino ??
            "",
          tarifa:
            routesInformation[composedKey]?.tarifa ??
            prevRow?.tarifa ??
            [{ descripcion: "", costo: 0, venta: 0, profit: 0 }],
          entrega_vacio: prevRow?.entrega_vacio ?? false,
          fecha_limite: prevRow?.fecha_limite ?? "",
          selectedOption: prevRow?.selectedOption ?? "",
        };
      })
    ) ?? [];

  if (!isEqual(newRows, rows ?? [])) {
    setRows?.(newRows);
  }
}, [isEditMode, serviceTypes, routeIDsByRow, routesInformation]); 

useEffect(() => {
  console.log('Entrando a useEffect#4, depende de rows, isEditMode, setValue')
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
        rowIndex: row.rowIndex
      }))
    };
    
    setRequestFormData?.(updatedData as any);
    
    // En lugar de reset, actualizar cada campo individualmente con setValue
    rows.forEach((row, index) => {
      setValue(`servicios.${index}.id_servicio_datos`, row.id_servicio_datos);
      setValue(`servicios.${index}.tarifa`, row.tarifa as any);
      setValue(`servicios.${index}.entrega_vacio`, row.entrega_vacio);
      setValue(`servicios.${index}.fecha_limite`, row.fecha_limite);
      setValue(`servicios.${index}.servicio`, row.serviceType);
      setValue(`servicios.${index}.lugar_origen`, row.lugar_origen);
      setValue(`servicios.${index}.lugar_destino`, row.lugar_destino);
    });
    
    // Esto triggereará el watch sin sobrescribir valores incorrectos
  }
  console.log('Saliendo de useEffect#4')
}, [rows, isEditMode, setValue]); // Agregar setValue a las dependencias

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
      tarifa: [
        {
          venta:route?.tarifa ?? '',
          descripcion: 'Movimiento',
          costo: Number(route?.costo) || 0,
          profit: 0,

        }
      ],
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
      setValue(`servicios.${rowNumber - 1}.tarifa`, [
        {
          descripcion: flatInfo.tarifa[0].descripcion,
          costo: Number(flatInfo.tarifa[0].costo) || 0,
          venta: Number(flatInfo.tarifa) || 0,
          profit: 0,
        }
      ]);

    }
  } catch (error) {
    console.error('Error en getRoutesInformation', error);
  }
};

  const handleEntregaVacioChange = (rowIndex: number, value: boolean) => {      
    const updatedRows = [...(rows ?? [])];
    updatedRows[rowIndex].entrega_vacio = value;    
    // setRows?.(updatedRows); // Actualiza el estado de filas
  };
  return (
    <div className='flex flex-col'>    
    <h1>TEST</h1>
        <div className='w-full h-9 flex gap-6 justify-center'>
          <div className='flex items-center gap-4'>
              <input
                type="radio"
                id="option1"
                name="serviceOption"
                value="option1"
                checked={selectedOption === 'option1'}
                onChange={() => setSelectedOption('option1')}
              />
              <label htmlFor="option1" className='text-black'>Opción 1</label>
          </div>        

          <div className='flex items-center gap-4'>
              <input
                type="radio"
                id="option2"
                name="serviceOption"
                value="option2"
                checked={selectedOption === 'option2'}
                onChange={() => setSelectedOption('option2')}
              />
              <label htmlFor="option2" className='text-black'>Opción 2</label>
          </div>     
        </div>


            {selectedOption === 'option1' ? (
                <ServicesSelectionTableOption1
                    titles={isEditMode? ['Tipo de Servicio', 'Lugar de Origen', 'Lugar de Destino', 'Tarifa', 'SH','Número De Contenedor', 'Tamaño de Contenedor', 'Retención', 'Comentario']:['Tipo de Servicio', 'Rutas', 'Lugar de Origen', 'Lugar de Destino', 'Tarifa', 'SH','Número De Contenedor', 'Tamaño de Contenedor', 'Retención', 'Comentario']}                    
                    serviceTypes={serviceTypes}
                    servicesSelect = {servicesSelect}                       
                    setRouteIDsByRow = {setRouteIDsByRow}
                    routesInformation={routesInformation}
                    setRoutesInformation = {setRoutesInformation}
                    control={control}
                    register={register}    
                    setValue={setValue}                            
                    rows = {rows}    
                    setRows={setRows} 
                    isInitialLoad={isInitialLoad}
                    setIsInitialLoad={setIsInitialLoad}                               
                    isEditMode = {isEditMode}  
                    requestFormData={requestFormData} 
                    setRequestFormData={setRequestFormData}        
                    reset={reset}    
                    handleEntregaVacioChange= {handleEntregaVacioChange}
                    getRoutesInformation={getRoutesInformation}
                    getRoutesForSelect={getRoutesForSelect}
                    deleteService={deleteService}
                    selectDataMap={selectDataMap}
                    isLoading={isLoading}
                />   
            ):(
            <ServicesSelectionTableOption2
                titles={isEditMode? ['Tipo de Servicio', 'Lugar de Origen', 'Lugar de Destino', 'Tarifa', 'SH','Número De Contenedor', 'Tamaño de Contenedor', 'Retención', 'Comentario']:['Tipo de Servicio', 'Rutas', 'Lugar de Origen', 'Lugar de Destino', 'Tarifa', 'SH','Número De Contenedor', 'Tamaño de Contenedor', 'Retención', 'Comentario']                        
                }                    
                serviceTypes={serviceTypes}
                servicesSelect = {servicesSelect}                   
                setRouteIDsByRow = {setRouteIDsByRow}
                routesInformation={routesInformation}
                setRoutesInformation = {setRoutesInformation}
                control={control}
                register={register}    
                setValue={setValue}                            
                rows = {rows}    
                setRows={setRows} 
                isInitialLoad={isInitialLoad}
                setIsInitialLoad={setIsInitialLoad}                               
                isEditMode = {isEditMode}  
                requestFormData={requestFormData} 
                setRequestFormData={setRequestFormData}        
                reset={reset}  
                handleEntregaVacioChange= {handleEntregaVacioChange}
                getRoutesInformation={getRoutesInformation}
                getRoutesForSelect={getRoutesForSelect}
                deleteService={deleteService}
                selectDataMap={selectDataMap}
                isLoading={isLoading}
            />
            )}
    </div>
  );
};
