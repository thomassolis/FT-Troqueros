import { SmallLabel } from "../../../ui/Labels/smallLabel"
import { Input } from "../../../ui/inputs/input"
import Select from "react-select"
import { StepsProvidersProps } from "../../../types/forms/ProvidersForm/providersForm"
import { Controller } from "react-hook-form"
import { bankData } from "../../../others/Data/BankData"

export const Step1: React.FC<StepsProvidersProps> = ({register, errors}) => {    

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

export const Step2: React.FC<StepsProvidersProps> = ({register}) => {

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

export const Step3: React.FC<StepsProvidersProps> = ({register, control}:any) => {    
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

                        <div className="flex items-center gap-3 w-full">                            

                        <Controller
                            name="tipoBanco"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    className="w-full text-black"
                                    options={bankData}
                                    placeholder="Seleccione un banco"
                                    value={bankData.find(option => option.value === field.value) || null}
                                    onChange={(selectedOption) => field.onChange(selectedOption?.value)}
                                    onBlur={field.onBlur}
                                />
                            )}
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