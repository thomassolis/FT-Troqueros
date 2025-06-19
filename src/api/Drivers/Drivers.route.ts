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
        const response = await axios.get('/drivers/see_drivers', {
            params:{
                page: page,
                limit: limit,
                search: search
            }
        });
        return response.data;        
    }catch(error){
        console.error('Error en GetFullDriversDataForTable', error);
    }
}
interface GetDriversDataByIDProps{
    driverID?: string;
}
export const GetDriversDataByID = async({driverID}:GetDriversDataByIDProps)=>{
    try{
        const response = await axios.get(`/drivers/see_driver_id/${driverID}`);        
        return response.data.data;
    }catch(error){
        console.error('Error en GetDriversDataByID', error);
    }
}

export const SendDataForNewDriver = async({data}:any) =>{
    try{
        const response = await axios.post('/drivers/add_driver', data,{
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
interface sendDataForUpdateDriversProps {
    driverID?: string;
    data: DriversFormValues;
}
export const sendDataForUpdateDrivers = async ({data, driverID}: sendDataForUpdateDriversProps) =>{
    const totalData = {
        ...data,
        id_conductor: driverID
    }

    try{
        const response = await axios.put('/drivers/update_driver', totalData,{
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

interface sendDataForDeleteDriversProps {
    id?: string;    
}
export const sendDataForDeleteDrivers = async({id}: sendDataForDeleteDriversProps) =>{
    const data = {
        id_conductor: id,
        active: false
    }
    try{
        const response = await axios.patch(`/drivers/activate_driver`, data);           
        return response.data
    }catch(error:any){
        console.error('Error en sendDataForDeleteDrivers', error);
        toast.error(error.response.data.message)
    }
}

//Cambio de status en conductores

interface changeDriverStatusStatus {
    id_conductor: string;
    status: string
}

export const changeDriverStatus = async({id_conductor, status}:changeDriverStatusStatus) => {
    try{
        const response = await axios.patch('/drivers/update_status_driver',{id_conductor, status} );
    }catch(error){
        console.error('Error en changeDriverStatus:', error);
    }
}