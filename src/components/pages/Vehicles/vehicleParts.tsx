import { PrevisualizationTab } from "../../ui/tabs/Tabs"
import { Button } from "../../ui/buttons/button"
import { vehicleTypeContext } from "../../../context/vehicleType/vehicleType"
import { useState, useEffect } from "react"
import { Input } from "../../ui/inputs/input"
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom"
import { Back } from "../../ui/Back/Back"
import { useContext } from "react"
import { FilterSearch } from "../../ui/FilterSearch/FilterSearch"


export const VehicleParts = () =>{
    const { vehicleType, setVehicleType } = useContext(vehicleTypeContext)!;
    // const [selectedOption, setSelectedOption] = useState<string>("")
    const vehicleParts: string[] = ["Chasises", "Cabezales", "Furgones"] 
    const navigate = useNavigate();
    const location = useLocation();

    return(
        <div>
            <div className="flex w-[full] justify-between items-center mb-10">
                <Back text="PARTES DE MULA ACTUALES"/>           

                <div className="w-[15%]">
                <Button 
                    text={`Agregar ${vehicleType}`} 
                    hoverBgColor="bg-[#1B5316]" 
                    bgColor='bg-red-400'
                    textColor="white" 
                    onClick={() => {
                        const newPath = location.pathname.includes(vehicleType) 
                            ? location.pathname 
                            : `${location.pathname}/${vehicleType}`;                        
                        navigate(`${newPath}/create`);
                    }} 
                />

                </div>              
            </div>            

            <div className="flex w-full items-center justify-center mb-5">
                <FilterSearch vehicleType = {vehicleType}/>
            </div>            
            
            <PrevisualizationTab 
                tabContent = {vehicleParts} 
                onTabChange={setVehicleType}                
            />
        </div>
    )
}