import axios from "../../axios.ts";
import toast from "react-hot-toast";

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