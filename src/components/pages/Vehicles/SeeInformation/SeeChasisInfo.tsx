import { useEffect, useState } from "react"
import { getVehicleData } from "../../../../api/Home/Vehicles/vehicles.routes"
import { useContext } from "react"
import { vehicleTypeContext } from "../../../../context/vehicleType/vehicleType"
import { useParams } from "react-router-dom"
import { Back } from "../../../ui/Back/Back"
import { PrevisualizationTab } from "../../../ui/tabs/Tabs"
import { InformationTab } from "../../../ui/tabs/informationTabs"
import { GetModuleFromURL } from "../../../../functions/GetURL/GetURLInfo"
import { GetCustomerDataByID } from "../../../../api/Home/Customers/customers.route"

export const SeeChasis = () =>{
    const {vehicleType} = useContext(vehicleTypeContext)!;
    const {vehicleID} = useParams();
    const {clienteID} = useParams();
    const [vehicleData, setVehicleData] = useState({});
    const module = GetModuleFromURL()
    console.log('vehicle: ', module)
    console.log('ID: ', clienteID)
    

    useEffect(()=>{
        
            const chasisInformation = async() =>{
                try{
                    let response:any;
                    
                    if(module === 'Chasises'||module === 'Furgones'|| module === 'Cabezales'){
                        response = await getVehicleData({vehicleType, vehicleID});
                    }if(module === 'Customers'){
                        response = await GetCustomerDataByID({clienteID});
                    }
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
            <Back text={module==='Customers' ? (
                    'Información de Cliente'                
                ): module ==='Chasises'?(
                    'Información de Chasis'                
                ): module ==='Furgones'?(
                    'Información de Furgón'                
                ): module ==='Cabezales'?(
                    'Información de Cabezal'                
                ):null
                }/>        
            <InformationTab 
                tabTitles={
                    module === 'Vehicles'
                    ? ['Información', 'Mantenimiento', 'Documentos']
                    : ['Información', 'Documentos', 'Historial']
                }
                vehicleData={vehicleData}
                />

        </section>
    )   
}