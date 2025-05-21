import { SmallLabel } from "../../../ui/Labels/smallLabel"
import { Input } from "../../../ui/inputs/input"
import { Controller } from "react-hook-form"
import { GetProcedureFromURL } from "../../../../functions/GetURL/GetURLInfo"
import { InsertFiles } from "../../../ui/Files/insertFiles"
import { StepsDriversProps } from "../../../types/DriversForm/DriversForm"
import { useEffect } from "react"

export const Step1: React.FC<StepsDriversProps> = ({register, errors, driversData, setValue}) => {
    console.log('driversData', driversData);
    useEffect(()=>{
        if(driversData && setValue){            
            setValue('nombre', driversData.nombre);
            setValue('apellido', driversData.apellido);
            setValue('cedula', driversData.cedula);
        }
    }, [driversData, setValue])
    return (
        <section className="w-full ">                        
            <h1 className="text-black mt-10 ml-6 text-lg font-semibold">Complete el siguiente formulario para crear un nuevo conductor</h1>
            
            <div className="flex justify-center">
                <div className="flex w-[70%]">
                    <div className="flex flex-col gap-12 items-start w-full  mt-12 ">

                        <div className="h-10 flex items-center">
                            <SmallLabel text="Nombre del conductor"/>
                        </div>
                        
                        <div className="h-10 flex items-center">
                            <SmallLabel text="Apellido del conductor"/>
                        </div>                    

                        <div className="h-10 flex items-center">
                            <SmallLabel text="Cédula del conductor"/>
                        </div>
                        
                    </div>

                    <div className="flex flex-col gap-12 items-start w-full  mt-12 ">

                        <div className="flex items-center gap-3">
                            <Input 
                                type="string" 
                                className2={'py-5'} 
                                placeholder="Ejm: Juan"               
                                {...register('nombre', {required:"Required"})}  
                            />
                            {errors.nombre && (
                                <span className="text-red-500">{errors.nombre.message}</span>
                            )}
                        </div>                        

                        <div className="flex items-center gap-3">
                            <Input 
                                type="string" 
                                className2={'py-5'} 
                                placeholder="Ejm: Perez"               
                                {...register('apellido', {required:'Required'})}  
                            />

                            {errors.apellido && (
                                <span className="text-red-500">{errors.apellido.message}</span>
                            )}
                        </div>                        
                        <Input 
                            type="string" 
                            className2={'py-5'} 
                            placeholder="Ejm: 8-888-8888"               
                            {...register('cedula')}  
                        />
                    </div>
                </div>            
            </div>            
        </section>       

    )
}

export const Step2: React.FC<StepsDriversProps> = ({register, errors, setValue, driversData}) => {
        useEffect(()=>{
        if(driversData && setValue){            
            setValue('tipo_licencia', driversData.tipo_licencia);
            setValue('telefono', driversData.telefono);
            setValue('email', driversData.email);
        }
    }, [driversData, setValue])
    return (
        <section className="w-full ">                        
            <h1 className="text-black mt-10 ml-6 text-lg font-semibold">Complete la información de contacto del nuevo conductor</h1>
            
            <div className="flex justify-center">
                <div className="flex w-[70%]">
                    <div className="flex flex-col gap-12 items-start w-full  mt-12 ">

                        {/* <div className="h-10 flex items-center">
                            <SmallLabel text="Tipo de licencia"/>
                        </div> */}
                        
                        <div className="h-10 flex items-center">
                            <SmallLabel text="Teléfono"/>
                        </div>                    

                        <div className="h-10 flex items-center">
                            <SmallLabel text="Correo Electrónico"/>
                        </div>
                        
                    </div>

                    <div className="flex flex-col gap-12 items-start w-full  mt-12 ">

                        {/* <div className="flex items-center gap-3">
                            <Input 
                                type="string" 
                                className2={'py-5'} 
                                placeholder="Ejm: D"               
                                {...register('tipo_licencia', {required:"Required"})}
                            />
                            {errors.tipo_licencia && (
                                <span className="text-red-500">{errors.tipo_licencia.message}</span>
                            )}
                        </div>                         */}

                        <div className="flex items-center gap-3">
                            <Input 
                                type="string" 
                                className2={'py-5'} 
                                placeholder="Ejm: 6666-6666"               
                                {...register('telefono', {required:'Required'})}  
                            />

                            {errors.telefono && (
                                <span className="text-red-500">{errors.telefono.message}</span>
                            )}
                        </div>                        
                        <Input 
                            type="string" 
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

export const Step3: React.FC<StepsDriversProps> = ({register, control, driversData, setValue}:any) => {
    const procedure = GetProcedureFromURL();  
    
        // Inicializar valores al cargar (solo en modo modify)
    useEffect(() => {
        if (procedure === 'modify') {
            if (driversData.licencia) {
                setValue(
                    "licencia", 
                    Array.isArray(driversData.licencia) 
                        ? driversData.licencia 
                        : [driversData.licencia]
                );
            }else if (driversData.pazSalvo) {
                setValue(
                    "pazSalvo",
                    Array.isArray(driversData.pazSalvo)
                        ? driversData.pazSalvo
                        : [driversData.pazSalvo]
                );
            }else if (driversData.recordPolicivo) {
                setValue(
                    "recordPolicivo",
                    Array.isArray(driversData.recordPolicivo)
                        ? driversData.recordPolicivo
                        : [driversData.recordPolicivo]
                );
            }

        }
    }, [procedure, driversData, setValue]);
    return (
        <section className="w-full">                    
            <h1 className="text-black mt-10 ml-6 text-lg font-semibold">Adjunte los siguientes documentos para crear un nuevo conductor</h1>
            
            <div className="flex justify-center">
                <div className="flex w-[80%]">
                    <div className="flex flex-col gap-12 items-start w-full mt-12">
                        <div className="flex items-center w-[90%]">
                            <SmallLabel text="Copia de cédula de representante legal"/>
                            <Controller
                                name="licencia"
                                control={control}
                                render={({ field }) => (
                                    <InsertFiles
                                        files={procedure === 'modify' ? (Array.isArray(driversData.licencia) ? driversData.licencia : []) : []}
                                        procedure={procedure}
                                        onFileReady={(file, name) => field.onChange(file)}
                                        fileName={field.name}
                                    />
                                )}
                            />
                        </div>
                        
                        <div className="flex items-center w-[90%]">
                            <SmallLabel text="Copia de aviso de operaciones"/>
                            <Controller
                                name="pazSalvo"
                                control={control}
                                render={({ field }) => (
                                    <InsertFiles
                                        files={
                                            procedure === 'modify' 
                                                ? (Array.isArray(driversData.pazSalvo) ? driversData.pazSalvo : []) 
                                                : []
                                        }
                                        procedure={procedure}
                                        onFileReady={(file, name) => field.onChange(file)}
                                        fileName={field.name}
                                    />
                                )}
                            />
                        </div>        

                        <div className="flex items-center w-[90%]">
                            <SmallLabel text="Record Policivo"/>
                            <Controller
                                name="recordPolicivo"
                                control={control}
                                render={({ field }) => (
                                    <InsertFiles
                                        files={
                                            procedure === 'modify' 
                                                ? (Array.isArray(driversData.recordPolicivo) ? driversData.recordPolicivo : []) 
                                                : []
                                        }
                                        procedure={procedure}
                                        onFileReady={(file, name) => field.onChange(file)}
                                        fileName={field.name}
                                    />
                                )}
                            />
                        </div>  

                    </div>
                </div>            
            </div>            
        </section>     

    )
}