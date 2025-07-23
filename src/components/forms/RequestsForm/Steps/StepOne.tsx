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

export const Step1: React.FC<StepsRequestsProps> = () => {        
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