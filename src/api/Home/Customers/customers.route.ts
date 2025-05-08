import axios from "../../axios.ts";
import toast from "react-hot-toast";
import { CustomersFormValues } from "../../../components/types/CustomersForm/CustomersForm.tsx";

interface GetDataForPrevisualizationTableCustomersProps{
    page: number;
    limit: number;
    search?: string;
}

//Tabla que mostrará los chasises, furgones y cabezales que hay en el sistema
export const GetDataForPrevisualizationTableCustomers = async({page, limit, search}: GetDataForPrevisualizationTableCustomersProps) => { 
    console.log('search: ',search)
    try{           
        const response = await axios.get('/clients', {
            params:{
                page: page,
                limit: limit,
                search: search
            }
        });        
        console.log('customers', response)       
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

interface GetCustomerDataByIDProps{
    clienteID: string | undefined
}
export const GetCustomerDataByID = async({clienteID}: GetCustomerDataByIDProps) =>{
    console.log('clientee', clienteID);
    try{
        const response =await axios.get(`/clients/${clienteID}`)
        console.log('respuesta: ', response);
        return response.data.data;
    }catch(error){
        console.log('Error en GetCustomerDataByID', error)
    }
}
interface SendDataForCreationCustomerProps{
    data: CustomersFormValues;    
}
export const SendDataForCreationCustomer = async({data}: SendDataForCreationCustomerProps) =>{
    try{
        const response = await axios.post('/clients/add', data);
        if (response.data.success){
            toast.success(response.data.message)            
        }else{
            toast.error(response.data.message)            
        }        
        return response.data
    }catch(error){
        console.log('Error en SendDataForCreationCustomer', error)
    }
}
interface SendDataForUpdateCustomerProps{    
    clienteID: string | undefined;
    data: CustomersFormValues;
}
export const sendDataForUpdateCustomers = async({data, clienteID}: SendDataForUpdateCustomerProps)=>{

    const totalData = {
        ...data,
        id: clienteID
    }
    try{
        const response = await axios.put('/clients/update', totalData);
        if(response.data.success){
            toast.success(response.data.message);
        }else{
            toast.error(response.data.message);
        }
        return response.data;
    }catch(error){
        console.log('Error en sendDataForUpdateCustomers', error)
    }
}

interface sendDataForDeleteCustomersProps{
    id: string | undefined;    
}
export const sendDataForDeleteCustomers = async({id}:sendDataForDeleteCustomersProps)=>{
    console.log('iddd', id);
    try{
        const response = await axios.delete(`/delete/${id}`);
        console.log('responseee:',response)

        return response.data
    }catch(error){
        console.log(error);
    }
}