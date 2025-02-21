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
    console.log('DATA DE GetDataForPrevisualizationTable: ', tabSelected, page, limit)
    console.log('search recibido', search)
    try{   
        console.log(tabSelected);
        const response = await axios.get(`/${tabSelected}`, {
            params:{
                page: page,
                limit: limit,
                search: search
            }
        });
        console.log('TEST',response);

        if(response.data.success){
            return response.data;
        }else{
            toast.error(response.data.message);
        }
        
    }catch(error: any){
        console.log("Error en GetDataForPrevisualizationTable: ", error);

        // Verifica si el error tiene una respuesta del backend (AxiosError)
        if (error.response && error.response.data && error.response.data.message) {
            console.log('Mensaje del backend:', error.response.data.message);
            toast.error(error.response.data.message);
        } else {
            console.log('Error inesperado:', error.message || error);
            toast.error("Error inesperado");
        }           
        return null;
    }
}