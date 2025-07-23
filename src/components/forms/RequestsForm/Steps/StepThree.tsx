import { useEffect, useState } from "react";
import { Input } from "../../../ui/inputs/input";
import { SmallLabel } from "../../../ui/Labels/smallLabel";
import Select from 'react-select';
import { Controller, useFormContext } from "react-hook-form";
import { SelectData } from "../../../../api/Requests/requests.route";
import { StepsRequestsProps } from "../../../types/forms/RequestsForm/requestsForm";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ServicesSelectionTable } from "../../../ui/Tables/RequestsForm/servicesSelection";
import { DynamicRequestsType } from "../../../../functions/DynamicSections/Requests/DynamicRequestsType";
import { SelectOptionTypes } from "../../../types/Select/select";
import { TransformSelectData } from "../../../../functions/transformSelectData/TransformSelectData";
import { ServiceType } from "../../../../context/Requests/DynamicRequestsOptions";
import { SelectionTeamTable } from "../../../ui/Tables/RequestsForm/selectionTeamTable";
import { PrevisualizationTab } from "../../../ui/tabs/Tabs";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from 'dayjs';
import { NeonWarning } from "../../../ui/Warning/NeonWarning";
import { InvoiceTable } from "../../../ui/Tables/AmountTable/InvoiceTable";
import { useLocation } from "react-router-dom";
import { RequestsFormValues } from "../../../types/forms/RequestsForm/requestsForm";

export const Step3: React.FC<StepsRequestsProps> = ({useProvider, rows, setRows, serviceTypes, setServiceTypes, isInitialLoad, setIsInitialLoad, requestData, requestFormData}) => {                    
    const [servicesSelect, setServicesSelect] = useState<SelectOptionTypes[]>([]);//Estados que maneja los datos que tiene el select de servicios
    const [routesInformation, setRoutesInformation] = useState<Record<string, any>>({});
    const [routeIDsByRow, setRouteIDsByRow] = useState<Record<string, string>>({}); 
    const { control, setValue, register } = useFormContext<RequestsFormValues>();

    const location = useLocation();
    const isEditMode = location.pathname.includes('edit')    
    
    //Función que hace que si requestData viene con valores pase estos datos al serviceTypes para que se forme la tabla
    useEffect(() => {
    if (requestFormData?.servicios?.length) {
        const grouped: Record<string, { serviceID: string; selectedValue: string; quantity: number }> = {};

        requestFormData.servicios.forEach((servicio) => {
        const key = servicio.servicio;
        if (!grouped[key]) {
            grouped[key] = {
            serviceID: String(servicio.id_servicio),
            selectedValue: servicio.servicio,
            quantity: 1
            };
        } else {
            grouped[key].quantity += 1;
        }
        });

        const transformedServiceTypes = Object.values(grouped).map((entry) => ({
        id: Date.now() + Math.floor(Math.random() * 10000), // único
        selectedValue: entry.selectedValue,
        quantity: entry.quantity,
        serviceID: entry.serviceID
        }));

        setServiceTypes(transformedServiceTypes);
    }
    }, []);

    
    // Coloca el useEffect aquí
    useEffect(() => {        
      // Limpiar datos de rutas cuando serviceTypes cambie
      const activeIds = new Set(serviceTypes.map(st => st.id));
      
      setRoutesInformation(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          const id = parseInt(key.split('-')[0]);
          if (!activeIds.has(id)) delete updated[key];
        });
        return updated;
      });

      setRouteIDsByRow(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          const id = parseInt(key.split('-')[0]);
          if (!activeIds.has(id)) delete updated[key];
        });
        return updated;
      });
    }, [serviceTypes]);

    const newServiceType = () => {
    const newId = Date.now(); // Usar timestamp para mayor unicidad
    setServiceTypes(prev => [...prev, { 
        id: newId, 
        selectedValue: '', 
        quantity: 0, 
        serviceID: '' 
    }]);
    }    

    const updateServiceType = (
        id: number,
        field: keyof ServiceType,
        name: string| number,
        value: string | number
    ) => {            
    setServiceTypes(prev =>
        prev.map(st => {
        if (st.id !== id) return st;

        const updated: Partial<ServiceType> = { [field]: name };
        
        if (field === 'selectedValue') {
            updated.serviceID = String(value);
        }

        return { ...st, ...updated };
        })
    );
    };    

    let totalRows;
    if (isEditMode){
        //Al momento de editar totalRows dependerá de requestFormData
        totalRows = Array.isArray(requestFormData.servicios) ? requestFormData.servicios.length : 0;        
    }else{
        //Al momento de crear la petición totalRows debe depender de serviceTypes
        totalRows = serviceTypes.reduce((acc, st) => acc + st.quantity, 0);
    }
    // const totalRows = serviceTypes.reduce((acc, st) => acc + st.quantity, 0);            
    const deleteServiceType = (id: number) => {
    // 1. Eliminar de serviceTypes
    setServiceTypes(prev => prev.filter(st => st.id !== id));

    // 2. Eliminar de routesInformation (usando el mismo ID)
    setRoutesInformation(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
        if (key.startsWith(`${id}-`)) delete updated[key];
        });
        return updated;
    });

    // 3. Eliminar de routeIDsByRow (usando el mismo ID)
    setRouteIDsByRow(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
        if (key.startsWith(`${id}-`)) delete updated[key];
        });
        return updated;
    });

    // 4. Eliminar de rows
    setRows(prev => prev.filter(row => row.serviceTypeId !== id));
    };        
    return (
        <section className="w-full ">                        
            <h1 className="text-black mt-10 ml-6 text-lg font-semibold">
                Complete el siguiente formulario para crear una nueva petición
            </h1>

            
                <div className="flex flex-col items-center justify-center gap-5 w-full">    
                    {!isEditMode && (
                        <div className="grid grid-cols-[0.4fr_0.2fr_0.1fr] mt-6 gap-4 w-[80%] items-center justify-center">                    
                            <h1 className="text-black">Tipo de Servicio</h1>                                        
                            <h1 className="text-black">Cantidad</h1>                    
                        </div>
                    )}            

                    {serviceTypes.map((serviceType) => (                    
                        <DynamicRequestsType 
                            useProvider={useProvider}
                            key={serviceType.id}
                            id={serviceType.id}
                            selectedValue={serviceType.selectedValue}
                            quantity={serviceType.quantity}
                            onUpdate={updateServiceType}
                            setServicesSelect = {setServicesSelect}
                            servicesSelect = {servicesSelect}
                            onDelete={deleteServiceType}     
                            requestFormData={requestFormData}
                            isEditMode={isEditMode}
                            serviceTypes={serviceTypes}
                        />
                    ))}

                    {useProvider ? (
                        <></>
                    ): !isEditMode && (
                        <Icon 
                            icon="gg:add" 
                            width="24" height="24"  
                            className="text-gray-500 cursor-pointer hover:text-black"
                            onClick={newServiceType}
                        />
                    )}
                </div>            

            {totalRows > 0 && (
                <div className={`flex flex-col ${isEditMode ? 'mt-20':''}`}>
                    {!isEditMode && 
                        <h1 className="text-black mt-10">Favor seleccione las rutas que le desea asignar a cada servicio</h1>
                    }                                                         
                    <ServicesSelectionTable                    
                        titles={['Tipo de Servicio', 'Rutas', 'Lugar de Origen', 'Lugar de Destino', 'Tarifa', 'Vacío']}                    
                        serviceTypes={serviceTypes}
                        servicesSelect = {servicesSelect}   
                        routeIDsByRow={routeIDsByRow}
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
                        requestData={requestData}   
                        isEditMode = {isEditMode}  
                        requestFormData={requestFormData}                
                    />
                </div>            
            )}
        </section>    
    )
}