import { useEffect, useState } from "react";
import { Input } from "../../../ui/inputs/input";
import Select from 'react-select';
import { Controller, useFormContext } from "react-hook-form";
import { SelectData } from "../../../../api/Requests/requests.route";
import { StepsRequestsProps } from "../../../types/forms/RequestsForm/requestsForm";
import { SelectOptionTypes } from "../../../types/Select/select";
import { TransformSelectData } from "../../../../functions/transformSelectData/TransformSelectData";
import { RequestsFormValues } from "../../../types/forms/RequestsForm/requestsForm";

export const Step2: React.FC<StepsRequestsProps> = ({setUseProvider, useProvider, requestFormData}) => {        
    const [providersSelect, setProvidersSelect] = useState<SelectOptionTypes[]>([]);
    const { control, setValue, register, formState: { errors } } = useFormContext<RequestsFormValues>();        

    console.log('requestFormData Step#2',requestFormData);


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
    const multipleServicios = (requestFormData?.servicios?.length ?? 0) > 1;
    const hasConductorData = requestFormData?.servicios?.filter(Boolean).some(s => !!s.id_conductor);
    const hasCabezalData = requestFormData?.servicios?.filter(Boolean).some(s => !!s.id_cabezal);
    const hasChasisData = requestFormData?.servicios?.filter(Boolean).some(s => !!s.id_chasis);
    const hasFurgonData = requestFormData?.servicios?.filter(Boolean).some(s => !!s.id_furgon);
    // const hasCabezalData = requestFormData?.servicios?.some(s => !!s.id_cabezal);
    // const hasChasisData = requestFormData?.servicios?.some(s => !!s.id_chasis);
    // const hasFurgonData = requestFormData?.servicios?.some(s => !!s.id_furgon);
    const hasExtras = requestFormData?.servicios?.filter(Boolean).some(
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
                        if (setUseProvider) {
                            setUseProvider(e.target.checked);
                        }
                    }}
                />

                {/* Solo intercepta clics cuando está deshabilitado */}
                {isDisabled && (
                    <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[18px] h-[18px] cursor-not-allowed z-10"
                        onClick={(e) => {
                        e.preventDefault(); 
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
                        rules={{ required: true }}
                        render={({ field }) => (                        
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
                        )}
                        />

                    </div>   

                    <div className="flex w-full items-center gap-12">
                        <label className="text-black text-sm mb-1">Costo del proveedor:</label>
                        <Input 
                        type="number"
                        className2={`w-[20%] h-8 ${errors?.precio_proveedor ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Costo $"
                        {...register('precio_proveedor', {valueAsNumber: true, required: 'Campo requerido'})}
                        />
                    </div>             

                </div>
                </div>
            ):(<></>)}

        </section>
      

    )
}