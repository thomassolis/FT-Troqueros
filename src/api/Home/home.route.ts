import { request } from 'http';
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
export const DataForRequestTable = async ({tableSection, selectedOption, searchValue, currentPage, formattedDates}: RequestParams): Promise<Record<string, string>[]> => {        
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
        
        // Agregar parámetros de fecha si están disponibles
        if (formattedDates) {
            params.startDate = formattedDates.start; // "2025-07-08"
            params.endDate = formattedDates.end;     // "2025-07-19"
        }
        
        console.log('Parámetros que se envían: ', params);
        const response = await axios.get('/requests/see_requests', { params });        
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
    try{
        const response = await axios.patch('/requests/update_status_request', {
            id_peticion: id,
            status: status
        });
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

//Download Excel
interface DownloadRequestExcelProps {
    selectedOption?: string
    searchValue?:string
}
export const DownloadRequestExcel = async({selectedOption, searchValue, selectedTab, tableSections}: DownloadRequestExcelProps) => {
    console.log('SelectedOption', selectedOption);
    console.log('searchValue', searchValue);
    console.log('selectedTab', selectedTab);
    console.log('tableSections', tableSections);

    const params: Record<string, any> = {
      [selectedOption.value]: searchValue, // Mapeo dinámico del campo seleccionado
      status: tableSections[selectedTab]
    };
         
    try{
        const response = await axios.get('/download/download_request', {params, responseType: 'blob'})

        // Crear el archivo descargable
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'reporte.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();

    return response;
    }catch(error){
        console.error('Error en DownloadRequestExcel', error);
    }
}




//---------------------------------------------------------AGENDA----------------------------------------------