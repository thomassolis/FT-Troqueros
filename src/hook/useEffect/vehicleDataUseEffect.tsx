import { useEffect, useState } from "react"
import { getVehicleData } from "../../api/Home/Vehicles/vehicles.routes"

interface getDataFromVehicleProps {
    vehicleType: string
    vehicleID: string
}
export const getDataFromVehicle = ({vehicleType, vehicleID}:getDataFromVehicleProps) =>{
    const [vehicleData, setVehicleData] = useState({});
    useEffect(()=>{        
        console.log('useEffect')
        const fetchVehicleData = async() =>{            
            try{
                console.log('getVehicleData({vehicleType, vehicleID});');
                const response = await getVehicleData({vehicleType, vehicleID});
                setVehicleData(response);
                console.log('Primer response',response)                
            }catch(error){
                console.log('Error en fetchVehiceData', error);
            }            
        }        
        fetchVehicleData();
    },[])
    return vehicleData
    
}