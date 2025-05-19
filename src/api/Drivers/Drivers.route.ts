import axios from '../axios.ts'

interface GetFullDriversDataForTableProps{
    page: number;
    limit: number;
    search?: string;
}


export const GetFullDriversDataForTable = async({page, limit, search}: GetFullDriversDataForTableProps) =>{
    try{
        const response = await axios.get('/drivers', {
            params:{
                page: page,
                limit: limit,
                search: search
            }
        });
        return response.data;        
    }catch(error){
        console.log('Error en GetFullDriversDataForTable', error);
    }
}