import { PrevisualizationTab } from "../../ui/tabs/Tabs"
import { Button } from "../../ui/buttons/button"
import { vehicleTypeContext } from "../../../context/vehicleType/vehicleType"
import { useNavigate, useLocation } from "react-router-dom"
import { Back } from "../../ui/Back/Back"
import { useContext } from "react"
import { FilterSearch } from "../../ui/FilterSearch/FilterSearch"
import { changeVehicleValue } from "../../../functions/changeVehicleType/changeVehicleType"
import { AuthContext } from "../../../context/auth/authProvider"
export const VehicleParts = () =>{
    const { vehicleType, setVehicleType } = useContext(vehicleTypeContext)!;
    // const [selectedOption, setSelectedOption] = useState<string>("")
    const vehicleParts: string[] = ["Chasises", "Cabezales", "Furgones"] 
    const navigate = useNavigate();
    const location = useLocation();
    const {userRole} = useContext(AuthContext)!;

    const vehicle = changeVehicleValue(vehicleType)
    return(
        <div>
            <div className="flex w-[full] justify-between items-center mb-10">
                <Back 
                    text="PARTES DE MULA ACTUALES"
                    redirectTo="/home"
                />           

                <div className="w-[15%]">
                <Button 
                    text={`Agregar ${vehicle}`} 
                    hoverBgColor="bg-[#1B5316]" 
                    bgColor='bg-[#1B5316]'
                    textColor="white" 
                    onClick={() => {
                        const newPath = location.pathname.includes(vehicleType) 
                            ? location.pathname 
                            : `${location.pathname}/${vehicleType}`;                        
                        navigate(`${newPath}/create`);
                    }} 
                disabled={
                    userRole != 'ADM'? true: false
                }
                />

                </div>              
            </div>            

            <div className="flex w-full items-center justify-center mb-5">                
                <FilterSearch vehicleType = {vehicleType}/>
            </div>            
            
            <PrevisualizationTab 
                tabContent = {vehicleParts} 
                onTabChange={(opt: string) => setVehicleType?.(opt)}
            />
        </div>
    )
}