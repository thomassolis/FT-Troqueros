import axios from "../axios.ts";
import { RequestsFormValues } from "../../components/types/forms/RequestsForm/requestsForm.ts";
import toast from "react-hot-toast";

interface SelectDataProps {
    type: string,
    serviceID?: number | string
}
export const SelectData = async({type, serviceID}: SelectDataProps) => {    
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
            response = await axios.get(`requests/get_request_drivers`)
            return response?.data.data;
        } else if (type === 'chasis'){
            response = await axios.get(`requests/get_request_vehicles`)
            return response?.data.data.chassis;
        } else if (type === 'cabezal'){
            response = await axios.get(`requests/get_request_vehicles`)
            return response?.data.data.truckhead;
        } else if (type === 'furgon'){
            response = await axios.get(`requests/get_request_vehicles`)
                    console.log('response',response)
            return response?.data.data.truckvan;
        }

        
        console.log('response',response)
        // return response?.data.data;

    }catch(error){
        console.error('Error en SelectData: ', error);
    }
}

interface CreateNewRequestProps {
    data: RequestsFormValues;
}
export const CreateNewRequest = async({data}:CreateNewRequestProps) => {
    try{
        console.log('data',data)
        const response = await axios.post('requests/add_request', data);
        console.log('response',response)

        if(response.data.success){
            toast.success(response.data.message);
        }else{
            toast.error(response.data.message);
        }

        return response.data
    }catch(error:any){
        console.error('Error en CreateNewRequest:', error);
        toast.error(error.response.data.message || 'Error al crear la solicitud');
    }
}

