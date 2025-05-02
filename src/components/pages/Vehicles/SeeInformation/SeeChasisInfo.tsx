import { useEffect, useState } from "react"
import { getVehicleData } from "../../../../api/Home/Vehicles/vehicles.routes"
import { useContext } from "react"
import { vehicleTypeContext } from "../../../../context/vehicleType/vehicleType"
import { useParams } from "react-router-dom"
import { Back } from "../../../ui/Back/Back"
import { PrevisualizationTab } from "../../../ui/tabs/Tabs"
import { InformationTab } from "../../../ui/tabs/informationTabs"


export const SeeChasis = () =>{
    const {vehicleType} = useContext(vehicleTypeContext)!;
    const {vehicleID} = useParams();
    const [vehicleData, setVehicleData] = useState({});


    useEffect(()=>{
        const chasisInformation = async() =>{
            try{
                const response = await getVehicleData({vehicleType, vehicleID});
                console.log('response::',response)
                setVehicleData(response);
            }catch(error){
                console.log('Error en chasisInformation: ', error)
            }
        }
        chasisInformation();
    },[])
    return(
        <section className="flex flex-col">
            <Back text={`Información de ${vehicleType}`}/>        
            <InformationTab tabTitles = {['Información', 'Mantenimiento', 'Documentos']} vehicleData={vehicleData}/>
        </section>
    )   
}