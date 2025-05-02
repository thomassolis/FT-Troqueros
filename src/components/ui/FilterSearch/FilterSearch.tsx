import { Button } from "../buttons/button"
import { Input } from "../inputs/input"
import { useForm, SubmitHandler } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { searchValueContext } from "../../../context/searchValueForFilter/searchValue";

interface FilterSearchProps{
    vehicleType?: string | null | undefined
}
interface submitData {
    id_chasis: string    
}

export const FilterSearch = ({vehicleType}:FilterSearchProps) =>{
        const { handleSubmit, formState: { errors } } = useForm<submitData>();
        const location = useLocation();
        const pathSegments = location.pathname.split('/').filter(Boolean); 
        const lastSegment = pathSegments[pathSegments.length - 1];
        const {searchValue, setSearchValue} = useContext(searchValueContext)!;

        const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {            
            console.log('setSearchValue2: ',setSearchValue);
                setSearchValue(event.target.value);        
                 
        };   
        const onSubmit: SubmitHandler<submitData> = (data) => {
            console.log("Datos enviados:", data);
        };

        useEffect(()=>{
            console.log('SearchValueee', searchValue);
        },[searchValue])
    return(
        <div className="flex">
                <div className="flex w-[8%] px-12  items-center justify-center py-2 border border-gray-400 bg-white">
                    <h1 className="text-black">
                        {lastSegment === 'Customers' ? ('Nombre'):('Placa')}                        
                    </h1>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="flex">
                <div className="">                   
                        <Input 
                            type="text" 
                            placeholder=
                                {lastSegment === 'Customers' ? (`Buscar cliente por nombre`):(`Buscar ${vehicleType} por número de placa`)}                                
                            
                            className2={"py-5 rounded-none border border-gray-400"}
                            onChange={handleInputChange}                                
                        />
                    
                </div>                

                <div className="">
                <Button 
                    type="submit" 
                    text="Buscar" 
                    hoverBgColor="bg-gray-200" 
                    className2={"py-2 rounded-none border border-gray-400"}                         
                />



                </div>
            </form>
        </div>                        
    )
}