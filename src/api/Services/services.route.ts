import axios from "../axios.ts";
import toast from "react-hot-toast";
import { AxiosError } from 'axios';
import { serviceTypes } from "../../components/types/forms/ServiceForm/serviceTypesForm.ts";

interface GetServicesProps {    
    page: number;    
    search?: string;
}

//Ruta que obtiene todos los servicios que están en la BD
export const GetServices = async({search, page}:GetServicesProps) =>{      
    try{
        const response = await axios.get('/services/see_services', {
            params:{
                search,
                page
            }
        });
        return response.data        
    }catch(error:any){
        console.error('Error en GetProviders: ', error);
        
    }
}

// Ruta que permite actualizar o eliminar un servicio
export const ServicesActions = async(actionType: 'update'|'delete', id_servicio:string, name?:string) => {    
    try{
        let response;        
        let serviceData

        if(actionType==='update'){
          //Data para actualizar un registro
          serviceData = {
            id_servicio: id_servicio,
            nombre_servicio: name
          }
          response = await axios.put(`/services/update_services`, serviceData);
        }else if(actionType==='delete') {
            serviceData = {
              id_servicio: id_servicio,
              active: false
            }
            response = await axios.patch(`/services/activate_service`, serviceData);
        }     

        if(response?.data.success){
            toast.success(response.data.message);
        }else {
            toast.error(response?.data.message);
        }        

        return response?.data;
    }catch(error: unknown){
        const axiosError = error as AxiosError<{ message: string }>;
        if (axiosError.response?.data?.message) {
          toast.error(axiosError.response.data.message);
        } else {
          toast.error('Ocurrió un error inesperado');
        }
        console.error('Error en ServicesActions', error);                            
    }
}

// Routes Actions
// Types
type ActionType = 'update' | 'delete' | 'add';


// Función que permite eliminar o actualizar una ruta
export const RoutesActions = async (actionType: ActionType, updateRouteData:any) => {  
  
  try {
    let response;
    let data;

    if (actionType === 'update') {      
      response = await axios.put(`/services/update_services/services_data/`, updateRouteData);
    } else if (actionType === 'delete') {

      data = {
        id_servicio_datos: updateRouteData,
        active: false
      }
      response = await axios.patch(`/services/activate_service_data`, data)


    } else if (actionType==='add'){      
      data = {
        id_servicio: updateRouteData.id_servicio,
        lugar_destino: updateRouteData.lugar_destino,
        lugar_origen: updateRouteData.lugar_origen,
        tarifa: updateRouteData.tarifa,
        tiempo_estimado: updateRouteData.tiempo_estimado,
      }
      response = await axios.post(`/services/add_services/services_data`, data);
    }

    if(response?.data.success){
      toast.success(response.data.message)
    }else{
      toast.error(response?.data.message)
    }

    return response?.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message: string }>;
    console.error('Error en RoutesActions:', error);

    if (axiosError.response?.data?.message) {
      toast.error(axiosError.response.data.message);
    } else {
      toast.error('Ocurrió un error inesperado');
    }
  }
};


//Function for create a new service with its routes

export const CreateNewService = async(formData:serviceTypes) => {  
  try{
    const response = await axios.post('/services/add_services', formData);
    
    if(response.data.success){
      toast.success(response.data.message);      
    }else{
      toast.error(response.data.message);      
    }
    return response.data;
  }catch(error:unknown){
    const axiosError = error as AxiosError<{ message: string }>;
    console.error('Error en CreateNewService', error)

    if (axiosError.response?.data?.message) {
      toast.error(axiosError.response.data.message);
    } else {
      toast.error('Ocurrió un error inesperado');
    }
    
  }
}