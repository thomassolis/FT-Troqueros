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

export const Step1: React.FC<StepsRequestsProps> = ({useProvider, setUseProvider, rows, requestData, requestFormData}) => {        
    const [customersSelect, setCustomersSelect] = useState<SelectOptionTypes[]>([]);
    // const { control, setValue, register, errors } = useFormContext<RequestsFormValues>();
    const { control, formState: { errors } } = useFormContext<RequestsFormValues>();

    useEffect(() => {
    const getSelectData = async () => {
        try {
        const response = await SelectData({ type: 'customers' });
        const transformedData = TransformSelectData({type:'customers',data:response});
        setCustomersSelect(transformedData ?? []);        
        } catch (error) {
        console.error('Error en: getSelectData', error);
        }
    };

    getSelectData();
    }, []);


    return (
        <section className="w-full ">                        
            <h1 className="text-black mt-10 ml-6 text-lg font-semibold">Complete el siguiente formulario para crear una nueva petición</h1>
            
            <div className="flex justify-center">
                <div className="flex w-[70%]">
                    <div className="flex flex-col gap-12 items-start w-full  mt-12 ">

                        <div className="flex items-center mb-1">
                        <SmallLabel text="Nombre del Cliente" /><span className="text-red-500 ml-1">*</span>
                        </div>
                        
                        <div className="h-10 flex items-center mb-1">
                            <SmallLabel text="Fecha de Salida"/> <span className="text-red-500 ml-1">*</span>
                        </div>                    

                        <div className="h-10 flex items-center mb-1">
                            <SmallLabel text="Hora de Salida"/> <span className="text-red-500 ml-1">*</span>
                        </div>         
                        
                    </div>

                    <div className="flex flex-col gap-12 items-start w-full  mt-12 ">

                        <div className="flex items-center gap-3 w-full">
                            <Controller
                            name="id_cliente"
                            control={control}
                            rules={{ required: "El cliente es obligatorio" }} // ✅ aquí validas
                            render={({ field }) => (
                                <Select
                                {...field}
                                isClearable                                
                                className="w-full"
                                options={customersSelect}
                                placeholder="Selecciona un cliente..."
                                value={customersSelect.find(opt => opt.value === field.value)}
                                onChange={option => field.onChange(option?.value)}
                                menuPortalTarget={document.body}
                                styles={{
                                    control: (base, state) => ({
                                    ...base,
                                    borderColor: errors?.id_cliente ? '#d32f2f' : base.borderColor,
                                    '&:hover': {
                                        borderColor: errors?.id_cliente ? '#d32f2f' : base.borderColor,
                                    },
                                    boxShadow: state.isFocused ? `0 0 0 1px ${errors?.id_cliente ? '#d32f2f' : '#2684FF'}` : 'none',
                                    }),
                                    placeholder: (base) => ({
                                    ...base,
                                    color: errors?.id_cliente ? '#d32f2f' : '#6b7280',
                                    }),
                                }}
                                />
                            )}
                            />                           
                        </div>                        

                        <div className="flex items-center gap-3 w-full ">

                            <Controller
                                name="fecha_salida"
                                control={control}           
                                rules={{required:'Campo Requerido'}}                     
                                render={({ field }) => (
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={["DatePicker"]} sx={{width:'100%'}}>
                                            <DatePicker
                                                label="Selecciona una fecha"
                                                format="DD/MM/YYYY"
                                                value={field.value ? dayjs(field.value, 'YYYY-MM-DD') : null}
                                                onChange={(date) => {
                                                    const formattedDate = dayjs(date).format('YYYY-MM-DD');
                                                    field.onChange(formattedDate);
                                                }}
                                                slotProps={{
                                                    textField: {
                                                    error: !!errors.fecha_salida,
                                                        sx: {
                                                        backgroundColor: 'white', // ✅ mantiene fondo blanco incluso con error
                                                    },
                                                    fullWidth: true
                                                    }
                                                }}
                                                                                                   
                                            />


                                        </DemoContainer>
                                    </LocalizationProvider>
                                )}  
                            />
                        </div> 

                        <div className="flex items-center gap-3 w-full">

                            <Controller
                            name="hora_salida"
                            control={control}
                            render={({ field }) => (
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={["TimePicker"]} sx={{ width: "100%" }}>
                                    <TimePicker
                                    label="Selecciona una hora"
                                    value={field.value ? dayjs(field.value, "HH:mm") : null} // Convierte el string a dayjs
                                    onChange={(time) => {
                                        const formattedTime = dayjs(time).format("HH:mm:ss"); // Formatea a "HH:mm"
                                        field.onChange(formattedTime); // Guarda el string (ej: "14:30")
                                    }}
                                    className="bg-white w-full"
                                    // slotProps={{
                                    //     textField: {
                                    //     error: !!errors.hora_salida,
                                    //     helperText: errors.hora_salida?.message,
                                    //     },
                                    // }}
                                    />
                                </DemoContainer>
                                </LocalizationProvider>
                            )}
                            />
                        </div>
                   
                    </div>

                    
                </div>  
                
                          
            </div>            


        </section>       

    )
}

export const Step2: React.FC<StepsRequestsProps> = ({setUseProvider, useProvider, rows, requestData, requestFormData}) => {        
    const [providersSelect, setProvidersSelect] = useState<SelectOptionTypes[]>([]);
    const { control, setValue, register, errors } = useFormContext<RequestsFormValues>();    
    useEffect(() => {        
    if (requestFormData.proveedor) {        
        setValue('isProviderRequest', true);
        setUseProvider(true);
    }
    }, [requestFormData.proveedor, setValue]);

    useEffect(()=>{
        if(useProvider===false){
            setValue('id_proveedor', null);
            setValue('precio_proveedor', null);
        }
    },[useProvider])

    useEffect(() => {
        const getSelectData = async () => {
            try {
            const response = await SelectData({ type: 'providers' });
            const transformedData = TransformSelectData({type:'providers', data:response})
            setProvidersSelect(transformedData ?? []);        
            } catch (error) {
            console.error('Error en: getSelectData', error);
            }
        };

        getSelectData();
    }, []);    

    //Constantes para calcular cuando el checkbox de proveedores está activado o no
    const multipleServicios = requestFormData.servicios?.length > 1;
    const hasConductorData = requestFormData.servicios?.some(s => !!s.id_conductor);
    const hasCabezalData = requestFormData.servicios?.some(s => !!s.id_cabezal);
    const hasChasisData = requestFormData.servicios?.some(s => !!s.id_chasis);
    const hasFurgonData = requestFormData.servicios?.some(s => !!s.id_furgon);
    const hasExtras = requestFormData.servicios?.some(
    s => (Array.isArray(s.costos_extras) && s.costos_extras.length > 0) ||
        (Array.isArray(s.nuevos_costos_extras) && s.nuevos_costos_extras.length > 0)
    );

    const isDisabled =
    multipleServicios ||
    hasConductorData ||
    hasCabezalData ||
    hasChasisData ||
    hasFurgonData ||
    hasExtras;

    const getDisableReason = () => {
        if (multipleServicios) return "Solo se permite un servicio para activar esta opción.";
        if (hasConductorData) return "Elimina el conductor asignado.";
        if (hasCabezalData) return "Elimina el cabezal asignado.";
        if (hasChasisData) return "Elimina el chasis asignado.";
        if (hasFurgonData) return "Elimina el furgón asignado.";
        if (hasExtras) return "Elimina los costos extras del servicio.";
    return null;
    };


    return (
        <section className="w-full">                        
            <h1 className="text-black mt-10 ml-6 text-lg font-semibold">
                Complete el siguiente formulario para crear una nueva petición
            </h1>

            <div className="flex justify-center items-center mt-6">
            <label className="flex items-center gap-3 w-[70%] relative cursor-pointer">
                <input
                    type="checkbox"
                    {...register("isProviderRequest")}
                    id="providerCheck"
                    className="accent-blue-500"
                    disabled={isDisabled}
                    onChange={(e) => {
                        setUseProvider(e.target.checked);
                    }}
                />

                {/* Solo intercepta clics cuando está deshabilitado */}
                {isDisabled && (
                <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[18px] h-[18px] cursor-not-allowed z-10"
                    onClick={(e) => {
                    e.preventDefault(); // evita cambio de estado
                    const reason = getDisableReason();
                    if (reason) alert(reason);
                    }}
                />
                )}

                <label className="text-black" htmlFor="providerCheck">
                    Seleccionar si la carga la administrará un proveedor
                </label>
            </label>
            </div>


            {useProvider ? (
                <div className="flex flex-col items-center mt-6">
                <div className="flex flex-col gap-6 w-[70%]">

                    {/* Nombre del proveedor */}
                    <div className="flex w-full items-center gap-8">
                        <label className="text-black text-sm mb-1">Nombre del Proveedor:</label>
                        <Controller
                        name="id_proveedor"
                        control={control}
                        rules={{ required: "Campo obligatorio" }}
                        render={({ field }) => (
                            <>
                            <Select 
                                {...field}
                                isClearable
                                className="w-[60%] text-black" 
                                options={providersSelect}
                                value={providersSelect.find(opt => opt.value === field.value)} // Para mostrar el label correcto
                                onChange={opt => field.onChange(opt?.value)} // Guarda solo el ID
                                styles={{
                                control: (base, state) => ({
                                    ...base,
                                    borderColor: errors?.id_proveedor ? '#d32f2f' : base.borderColor,
                                    '&:hover': {
                                    borderColor: errors?.id_proveedor ? '#d32f2f' : base.borderColor,
                                    },
                                    boxShadow: state.isFocused
                                    ? `0 0 0 1px ${errors?.id_proveedor ? '#d32f2f' : '#2684FF'}`
                                    : 'none',
                                }),
                                placeholder: base => ({
                                    ...base,
                                    color: errors?.id_proveedor ? '#d32f2f' : '#6b7280',
                                }),
                                }}
                            />
                            {errors?.id_proveedor?.message && (
                                <p className="text-red-500 text-sm mt-1">{errors.id_proveedor.message}</p>
                            )}
                            </>
                        )}
                        />

                    </div>   

                    <div className="flex w-full items-center gap-12">
                        <label className="text-black text-sm mb-1">Costo del proveedor:</label>
                        <Input 
                            type="number"
                            className2="w-[20%] h-8"
                            placeholder="Costo $"                        
                            {...register('precio_proveedor', {valueAsNumber:true, required:'Campo requerido'})}
                            onChange={(e) => setValue('precio_proveedor', parseFloat(e.target.value))}
                        />
                    </div>             

                </div>
                </div>
            ):(<></>)}

        </section>
      

    )
}

export const Step3: React.FC<StepsRequestsProps> = ({useProvider, rows, setRows, serviceTypes, setServiceTypes, isInitialLoad, setIsInitialLoad, isEntregaVacioSelected, setIsEntregaVacioSelected, requestData, requestFormData}) => {                    
    const [servicesSelect, setServicesSelect] = useState<SelectOptionTypes[]>([]);//Estados que maneja los datos que tiene el select de servicios
    const [routesInformation, setRoutesInformation] = useState<Record<string, any>>({});
    const [routeIDsByRow, setRouteIDsByRow] = useState<Record<string, string>>({}); 
    const { control, setValue, register, errors } = useFormContext<RequestsFormValues>();

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

    console.log('totall', totalRows);
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

export const Step4: React.FC<StepsRequestsProps> = ({useProvider, rows, requestFormData, setRows, requestData}) => {      
    const { control, setValue, register, errors } = useFormContext<RequestsFormValues>();    
    return(
        <div className="flex flex-col mt-10 gap-10">
            <h1 className="text-black">Completa el formulario para crear una nueva petición</h1>
            <SelectionTeamTable
                title = {['Tipo de Servicio', 'Conductor', 'Chasis', 'Cabezal', 'Furgón']}
                control = {control}
                useProvider = {useProvider}
                rows={rows}
                requestFormData = {requestFormData}
                setRows={setRows}
                requestData = {requestData}
                setValue= {setValue}
                register = {register}
            />
            {useProvider &&
                <NeonWarning message={'Se utilizará el equipo del proveedor designado.'}/>
            }            
        </div>
    )
}

export const Step5: React.FC<StepsRequestsProps> = ({useProvider, requestFormData, rows}) => {    
    const { control, setValue, register, errors, watch } = useFormContext<RequestsFormValues>();

    const services = rows.map((row, index) => ({
        serviceType: row.serviceType,
        rowIndex: index,
    }));
    


    return (
        <div className="flex flex-col mt-10 gap-10">
            <h1 className="text-black">Visualización y modificación de tarifa</h1>
            <PrevisualizationTab
                tabContent={services.map(s => s.serviceType)}
                onTabChange={(selectedOption) => console.log('Opción seleccionada:', selectedOption)}                
                rows={rows}
                register={register}
                watch={watch}
                setValue = {setValue}
                useProvider={useProvider}
                requestFormData = {requestFormData}
                errors = {errors}
            />

            <h1 className="text-black">Factura total de servicios</h1>
            <div className="flex justify-center">
                <InvoiceTable
                    services={services}
                    rows = {rows}
                    requestFormData = {requestFormData}
                />
            </div>
        </div>
    )
}