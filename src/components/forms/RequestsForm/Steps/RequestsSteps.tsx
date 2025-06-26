import { useEffect, useState } from "react";
import { Input } from "../../../ui/inputs/input";
import { SmallLabel } from "../../../ui/Labels/smallLabel";
import Select from 'react-select';
import { Controller } from "react-hook-form";
import { SelectData } from "../../../../api/Requests/requests.route";
import { StepsRequestsProps } from "../../../types/forms/RequestsForm/requestsForm";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ServicesSelectionTable } from "../../../ui/Tables/RequestsForm/servicesSelection";
import { DynamicRequestsType } from "../../../../functions/DynamicSections/Requests/DynamicRequestsType";
import { SelectOptionTypes } from "../../../types/Select/select";
import { TransformSelectData } from "../../../../functions/transformSelectData/TransformSelectData";
import { useWatch } from 'react-hook-form';
import { useContext } from "react";
import { dynamicRequestsContext } from "../../../../context/Requests/DynamicRequestsOptions";
import { ServiceType } from "../../../../context/Requests/DynamicRequestsOptions";
import { SelectionTeamTable } from "../../../ui/Tables/RequestsForm/selectionTeamTable";
import { AmountTable } from "../../../ui/Tables/AmountTable/AmountTable";
import { PrevisualizationTab } from "../../../ui/tabs/Tabs";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from 'dayjs';
import { NeonWarning } from "../../../ui/Warning/NeonWarning";
import { InvoiceTable } from "../../../ui/Tables/AmountTable/InvoiceTable";

export const Step1: React.FC<StepsRequestsProps> = ({register, errors, setValue, control, useProvider, setUseProvider}) => {    
    const [customersSelect, setCustomersSelect] = useState<SelectOptionTypes[]>([]);
    //     useEffect(() => {
    //     if (providersData && setValue) {    
    //         if (providersData.nombre) {
    //             setValue('nombre', providersData.nombre ?? '');
    //         }
    //         if (providersData.persona_contacto) {
    //             setValue('personaContacto', providersData.persona_contacto ?? '');
    //         }              

    //     }
    //   }, [providersData, setValue]);

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

                        <div className="h-10 flex items-center">
                            <SmallLabel text="Nombre del Cliente"/>
                        </div>
                        
                        <div className="h-10 flex items-center">
                            <SmallLabel text="Fecha de Salida"/>
                        </div>                    

                        <div className="h-10 flex items-center">
                            <SmallLabel text="Hora de Salida"/>
                        </div>         
                        
                    </div>

                    <div className="flex flex-col gap-12 items-start w-full  mt-12 ">

                        <div className="flex items-center gap-3 w-full">
                            <Controller
                            name="id_cliente"
                            control={control}
                            render={({ field }) => (
                                <Select 
                                    {...field} // <-- Muy importante: conecta onChange, onBlur y value
                                    className="w-full text-black" 
                                    options={customersSelect}
                                    placeholder="Selecciona un cliente..."
                                    value={customersSelect.find(customersSelect => customersSelect.value === field.value)} // Para mostrar el label correcto
                                    onChange={customersSelect => field.onChange(customersSelect?.value)} // Guarda solo el ID, no todo el objeto
                                     // --- Solución ---
                                    menuPortalTarget={document.body} // Renderiza el menú en el body
                                    styles={{
                                        menuPortal: base => ({ ...base, zIndex: 9999 }), // Asegura que esté por encima de todo
                                    }}
                                />
                            )}
                            />

                        </div>                        

                        <div className="flex items-center gap-3 w-full ">

                            <Controller
                                name="fecha_salida"
                                control={control}
                                render={({ field }) => (
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={["DatePicker"]} sx={{width:'100%'}}>
                                            <DatePicker
                                                label="Selecciona una fecha"
                                                format="DD/MM/YY"
                                                value={field.value ? dayjs(field.value, 'YYYY-MM-DD') : null} // Convierte el string a dayjs
                                                onChange={(date) => {
                                                    const formattedDate = dayjs(date).format('YYYY-MM-DD'); // Formatea a DD/MM/YY
                                                    field.onChange(formattedDate); // Guarda el string (ej: "25/06/24")
                                                }}
                                                className="bg-white w-full"
                                                slotProps={{
                                                    textField: {
                                                    error: !!errors.fecha_salida,
                                                    helperText: errors.fecha_salida?.message,
                                                    },
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
                                    slotProps={{
                                        textField: {
                                        error: !!errors.hora_salida,
                                        helperText: errors.hora_salida?.message,
                                        },
                                    }}
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

export const Step2: React.FC<StepsRequestsProps> = ({register, errors, setValue, control, setUseProvider, useProvider}) => {    
    // const [useProvider, setUseProvider] = useState(false);    
    const [providersSelect, setProvidersSelect] = useState<SelectOptionTypes[]>([]);
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
    

    // const useProvider = useWatch({
    //     control,
    //     name: 'tipo_entregaProveedor',
    //     defaultValue: false
    // });

    // useEffect(() => {
    // if (useProvider === false && setValue) {
    //     setValue('costos_extras', 0);
    //     setValue('id_proveedor', '');
    // }
    // }, [useProvider, setValue]);

    return (
        <section className="w-full">                        
            <h1 className="text-black mt-10 ml-6 text-lg font-semibold">
                Complete el siguiente formulario para crear una nueva petición
            </h1>

            <div className="flex justify-center items-center mt-6">
                    <label className="flex items-center gap-3 w-[70%] cursor-pointer">
                        <input
                            type="checkbox"
                            id="providerCheck"
                            className="accent-blue-500"
                            // checked={field.value}
                            onChange={(e) => {
                                setUseProvider(e.target.checked);
                            }}
                        />

                    <label className="text-black " htmlFor="providerCheck">
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
                    render={({ field }) => (
                        <Select 
                            {...field}
                            className="w-[60%] text-black" 
                            options={providersSelect}
                            value={providersSelect.find(providersSelect => providersSelect.value === field.value)} // Para mostrar el label correcto
                            onChange={providersSelect => field.onChange(providersSelect?.value)} // Guarda solo el ID, no todo el objeto
                        />
                    )}
                    />
                </div>   

                <div className="flex w-full items-center gap-12">
                    <label className="text-black text-sm mb-1">Costo del proveedor:</label>
                    <Input 
                        type="number"
                        className2="w-[20%] h-8"
                        placeholder="Costo $"
                        {...register('precio_proveedor')}
                    />
                </div>             

            </div>
            </div>
        ):(<></>)}
        </section>
      

    )
}

export const Step3: React.FC<StepsRequestsProps> = ({control, register, setValue, useProvider}) => {            
    const {serviceTypes, setServiceTypes, rows, setRows} = useContext(dynamicRequestsContext)!;
    const [servicesSelect, setServicesSelect] = useState<SelectOptionTypes[]>([]);//Estados que maneja los datos que tiene el select de servicios
    const [routesInformation, setRoutesInformation] = useState<Record<string, any>>({});
    const [routeIDsByRow, setRouteIDsByRow] = useState<Record<string, string>>({});    
    console.log('useProvider: ', useProvider)
    console.log('ROWS DESDE TABLA: ', rows);

    const newServiceType = () => {
        const newId = serviceTypes.length > 0 ? Math.max(...serviceTypes.map(st => st.id)) + 1 : 1;
        setServiceTypes(prev => [...prev, { id: newId, selectedValue: '', quantity: 0, serviceID: '' }]);
    }

    useEffect(()=>{
        console.log('ROWS EN TABLAAA: ', rows);
    },[rows])

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

    const totalRows = serviceTypes.reduce((acc, st) => acc + st.quantity, 0);
        
    const deleteServiceType = (id: number) => {
    console.log('Id a eliminar', id);

    // Elimina el bloque visual en serviceTypes
    console.log('serviceTypes antes de eliminar: ', serviceTypes);
        setServiceTypes(prev => {
        const updated = prev.filter(st => {
        console.log('Comparando: ', st.id, id);
        return st.id !== id; // Verifica si id es el correcto y está comparando correctamente
        });
        return updated;
    });
    console.log('serviceTypes después de eliminar: ', serviceTypes);

    // Elimina las rutas relacionadas a ese id
    console.log('RoutesInformation antes de eliminar: ', routesInformation);
    setRoutesInformation(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
        if (key.startsWith(`${id}-`)) {
            delete updated[key];
        }
        });
        return updated;
    });
    console.log('RoutesInformation después de eliminar: ', routesInformation);

    // Elimina las rutas relacionadas en routeIDsByRow
    console.log('routeIDsByRow antes de eliminar: ', routeIDsByRow);
    setRouteIDsByRow(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
        if (key.startsWith(`${id}-`)) {
            delete updated[key];
        }
        });
        return updated;
    });
    console.log('routeIDsByRow después de eliminar: ', routeIDsByRow);

    // Elimina las filas en rows con el serviceTypeId correspondiente
    console.log('rows antes de eliminar: ', rows);

    rows.map((row)=>{
        console.log('row.serviceTypeId', row.serviceTypeId)
    })  
    console.log('Id', id);
        setRows(prev => {
            console.log('Filtrando rows con id:', id);

            const filteredRows = prev.filter(row => row.serviceTypeId !== id); // Aquí filtras correctamente
            console.log('rows después del filtro:', filteredRows);
            return filteredRows;
        });

    console.log('rows después de eliminar: ', rows);
    };

    return (
        <section className="w-full ">                        
            <h1 className="text-black mt-10 ml-6 text-lg font-semibold">
                Complete el siguiente formulario para crear una nueva petición
            </h1>

            <div className="flex flex-col items-center justify-center gap-5 w-full">                
                <div className="grid grid-cols-[0.4fr_0.2fr_0.1fr] mt-6 gap-4 w-[80%] items-center justify-center">                    
                    <h1 className="text-black">Tipo de Servicio</h1>                                        
                    <h1 className="text-black">Cantidad</h1>                    
                </div>

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
                    />
                ))}

                {useProvider ? (
                    <></>
                ):(
                    <Icon 
                        icon="gg:add" 
                        width="24" height="24"  
                        className="text-gray-500 cursor-pointer hover:text-black"
                        onClick={newServiceType}
                    />
                )}
            </div>

            {totalRows > 0 && (
                <div className="flex flex-col">
                    <h1 className="text-black mt-10">Favor seleccione las rutas que le desea asignar a cada servicio</h1>
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
                    />
                </div>            
            )}
        </section>    
    )
}

export const Step4: React.FC<StepsRequestsProps> = ({control, useProvider}) => {   
   
    return(
        <div className="flex flex-col mt-10 gap-10">
            <h1 className="text-black">Completa el formulario para crear una nueva petición</h1>
            <SelectionTeamTable
                title = {['Tipo de Servicio', 'Conductor', 'Chasis', 'Cabezal', 'Furgón']}
                control = {control}
                useProvider = {useProvider}   
            />
            {useProvider &&
                <NeonWarning message={'Se utilizará el equipo del proveedor designado.'}/>
            }            
        </div>
    )
}

export const Step5: React.FC<StepsRequestsProps> = ({register, watch, setValue, useProvider, requestFormData}) => {
    const {rows} = useContext(dynamicRequestsContext)!;
        
    console.log('Paso 5: requestFormData', requestFormData);
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
            />

            <hr />
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