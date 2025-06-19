import { SmallLabel } from "../../../ui/Labels/smallLabel"
import { Input } from "../../../ui/inputs/input"
import { StepOneCustomers } from "../../../types/forms/CustomersForm/CustomersForm"
import { StepOneCustomerProps } from "../../../types/forms/CustomersForm/CustomersForm"
import { useEffect } from "react"
import { InsertFiles } from "../../../ui/Files/insertFiles"
import { GetProcedureFromURL } from "../../../../functions/GetURL/GetURLInfo"
import { Controller } from "react-hook-form"


export const StepOne: React.FC<StepOneCustomerProps> = ({register, setValue, errors, customersData}) =>{

    useEffect(() => {
        if (customersData && setValue) {
            if (customersData.ruc) {
                setValue('nombre', customersData.nombre ?? '');
            }
      
            if (customersData.ruc) {
                setValue('ruc', customersData.ruc ?? '');
            }         
            if (customersData.direccion) {
                setValue('direccion', customersData.direccion ?? '');
            }         

        }
      }, [customersData, setValue]);
    return(
        <section className="w-full ">
                            
                <h1 className="text-black mt-10 ml-6 text-lg font-semibold">Llena el siguiente formulario para crear un nuevo cliente</h1>
            
            <div className="flex justify-center">
                <div className="flex w-[70%]">
                    <div className="flex flex-col gap-12 items-start w-full  mt-12 ">

                        <div className="h-10 flex items-center">
                            <SmallLabel text="Nombre de la empresa"/>
                        </div>
                        
                        <div className="h-10 flex items-center">
                            <SmallLabel text="Ruc de la empresa"/>
                        </div>                    

                        <div className="h-10 flex items-center">
                            <SmallLabel text="Dirección de oficinas"/>
                        </div>
                        
                    </div>

                    <div className="flex flex-col gap-12 items-start w-full  mt-12 ">

                        <div className="flex items-center gap-3">
                            <Input 
                                type="string" 
                                className2={'py-5'} 
                                placeholder="Nombre de empresa"               
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
                                placeholder="Ruc de empresa"               
                                {...register('ruc', {required:'Required'})}  
                            />

                            {errors.ruc && (
                                <span className="text-red-500">{errors.ruc.message}</span>
                            )}
                        </div>                        
                        <Input 
                            type="string" 
                            className2={'py-5'} 
                            placeholder="Dirección de empresa"               
                            {...register('direccion')}  
                        />
                    </div>
                </div>            
            </div>            
        </section>
    )
}

export const StepTwo: React.FC<StepOneCustomerProps> = ({register, setValue, customersData}) =>{

    useEffect(() => {
        if (customersData && setValue) {
            if (customersData.ruc) {
                setValue('nombrePersonaContacto', customersData.nombrePersonaContacto ?? '');
            }
            if (customersData.ruc) {
                setValue('telPersonaContacto', customersData.telPersonaContacto ?? '');
            }         
            if (customersData.direccion) {
                setValue('emailPersonaContacto', customersData.emailPersonaContacto ?? '');
            }         

        }
      }, [customersData, setValue]);

    return(
        <section className="w-full ">
                            
                <h1 className="text-black mt-10 ml-6 text-lg font-semibold">Llena el siguiente formulario para crear un nuevo cliente</h1>
            
            <div className="flex justify-center">
                <div className="flex w-[70%]">
                    <div className="flex flex-col gap-12 items-start w-full  mt-12 ">

                        <div className="h-10 flex items-center">
                            <SmallLabel text="Nombre de persona de contacto"/>
                        </div>
                        
                        <div className="h-10 flex items-center">
                            <SmallLabel text="Teléfono de persona de contacto"/>
                        </div>                    

                        <div className="h-10 flex items-center">
                            <SmallLabel text="Email de persona de contacto"/>
                        </div>
                        
                    </div>

                    <div className="flex flex-col gap-12 items-start w-full  mt-12 ">
                        <Input 
                            type="string" 
                            className2={'py-5'} 
                            placeholder="Nombre de persona de contacto"               
                            {...register('nombrePersonaContacto')}  
                        />
                        <Input 
                            type="string" 
                            className2={'py-5'} 
                            placeholder="Teléfono de persona de contacto"               
                            {...register('telPersonaContacto')}  
                        />
                        <Input 
                            type="email" 
                            className2={'py-5'} 
                            placeholder="Email de persona de contacto"               
                            {...register('emailPersonaContacto')}  
                        />
                    </div>
                </div>            
            </div>            
        </section>
    )
}

export const StepThree: React.FC<StepOneCustomerProps> = ({register, setValue, customersData}) =>{
    useEffect(() => {
        if (customersData && setValue) {
            if (customersData.ruc) {
                setValue('nombreBanco', customersData.nombreBanco ?? '');
            }
            if (customersData.ruc) {
                setValue('tipoCuenta', customersData.tipoCuenta ?? '');
            }         
            if (customersData.direccion) {
                setValue('nombreCuenta', customersData.nombreCuenta ?? '');
            }       
            if (customersData.direccion) {
              setValue('numeroCuenta', customersData.numeroCuenta ?? '');
            }

        }
      }, [customersData, setValue]);
    return(
        <section className="w-full ">
                            
                <h1 className="text-black mt-10 ml-6 text-lg font-semibold">Llena el siguiente formulario para crear un nuevo cliente</h1>
            
            <div className="flex justify-center">
                <div className="flex w-[70%]">
                    <div className="flex flex-col gap-12 items-start w-full  mt-12 ">

                        <div className="h-10 flex items-center">
                            <SmallLabel text="Tipo de Banco"/>
                        </div>
                        
                        <div className="h-10 flex items-center">
                            <SmallLabel text="Tipo de Cuenta"/>
                        </div>                    

                        <div className="h-10 flex items-center">
                            <SmallLabel text="Nombre de Cuenta"/>
                        </div>

                        <div className="h-10 flex items-center">
                            <SmallLabel text="Número de Cuenta"/>
                        </div>
                        
                    </div>

                    <div className="flex flex-col gap-12 items-start w-full  mt-12 ">
                        <Input 
                            type="string" 
                            className2={'py-5'} 
                            placeholder="Ejm. Banco General"               
                            {...register('nombreBanco')}  
                        />
                        <Input 
                            type="string" 
                            className2={'py-5'} 
                            placeholder="Ejm. Ahorro"               
                            {...register('tipoCuenta')}  
                        />
                        <Input 
                            type="string" 
                            className2={'py-5'} 
                            placeholder="Ejm. Danger Man"               
                            {...register('nombreCuenta')}
                        />

                        <Input 
                            type="string" 
                            className2={'py-5'} 
                            placeholder="Ejm. 888888888"               
                            {...register('numeroCuenta')}
                        />
                    </div>
                </div>            
            </div>            
        </section>
    )
}


export const StepFour: React.FC<StepOneCustomerProps> = ({ register, control, customersData, setValue }) => {
        const procedure = GetProcedureFromURL();

    // Inicializar valores al cargar (solo en modo modify)
    useEffect(() => {
        if (procedure === 'modify') {
            if (customersData.cedRepresentanteLegal) {
                setValue(
                    "cedRepresentanteLegal", 
                    Array.isArray(customersData.cedRepresentanteLegal) 
                        ? customersData.cedRepresentanteLegal 
                        : [customersData.cedRepresentanteLegal]
                );
            }
            if (customersData.avisoOperaciones) {
                setValue(
                    "avisoOperaciones",
                    Array.isArray(customersData.avisoOperaciones)
                        ? customersData.avisoOperaciones
                        : [customersData.avisoOperaciones]
                );
            }
        }
    }, [procedure, customersData, setValue]);

    return (
        <section className="w-full">                    
            <h1 className="text-black mt-10 ml-6 text-lg font-semibold">Adjunte los siguientes documentos para crear un nuevo cliente</h1>
            
            <div className="flex justify-center">
                <div className="flex w-[80%]">
                    <div className="flex flex-col gap-12 items-start w-full mt-12">
                        <div className="flex items-center w-[90%]">
                            <SmallLabel text="Copia de cédula de representante legal"/>
                            <Controller
                                name="cedRepresentanteLegal"
                                control={control}
                                render={({ field }) => (
                                    <InsertFiles
                                        files={procedure === 'modify' ? (Array.isArray(customersData.cedRepresentanteLegal) ? customersData.cedRepresentanteLegal : []) : []}
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
                                name="avisoOperaciones"
                                control={control}
                                render={({ field }) => (
                                    <InsertFiles
                                        files={
                                            procedure === 'modify' 
                                                ? (Array.isArray(customersData.avisoOperaciones) ? customersData.avisoOperaciones : []) 
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

