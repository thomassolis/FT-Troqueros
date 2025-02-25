import { PrevisualizationTab } from "../../ui/tabs/Tabs"
import { Button } from "../../ui/buttons/button"
import { Icon } from "@iconify/react/dist/iconify.js"
import { useState, useEffect } from "react"
import { Input } from "../../ui/inputs/input"
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom"
import { Back } from "../../ui/Back/Back"
interface submitData {
    id_chasis: string
}

export const VehicleParts = () =>{
    const [selectedOption, setSelectedOption] = useState<string>("")
    const vehicleParts: string[] = ["Chasises", "Cabezales", "Furgones"] 
    const { handleSubmit, formState: { errors } } = useForm<submitData>();
    const [searchValue, setSearchValue] = useState<string>("");
    const navigate = useNavigate();
    const location = useLocation();
    const onSubmit: SubmitHandler<submitData> = (data) => {
        console.log("Datos enviados:", data);
    };
    
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);        
    };     

    return(
        <div>
            <div className="flex w-[full] justify-between items-center mb-10">
                <Back text="PARTES DE MULA ACTUALES"/>           

                <div className="w-[15%]">
                <Button 
                    text={`Agregar ${selectedOption}`} 
                    hoverBgColor="bg-[#1B5316]" 
                    textColor="white" 
                    onClick={() => {
                        const newPath = location.pathname.includes(selectedOption) 
                            ? location.pathname 
                            : `${location.pathname}/${selectedOption}`;

                        console.log("🚀 Navegando a:", newPath);
                        navigate(newPath);
                    }} 
                />

                </div>              
            </div>            

            <div className="flex w-full items-center justify-center mb-5">

                <div className="flex w-[8%]  items-center justify-center py-2 border border-gray-400 bg-white">
                    <h1 className="text-black">Placa</h1>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="flex">
                    <div className="">                   
                            <Input 
                                type="text" 
                                placeholder={`Buscar ${selectedOption} por número de placa`} 
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
            
            <PrevisualizationTab 
                tabContent = {vehicleParts} 
                onTabChange={setSelectedOption}
                searchValue = {searchValue}
            />
        </div>
    )
}