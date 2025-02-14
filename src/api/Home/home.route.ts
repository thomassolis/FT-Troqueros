import axios from '../axios.ts'
import toast from 'react-hot-toast';

interface statusResponse {
    success: boolean;
    message: string;
}

interface DataResponse {
    status: statusResponse | null;
    data: Record<string, string>[];
}

export const DataForRequestTable = async (): Promise<Record<string, string>[]> => {
    try {
        const response = await axios.get<DataResponse>('/home/homeTable');

        // Acceder correctamente al success
        if (response.data?.status?.success) {
            return response.data.data             
        } else {       
            toast.error(response.data?.status?.message || "Error desconocido en la respuesta");
            return  []             
        }
        
    } catch (e) {
        console.error('Error en DataForRequestTable:', e);
        return [] 
        
    }
};

