import axios from "../axios.ts";

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


