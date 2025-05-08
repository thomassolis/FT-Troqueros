import { Search } from "lucide-react";
import axios from "../../axios.ts";
import { toast } from 'react-hot-toast';
import { FormValues } from "../../../components/types/VehicleForm/VehiclesFormTypes.tsx";
import { changeVehicleValue } from "../../../functions/changeVehicleType/changeVehicleType.ts";
interface GetDataForPrevisualizationTableProps {
    tabSelected: string;
    page: number;
    limit: number;
    search?: string;
}

//Tabla que mostrará los chasises, furgones y cabezales que hay en el sistema
export const GetDataForPrevisualizationTable = async({tabSelected, page, limit, search}: GetDataForPrevisualizationTableProps) => {        
    try{           
        const response = await axios.get(`/${tabSelected}`, {
            params:{
                page: page,
                limit: limit,
                search: search
            }
        });        

        if(response.data.success){
            return response.data;
        }else{
            toast.error(response.data.message);
        }
        
    }catch(error: any){
        console.log("Error en GetDataForPrevisualizationTable: ", error);

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
    try{
        const response = await axios.post(`/${vehicleType}/add`, data);       
        if(response.data.success){            
            toast.success(response.data.message);
            return response.data
        }else{            
            toast.error(response.data.message);
            return response.data
        }       
    }catch(error:any){
        console.log('Error en sendDataForCreation', error)
        toast.error(error.response.data.message)
    }

}

interface getVehicleDataProps{
    vehicleType: string
    vehicleID: string | undefined
}
export const getVehicleData = async({vehicleType, vehicleID}:getVehicleDataProps) =>{
    try{        
        const response = await axios.get(`/${vehicleType}/${vehicleID}`);
        console.log('response en getVehicleData',response)
        return response.data.data;
    }catch(error){
        console.log('Error en getVehicleData: ', error)
    }
}

interface sendDataForUpdateProps{
    data?:{};
    vehicleType:"Cabezales" | "Chasises" | "Furgones"
    vehicleID: string | undefined
    available?: string
}
export const sendDataForUpdate = async({data, vehicleType, vehicleID, available}:sendDataForUpdateProps) =>{
    console.log('data que envío para update: ', data, vehicleID, available);
    
    const dataForUpddate = {
            id: vehicleID,            
            ...data
          };
      console.log('DataForUpdateTest', dataForUpddate);
    try{
        const response = await axios.put(`/${vehicleType}/update`, dataForUpddate);
        if(response.data.success){
            toast.success(response.data.message)
            return response.data
        }else{
            toast.error(response.data.message)
            return response.data
        }
    }catch(error:any){
        console.log('error en sendDataForUpdate', sendDataForUpdate);
        toast.error(error.response.data.message)
    }
}
interface statusUpdate{
    vehicleType:"Cabezales" | "Chasises" | "Furgones";
    status: string;
    vehicleID: string | undefined
}
export const statusUpdate = async({vehicleType, vehicleID, status}: statusUpdate) =>{
    const data = {
        id: vehicleID,
        status: status
    }

    console.log('Data a enviar del status: ', data);
    try{
        const response = await axios.patch(`/${vehicleType}/update_status`, data);        
        console.log('response back',response);
    }catch(error){
        console.log('Error en statusUpdate: ', error)
    }
}

interface sendDataForDeleteProps{
    id?:string | undefined
    vehicleType? : string |undefined
}
export const sendDataForDelete = async({id, vehicleType}:sendDataForDeleteProps)=>{
    try{
        const response = await axios.delete(`/${vehicleType}/delete/${id}`);
        console.log('responseee:',response)

        return response.data
    }catch(error){
        console.log(error);
    }
}