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
    selectedOption: null | {
        value: string;
        label: string
    };
    searchValue: string | null
    currentPage:number
}
interface UpdateRequestStatusParams {
    // selectedOptions: {[key: number]: string}
    status:string,
    id: string
}

//---------------------------------------------------------TABLA----------------------------------------------
const optionToApiParam = {
  id: 'idPeticion',
  nameService: 'nameService',
  nameDriver: 'nameDriver',
  nameCustomer: 'nameCustomer'
} as const;

type ApiParam = keyof typeof optionToApiParam;

//Data que requiere la tabla del home para mostrar los datos
export const DataForRequestTable = async ({tableSection, selectedOption, searchValue, currentPage}: RequestParams): Promise<Record<string, string>[]> => {        
    console.log('tableSection:',tableSection);
    const page = Number(currentPage)    
    try {

                // Crear objeto de parámetros dinámicamente
        const params: Record<string, string | number> = { 
            page: page, 
            status: tableSection 
        };

        // Si hay una opción seleccionada, agregar el parámetro correspondiente
        if (selectedOption?.value) {
            const apiParam = optionToApiParam[selectedOption.value as ApiParam];
            params[apiParam] = searchValue || ''; // Usar searchValue como valor
        }

        const response = await axios.get('/requests/see_requests', { params });
        console.log('Response22: ', response);

        // Acceder correctamente al success
        if (response.data?.success) {
            return response.data.data   
        } else {       
            toast.error(response.data?.status?.message || '');
            return  []             
        }
        
    } catch (e) {
        console.error('Error en DataForRequestTable:', e);
        return [] 
        
    }
};

//Envío de id de petición y el status cada vez que se cambia en la interfaz para que se actualize en la bd
export const UpdateRequestStatus = async({status, id}:UpdateRequestStatusParams): Promise<void> =>{
    console.log('UpdateRequestStatus',status, id);
    try{
        const response = await axios.patch('/requests/update_status_request', {
            id_peticion: id,
            status: status
        });
        console.log('response: ',response)
        if(response.data.success){
            toast.success(response.data.message)
        }else{
            toast.error(response.data.message)
        }        
    }catch(e:any){
        toast.error(e.response.data.message)
        console.error('Error en: UpdateRequestStatus', e)
    }
}

//Cambio en el status de las peticiones





//---------------------------------------------------------AGENDA----------------------------------------------