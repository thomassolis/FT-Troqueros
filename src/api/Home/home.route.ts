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
    selectedOptions: {[key: number]: string}
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
    console.log('CurrentPage', currentPage);
    const page = Number(currentPage)
    console.log('tableSection: ', tableSection);
    console.log('selectedOption: ', selectedOption);
    console.log('searchValue: ', searchValue);
    try {

                // Crear objeto de parámetros dinámicamente
        const params: Record<number, string> = {
            // tableSection: tableSection,
            page: page, // Ajusta según necesites
            status: tableSection // Ajusta según necesites
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
export const UpdateRequestStatus = async({selectedOptions}:UpdateRequestStatusParams): Promise<void> =>{
    
    try{
        const response = await axios.post('/home/updateRequest', selectedOptions);
    }catch(e){
        console.error('Error en: UpdateRequestStatus', e)
    }
}





//---------------------------------------------------------AGENDA----------------------------------------------