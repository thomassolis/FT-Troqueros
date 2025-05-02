import { SmallLabel } from "../../../ui/Labels/smallLabel"
import { Input } from "../../../ui/inputs/input"
import { StepOneCustomers } from "../../../types/CustomersForm/CustomersForm"
import { StepOneCustomerProps } from "../../../types/CustomersForm/CustomersForm"

export const StepOne: React.FC<StepOneCustomerProps> = ({register, setValue}) =>{
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
                        <Input 
                            type="string" 
                            className2={'py-5'} 
                            placeholder="Nombre de empresa"               
                            {...register('nombre')}  
                        />
                        <Input 
                            type="string" 
                            className2={'py-5'} 
                            placeholder="Ruc de empresa"               
                            {...register('ruc')}  
                        />
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

export const StepTwo: React.FC<StepOneCustomerProps> = ({register, setValue}) =>{
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
                            {...register('TelPersonaContacto')}  
                        />
                        <Input 
                            type="string" 
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
