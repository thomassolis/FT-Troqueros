import axios from '../axios.ts'
import toast from 'react-hot-toast';

interface GetFullDriversDataForTableProps{
    page: number;
    limit: number;
    search?: string;
}

export interface DriversFormValues {
    nombre: string;
    apellido: string;
    cedula: string;    
    email: string;
    pass: string;
    telefono: string;
    tipo_licencia?:string;    
  }


export const GetFullDriversDataForTable = async({page, limit, search}: GetFullDriversDataForTableProps) =>{
    try{
        const response = await axios.get('/drivers', {
            params:{
                page: page,
                limit: limit,
                search: search
            }
        });
        return response.data;        
    }catch(error){
        console.log('Error en GetFullDriversDataForTable', error);
    }
}
interface GetDriversDataByIDProps{
    driverID?: string;
}
export const GetDriversDataByID = async({driverID}:GetDriversDataByIDProps)=>{
    console.log('DRIVER ID', driverID);
    try{
        const response = await axios.get(`/drivers/${driverID}`);        
        return response.data.data;
    }catch(error){
        console.log('Error en GetDriversDataByID', error);
    }
}

export const SendDataForNewDriver = async({data}:any) =>{
    try{
        const response = await axios.post('/drivers/add', data,{
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
        console.log('Error en sendDataForCreation', error)
        toast.error(error.response.data.message)
    }
}
interface sendDataForUpdateDriversProps {
    driverID?: string;
    data: DriversFormValues;
}
export const sendDataForUpdateDrivers = async ({data, driverID}: sendDataForUpdateDriversProps) =>{
    const totalData = {
        ...data,
        id_conductor: driverID
    }
    console.log('totalData', totalData);
    try{
        // console.log('totalData', totalData)
        const response = await axios.put('/drivers/update', totalData,{
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
        console.log('Error en sendDataForUpdateCustomers', error)
    }
}

interface sendDataForDeleteDriversProps {
    id?: string;    
}
export const sendDataForDeleteDrivers = async({id}: sendDataForDeleteDriversProps) =>{
    try{
        const response = await axios.delete(`/drivers/delete/${id}`);           
        return response.data
    }catch(error:any){
        console.error('Error en sendDataForDeleteDrivers', error);
        toast.error(error.response.data.message)
    }
}