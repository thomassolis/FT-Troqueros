import axios from "../axios.ts";
import { toast } from 'react-hot-toast';
import { FormValues } from "../../components/types/forms/VehicleForm/VehiclesFormTypes.tsx";
interface GetDataForPrevisualizationTableProps {
    tabSelected: string;
    page: number;
    limit: number;
    search?: string;
}

//Tabla que mostrará los chasises, furgones y cabezales que hay en el sistema
export const GetDataForPrevisualizationTable = async({tabSelected, page, limit, search}: GetDataForPrevisualizationTableProps) => {            
    let action = ''
    if(tabSelected==='Chasises'){
        action = 'see_chassis'
    }if(tabSelected==='Cabezales'){
        action = 'see_truckhead'
    }else if(tabSelected==='Furgones'){
        action = 'see_truckvan'
    }
    try{           
        const response = await axios.get(`/${tabSelected}/${action}`, {
            params:{
                page: page,
                limit: limit,
                search: search
            }
        });        

        if(response.data.success){
            return response.data;
        }else{
            // toast.error(response.data.message);
        }
        
    }catch(error: any){
        console.error("Error en GetDataForPrevisualizationTable: ", error);

        // Verifica si el error tiene una respuesta del backend (AxiosError)
        if (error.response && error.response.data && error.response.data.message) {            
            toast.error(error.response.data.message);
        } else {            
            toast.error("Error inesperado");
        }           
        return null;
    }
}

//creación de nuevos tipos de vehículos
interface sendDataForCreationProps{
    data:FormValues,
    vehicleType: string | undefined
}
export const sendDataForCreation = async({data, vehicleType}:sendDataForCreationProps) =>{       
    let action = ''
    if(vehicleType==='Chasises'){
        action = 'add_chassis'
    }if(vehicleType==='Cabezales'){
        action = 'add_truckhead'
    }else if(vehicleType==='Furgones'){
        action = 'add_truckvan'
    }
    try{
        const response = await axios.post(`/${vehicleType}/${action}`, data,{
                  headers: {
        'Content-Type': 'multipart/form-data',
      },
        });       
        if(response.data.success){            
            toast.success(response.data.message);
            return response.data
        }else{            
            toast.error(response.data.message);
            return response.data
        }       
    }catch(error:any){
        console.error('Error en sendDataForCreation', error)
        toast.error(error.response.data.message)
    }

}

interface getVehicleDataProps{
    vehicleType: string
    vehicleID: string | undefined
}
export const getVehicleData = async({vehicleType, vehicleID}:getVehicleDataProps) =>{
    let action = ''
    if(vehicleType==='Chasises'){
        action = 'see_chassis_id'
    }if(vehicleType==='Cabezales'){
        action = 'see_truckhead_id'
    }else if(vehicleType==='Furgones'){
        action = 'see_truckvan_id'
    }
    try{        
        const response = await axios.get(`/${vehicleType}/${action}/${vehicleID}`);        
        return response.data.data;
    }catch(error){
        console.error('Error en getVehicleData: ', error)
    }
}

interface sendDataForUpdateProps{
    data?:{};
    vehicleType:"Cabezales" | "Chasises" | "Furgones"
    vehicleID: string | undefined
    available?: string
}
export const sendDataForUpdate = async({data, vehicleType, vehicleID}:sendDataForUpdateProps) =>{
    
    let action = ''
    if(vehicleType==='Chasises'){
        action = 'update_chassis'
    }if(vehicleType==='Cabezales'){
        action = 'update_truckhead'
    }else if(vehicleType==='Furgones'){
        action = 'update_truckvan'
    }

    const dataForUpddate = {
            id: vehicleID,            
            ...data
          };          
    try{
        const response = await axios.put(`/${vehicleType}/${action}`, dataForUpddate,{
            headers:{
                'Content-Type': 'multipart/form-data'
            }
        });
        if(response.data.success){
            toast.success(response.data.message)
            return response.data
        }else{
            toast.error(response.data.message)
            return response.data
        }
    }catch(error:any){
        console.error('error en sendDataForUpdate', sendDataForUpdate);
        toast.error(error.response.data.message)
    }
}
interface statusUpdate{
    vehicleType:"Cabezales" | "Chasises" | "Furgones";
    status: string;
    vehicleID: string | undefined
}
export const statusUpdate = async({vehicleType, vehicleID, status}: statusUpdate) =>{    
    let action = ''
    if(vehicleType==='Chasises'){
        action = 'update_status_chassis'
    }if(vehicleType==='Cabezales'){
        action = 'update_status_truckhead'
    }else if(vehicleType==='Furgones'){
        action = 'update_status_truckvan'
    }

    const data = {
        id: vehicleID,
        status: status
    }
    
    try{        
        await axios.patch(`/${vehicleType}/${action}`, data);        
    }catch(error){
        console.error('Error en statusUpdate: ', error)
    }
}

interface sendDataForDeleteProps{
    id?:string | undefined
    vehicleType? : string |undefined
}
export const sendDataForDelete = async({id, vehicleType}:sendDataForDeleteProps)=>{

    let action = ''
    let data = {} 
    
    if(vehicleType==='Chasises'){
        action = 'active_chassis'        
        data = {id_chasis:id, active:false}
    }if(vehicleType==='Cabezales'){
        action = 'activate_truckhead'
        data = {id_cabezal:id, active:false}
    }else if(vehicleType==='Furgones'){
        action = 'activate_truckvan'
        data = {id_furgon:id, active:false}
    }
    

    try{
        let response;
        
        response = await axios.patch(`/${vehicleType}/${action}`, data);
        
        return response?.data
    }catch(error){
        console.error(error);
        toast.error('Error al eliminar vehículo')
    }
}