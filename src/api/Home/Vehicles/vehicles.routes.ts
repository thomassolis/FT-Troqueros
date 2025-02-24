import { Search } from "lucide-react";
import axios from "../../axios.ts";
import { toast } from 'react-hot-toast';

interface GetDataForPrevisualizationTableProps {
    tabSelected: string;
    page: number;
    limit: number;
    search?: string;
}

export const GetDataForPrevisualizationTable = async({tabSelected, page, limit, search}: GetDataForPrevisualizationTableProps) => {        
    try{           
        const response = await axios.get(`/${tabSelected}`, {
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