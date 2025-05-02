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
    console.log('search: ',search)
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
    vehicleID: string
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

export const sendDataForUpdate = async({data, vehicleType, vehicleID}:any) =>{
    console.log('data que envío para update: ', data, vehicleID);
    const vehicle = changeVehicleValue(vehicleType);



    console.log('vehicle: ',vehicle)
    
    const dataForUpddate = {
        id: vehicleID,
        ...data
      };
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

interface sendDataForDeleteProps{
    id:string
    vehicleType:string
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