import axios from "../axios.ts";
import { RequestsFormValues } from "../../components/types/forms/RequestsForm/requestsForm.ts";
import toast from "react-hot-toast";

interface SelectDataProps {
    type: string,
    serviceID?: number | string
    fecha_salida?:string | null
    hora_salida?: string | null
    requestID?: string
}

//Extrae toda la data para los select al momento de crear una petición
export const SelectData = async({type, serviceID, fecha_salida, hora_salida, requestID}: SelectDataProps) => {            
    const params = {
        fecha_salida: fecha_salida,
        hora_salida: hora_salida,
        IdPeticion: requestID
    }    
    try{
        let response;
        if(type==='services'){
            response = await axios.get(`requests/get_request_services`)            
            return response?.data.data;
        }else if(type === 'routes'){
            response = await axios.get(`requests/get_request_ruta_services/${serviceID}`)              
            return response?.data.data;
        }else if(type==='routesInfo'){
            response = await axios.get(`requests/get_request_data_services_id/${serviceID}`)
            return response?.data.data;
        }else if(type==='customers'){
            response = await axios.get(`requests/get_request_clients`)
            return response?.data.data;
        }else if(type==='providers'){
            response = await axios.get(`requests/get_request_suppliers`)
            return response?.data.data;
        } else if (type === 'drivers'){
            response = await axios.get(`requests/get_request_drivers`, {params});            
            return response?.data.data;
        } else if (type === 'chasis'){
            response = await axios.get(`requests/get_request_vehicles`, {params})
            return response?.data.data.chassis;
        } else if (type === 'cabezal'){
            response = await axios.get(`requests/get_request_vehicles`, {params})
            return response?.data.data.truckhead;
        } else if (type === 'furgon'){
            response = await axios.get(`requests/get_request_vehicles`, {params})
            return response?.data.data.truckvan;
        }

    }catch(error){
        console.error('Error en SelectData: ', error);
    }
}

interface CreateNewRequestProps {
    data: RequestsFormValues;
    requestID?:string;
    id_pedidoServicio?:string;
}

//Crea una nueva petición
export const CreateNewRequest = async({data}:CreateNewRequestProps) => {
    try{        
        const response = await axios.post('requests/add_request', data);        

        if(response.data.success){
            toast.success(response.data.message);
        }else{
            toast.error(response?.data?.message);
        }

        return response.data
    }catch(error:any){
        console.error('Error en CreateNewRequest:', error);
        toast.error(error.response.data.message || 'Error al crear la petición');
    }
}

//Obtiene los datos de 1 petición
interface GetRequestDataPerIDProps{
    requestID: string|undefined
}

export const GetRequestDataPerID = async ({requestID}:GetRequestDataPerIDProps) => {    
    try{
        const response = await axios.get(`requests/see_request_id/${requestID}`);                
        return response.data.data.data        
    }catch(error){
        console.error('Error en GetRequestDataPerID ', error);
    }
}

//Ruta para eliminar un servicio de una petición
export const DeleteServiceFromRequest = async(serviceID:string|number|undefined) => {
    try{
        const response = await axios.delete(`requests/delete_service_request/${serviceID}`);        
        return response.data        
    }catch(error){
        console.error('Error en DeleteServiceFromRequest', error);
    }
}


//Ruta para actualizar toda la petición seleccionada
export const EditRequestData = async ({data, requestID}: CreateNewRequestProps) => {    

    const totalData = {
        ...data,
        id_peticion:requestID
    }        
    try{
        const response = await axios.put('requests/update_request',totalData);
        if(response.data.success){
            toast.success(response.data.message);
        }else{
            toast.error(response.data.message);
        }
        return response.data;
    }catch(error:any){
        console.error('Error en EditRequestData ', error);
        toast.error(error.response.data.message);
    }
}   


//RUTA PARA ELIMINAR LOS COSTOS EXTRAS DE LA PETICIÓN
export const DeleteExtraprice = async(id:string |undefined|number) => {
    try{
        const response = await axios.delete(`requests/delete_extra_costs_request/${id}`);                
        return response.data;
    }catch(error){
        console.error('Error en DeleteExtraprice: ', error);
    }
}