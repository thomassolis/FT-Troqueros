import axios from "../axios.ts";
import toast from "react-hot-toast";
import { ProvidersFormValues } from "../../components/types/forms/ProvidersForm/providersForm.ts";

interface GetProvidersProps {    
    page: number;
    limit: number;
    search?: string;
}
//Obtiene todos los proveedores actuales
export const GetProviders = async({page, limit, search}: GetProvidersProps) =>{    
    try{
        const response = await axios.get('/suppliers/see_suppliers',{
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
    }catch(error:any){
        console.error('Error en GetProviders: ', error);
        
    }
}
//Crea nuevos proveedores
export const createNewProvider = async({data}:any) => {
    try{
        const response = await axios.post('/suppliers/add', data);        

        if(response.data.success){
            toast.success(response.data.message);
        }else{
            toast.error(response.data.message);
        }
        return response.data;
    }catch(error: any){
        console.error('Error en createNewProvider:', error)
        toast.error(error.response.data.message);
    }
}
//Obtiene la información de cada proveedor individual
export const getProvidersDataByID = async({providerID}:any) => {

    try{
        const response = await axios.get(`/suppliers/see_supplier_id/${providerID}`)        
        return response.data.data;
    }catch(error:any){
        console.error('Error en getProvidersDataByID', error);
    }
}
//Actualiza la información de un proveedor
export const updateProvidersInfo = async ({data, providerID}:any) =>{
    const totalData = {
        ...data,
        id_proveedor: providerID
    }
    try{
        const response = await axios.put('/suppliers/update_supplier', totalData);
        if(response.data.success){
            toast.success(response.data.message)
        }else{
            toast.error(response.data.message)
        }

        return response.data;
    }catch(error:any) {
        console.error('Error en updateProvidersInfo: ', error);
        toast.error(error.response.data.message)
    }
}

//Elimina un proveedor
export const sendDataForDeleteProviders = async({id}:any) => {
    const totalData = {
        id_proveedor: id,
        active: false
    }
    try{
        const response = await axios.patch('suppliers/activate_supplier',totalData)
        if(response.data.success){
            toast.success(response.data.message)
        }else{
            toast.error(response.data.message)
        }

        return response.data;
    }catch(error:any){
        console.error('Error en deleteProviders: ', error);
    }
}