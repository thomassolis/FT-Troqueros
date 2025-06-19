import { SmallLabel } from "../../../ui/Labels/smallLabel"
import { Input } from "../../../ui/inputs/input"
import { GetProcedureFromURL } from "../../../../functions/GetURL/GetURLInfo"
import { StepsProvidersProps } from "../../../types/forms/ProvidersForm/providersForm"
import { useEffect } from "react"

export const Step1: React.FC<StepsProvidersProps> = ({register, errors, setValue, providersData}) => {    

        useEffect(() => {
        if (providersData && setValue) {            
            if (providersData.nombre) {
                setValue('nombre', providersData.nombre ?? '');
            }
            if (providersData.persona_contacto) {
                setValue('personaContacto', providersData.persona_contacto ?? '');
            }              

        }
      }, [providersData, setValue]);


    return (
        <section className="w-full ">                        
            <h1 className="text-black mt-10 ml-6 text-lg font-semibold">Complete el siguiente formulario para crear un nuevo proveedor</h1>
            
            <div className="flex justify-center">
                <div className="flex w-[70%]">
                    <div className="flex flex-col gap-12 items-start w-full  mt-12 ">

                        <div className="h-10 flex items-center">
                            <SmallLabel text="Nombre del proveedor"/>
                        </div>
                        
                        <div className="h-10 flex items-center">
                            <SmallLabel text="Persona de Contacto"/>
                        </div>                    
                        
                    </div>

                    <div className="flex flex-col gap-12 items-start w-full  mt-12 ">

                        <div className="flex items-center gap-3">
                            <Input 
                                type="string" 
                                className2={'py-5'} 
                                placeholder="Ejm: Proveedor S.A."                                               
                                {...register('nombre', { required: 'Required' })}
                            />
                            {errors.nombre && (
                                <span className="text-red-500">{errors.nombre.message}</span>
                            )}
                        </div>                        

                        <div className="flex items-center gap-3">
                            <Input 
                                type="string" 
                                className2={'py-5'} 
                                placeholder="Ejm: Jorge Perez"               
                                {...register('personaContacto')}  
                            />
                        </div>                        
                    </div>
                </div>            
            </div>            
        </section>       

    )
}

export const Step2: React.FC<StepsProvidersProps> = ({register, errors, setValue, providersData}) => {

        useEffect(() => {
        if (providersData && setValue) {            
            if (providersData.celular) {
                setValue('celular', providersData.celular ?? '');
            }
            if (providersData.telefono) {
                setValue('telefono', providersData.telefono ?? '');
            }     
            if (providersData.email) {
                setValue('email', providersData.email ?? '');
            }           

        }
    }, [providersData, setValue]);

    return (
        <section className="w-full ">                        
            <h1 className="text-black mt-10 ml-6 text-lg font-semibold">Complete la información de contacto del nuevo proveedor</h1>
            
            <div className="flex justify-center">
                <div className="flex w-[70%]">
                    <div className="flex flex-col gap-12 items-start w-full  mt-12 ">
                        
                        <div className="h-10 flex items-center">
                            <SmallLabel text="Celular"/>
                        </div>                    

                        <div className="h-10 flex items-center">
                            <SmallLabel text="Teléfono"/>
                        </div>                    

                        <div className="h-10 flex items-center">
                            <SmallLabel text="Correo Electrónico"/>
                        </div>
                        
                    </div>

                    <div className="flex flex-col gap-12 items-start w-full  mt-12 ">

                        <div className="flex items-center gap-3">
                            <Input 
                                type="string" 
                                className2={'py-5'} 
                                placeholder="Ejm: 6666-6666"               
                                {...register('celular')}  
                            />

                        </div>  

                        <div className="flex items-center gap-3">
                            <Input 
                                type="string" 
                                className2={'py-5'} 
                                placeholder="Ejm: 6666-6666"               
                                {...register('telefono')}  
                            />

                        </div>                      
                         
                        <Input 
                            type="email" 
                            className2={'py-5'} 
                            placeholder="Ejm: Ejemplo@gmail.com"               
                            {...register('email')}  
                        />
                    </div>
                </div>            
            </div>            
        </section>       

    )
}

export const Step3: React.FC<StepsProvidersProps> = ({register, control, providersData, setValue}:any) => {
    
    useEffect(() => {
        if (providersData && setValue) {            
            if (providersData.numero_yappy) {
                setValue('numeroYappy', providersData.numero_yappy ?? '');
            }
            if (providersData.nombre_cuenta) {
                setValue('nombreCuenta', providersData.nombre_cuenta ?? '');
            }            
            if (providersData.tipo_banco) {
                setValue('tipoBanco', providersData.tipo_banco ?? '');
            }      
            if (providersData.numero_cuenta) {
                setValue('numeroCuenta', providersData.numero_cuenta ?? '');
            }    

        }
    }, [providersData, setValue]);

    return (
        <section className="w-full ">                        
            <h1 className="text-black mt-10 ml-6 text-lg font-semibold">Complete la información de contacto del nuevo proveedor</h1>
            
            <div className="flex justify-center">
                <div className="flex w-[70%]">
                    <div className="flex flex-col gap-12 items-start w-full  mt-12 ">

                        <div className="h-10 flex items-center">
                            <SmallLabel text="Número de Yappy"/>
                        </div>

                        <div className="h-10 flex items-center">
                            <SmallLabel text="Titular de Cuenta"/>
                        </div>
                        
                        <div className="h-10 flex items-center">
                            <SmallLabel text="Tipo de Banco"/>
                        </div>                    

                        <div className="h-10 flex items-center">
                            <SmallLabel text="Número de cuenta"/>
                        </div>                    
                        
                    </div>

                    <div className="flex flex-col gap-12 items-start w-full  mt-12 ">

                        <div className="flex items-center gap-3">
                            <Input 
                                type="string" 
                                className2={'py-5'} 
                                placeholder="Ejm: 6666-6666"               
                                {...register('numeroYappy')}  
                            />

                        </div>  

                        <div className="flex items-center gap-3">
                            <Input 
                                type="string" 
                                className2={'py-5'} 
                                placeholder="Ejm: David Peña"               
                                {...register('nombreCuenta')}  
                            />

                        </div>  

                        <div className="flex items-center gap-3">
                            <Input 
                                type="string" 
                                className2={'py-5'} 
                                placeholder="Ejm: Banco General"               
                                {...register('tipoBanco')}  
                            />

                        </div>                      
                         
                        <Input 
                            type="text" 
                            className2={'py-5'} 
                            placeholder="Ejm: 8888-88-88888"               
                            {...register('numeroCuenta')}  
                        />
                    </div>
                </div>            
            </div>            
        </section>      

    )
}