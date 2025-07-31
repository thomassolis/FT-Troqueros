import axios from "../axios.ts";
import toast from "react-hot-toast";
import { CustomersFormValues } from "../../components/types/forms/CustomersForm/CustomersForm.tsx";

interface GetDataForPrevisualizationTableCustomersProps{
    page: number;
    limit: number;
    search?: string;
}

//Tabla que mostrará los chasises, furgones y cabezales que hay en el sistema
export const GetDataForPrevisualizationTableCustomers = async({page, limit, search}: GetDataForPrevisualizationTableCustomersProps) => {     
    try{           
        const response = await axios.get('/clients/see_clients', {
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

interface GetCustomerDataByIDProps{
    clienteID: string | undefined
}
export const GetCustomerDataByID = async({clienteID}: GetCustomerDataByIDProps) =>{    
    try{
        const response =await axios.get(`/clients/see_clients_id/${clienteID}`)                
        return response.data.data;
    }catch(error){
        console.error('Error en GetCustomerDataByID', error)
    }
}
interface SendDataForCreationCustomerProps{
    data: CustomersFormValues;    
}
export const SendDataForCreationCustomer = async({data}: SendDataForCreationCustomerProps) =>{        
    try{        
        const response = await axios.post('/clients/add_client', data,{
        headers: {
        'Content-Type': 'multipart/form-data',
      },
        });
        if (response.data.success){
            toast.success(response.data.message)            
        }else{
            toast.error(response.data.message)            
        }        
        return response.data
    }catch(error:any){
        console.error('Error en SendDataForCreationCustomer', error)
        toast.error(error.response.data.message)
    }
}
interface SendDataForUpdateCustomerProps{    
    clienteID: string | undefined;
    data: CustomersFormValues;
}
export const sendDataForUpdateCustomers = async({data, clienteID}: SendDataForUpdateCustomerProps)=>{
    
    const totalData = {
        ...data,
        id_cliente: clienteID
    }    
    try{
        const response = await axios.put('/clients/update_client', totalData,{
            headers:{
                'Content-Type': 'multipart/form-data'
            }
        });
        if(response.data.success){
            toast.success(response.data.message);
        }else{
            toast.error(response.data.message);
        }
        return response.data;
    }catch(error:any){
        toast.error(error.response.data.message)
        console.error('Error en sendDataForUpdateCustomers', error)
    }
}

interface sendDataForDeleteCustomersProps{
    id: string | undefined;    
}
export const sendDataForDeleteCustomers = async({id}:sendDataForDeleteCustomersProps)=>{
    const data = {
        id_cliente: id,
        active: false
    }
    try{
        const response = await axios.patch(`/clients/activate_client`, data);

        return response.data
    }catch(error){
        console.error(error);
    }
}