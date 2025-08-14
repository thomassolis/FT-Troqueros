import axios from '../axios.ts'
import toast from 'react-hot-toast';

interface RequestParams {
    tableSection: string  | undefined  
    selectedOption: null | {
        value: string;
        label: string
    };
    searchValue: string | null
    currentPage:number
    // formattedDates?: {
    //     start: string | number;
    //     end: string | number;
    // };

    formattedDates: { start: string | number | null; end: string | number | null; }

}
interface UpdateRequestStatusParams {
    // selectedOptions: {[key: number]: string}
    status:string,
    id: string | number
}

//---------------------------------------------------------TABLA----------------------------------------------
const optionToApiParam = {
  id: 'idPeticion',
  nameService: 'nameService',
  nameDriver: 'nameDriver',
  nameCustomer: 'nameCustomer',
  sh: 'sh',
  num_contenedor: 'num_contenedor',
  numero_factura: 'numero_factura'
} as const;

type ApiParam = keyof typeof optionToApiParam;

//Data que requiere la tabla del home para mostrar los datos
export const DataForRequestTable = async ({tableSection, selectedOption, searchValue, currentPage, formattedDates}: RequestParams): Promise<Record<string, string>[]> => {            
    const page = Number(currentPage)        
    try {
        // Crear objeto de parámetros dinámicamente
        const params: Record<string, string | number | undefined> = { 
            page: page, 
            status: tableSection 
        };

        // Si hay una opción seleccionada, agregar el parámetro correspondiente
        if (selectedOption?.value) {
            const apiParam = optionToApiParam[selectedOption.value as ApiParam];
            params[apiParam] = searchValue || ''; // Usar searchValue como valor
        }
        
        // Agregar parámetros de fecha si están disponibles
        if (formattedDates?.start != null && formattedDates?.end != null) {
            params.startDate = formattedDates.start; // "2025-07-08"
            params.endDate = formattedDates.end;     // "2025-07-19"
        }
                
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
export const UpdateRequestStatus = async (
  { status, id }: UpdateRequestStatusParams
): Promise<{ success: boolean; message: string }> => {    
  try {
    const response = await axios.patch('/requests/update_status_request', {
      id_peticion: id,
      status: status
    });

    if (response.data.success) {
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }

    return response.data;
  } catch (e: any) {
    toast.error(e.response.data.message);
    console.error('Error en: UpdateRequestStatus', e);
    return { success: false, message: e.response.data.message }; // para evitar undefined
  }
};


//Download Excel
interface DownloadRequestExcelProps {
    selectedOption: { value: string; label: string; } | null
    searchValue:string | null
    selectedTab: number
    tableSections?: string[]
    formattedDates: { start: string | null; end: string | null; }
}
export const DownloadRequestExcel = async({selectedOption, searchValue, selectedTab, tableSections, formattedDates}: DownloadRequestExcelProps) => {    
    // Mapeo específico según tus requerimientos
    const getApiParam = (value: string) => {
        return value === 'id' ? 'idPeticion' : value;
    };

    const params: Record<string, any> = {
        status: tableSections?.[selectedTab]
    };

    // Solo agregar el parámetro de búsqueda si hay un valor seleccionado y un valor de búsqueda
    if (selectedOption && searchValue) {
        const apiParam = getApiParam(selectedOption.value);
        params[apiParam] = searchValue;
    }

    // Agregar parámetros de fecha si están disponibles
    if (formattedDates) {
        params.startDate = formattedDates.start;
        params.endDate = formattedDates.end;
    }
         
    try {        
        const response = await axios.get('/download/download_request', {params, responseType: 'blob'});

        // Crear el archivo descargable
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'reporteTroqueros.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();

        return response;
    } catch(error) {
        console.error('Error en DownloadRequestExcel', error);
        throw error;
    }
}

export const ChangeBilledStatus = async (status:boolean, id:string) => {    
    const data = {
        status: status,
        idPeticion: id
    }
    try{
        await axios.post('/requests/update_billed_status_request', data)        
    }catch(error){
        console.error('Error en ChangeBilledStatus: ', error);
    }
}



//---------------------------------------------------------AGENDA----------------------------------------------

export const getDataForCalendar = async () => {
    try{
        const response = await axios.get('/agenda/get_agenda')        
        return response.data.data;
    }catch(error){
        console.error('Error en getDataForCalendar', error);
    }
}

export const vacioEntregadoStatus = async (value:boolean, id:number) => {
    try{
        const response = await axios.post('/agenda/isEmptyDelivered',{value:value, idPedidoServicio:id })                
        return response.data;
    }catch(error){
        console.error('Error en getDataForCalendar', error);
    }
}

//---------------------------------------------------------LOGOUT----------------------------------------------

export const logoutUser = async () => {
    try{
        const response = await axios.post('/logout')                
        return response.data;
    }catch(error){
        console.error('Error en logoutUser',error);
    }
}