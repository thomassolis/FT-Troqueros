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

interface RequestParams {
    tableSection: string    
}
interface UpdateRequestStatusParams {
    selectedOptions: {[key: number]: string}
}

//---------------------------------------------------------TABLA----------------------------------------------


//Data que requiere la tabla del home para mostrar los datos
export const DataForRequestTable = async ({tableSection}: RequestParams): Promise<Record<string, string>[]> => {    
    try {
        const response = await axios.get<DataResponse>('/home/homeTable', {
            params: {
                tableSection: tableSection
            }});

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

//Envío de id de petición y el status cada vez que se cambia en la interfaz para que se actualize en la bd
export const UpdateRequestStatus = async({selectedOptions}:UpdateRequestStatusParams): Promise<void> =>{
    console.log('selectedOptions desde useEffect: ',selectedOptions)
    try{
        const response = await axios.post('/home/updateRequest', selectedOptions);
    }catch(e){
        console.log('Error en: UpdateRequestStatus', e)
    }
}





//---------------------------------------------------------AGENDA----------------------------------------------