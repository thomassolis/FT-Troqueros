import { useEffect, useState } from "react"
import { getVehicleData } from "../../api/Vehicles/vehicles.routes"

interface getDataFromVehicleProps {
    vehicleType: string
    vehicleID: string
}
export const getDataFromVehicle = ({vehicleType, vehicleID}:getDataFromVehicleProps) =>{
    const [vehicleData, setVehicleData] = useState({});
    useEffect(()=>{        

        const fetchVehicleData = async() =>{            
            try{
                const response = await getVehicleData({vehicleType, vehicleID});
                setVehicleData(response);            
            }catch(error){
                console.log('Error en fetchVehiceData', error);
            }            
        }        
        fetchVehicleData();
    },[])
    return vehicleData
    
}