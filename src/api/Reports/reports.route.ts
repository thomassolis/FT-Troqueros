import axios from "../axios.ts";
import toast from "react-hot-toast";

export const getGeneralReportsData = async({filters, dates}:any) => {

    try{        
        const response = await axios.get('/reports/get_reports', {            
            params:{
                serviceID: filters.services?.value,
                driverID: filters.drivers?.value,
                customerID: filters.customers?.value,
                startDate: dates?.startDate,
                endDate: dates?.endDate,
            }
        });
        
        
        if(response.data.success){
            return response.data.data;
        }else{
            toast(response.data.message);
        }
    }catch(error){
        console.error('Error en getGeneralReportsData: ', error);
    }
}


export const getTeamReports = async(currentPage:number, pageSize:number, searchTerm:string, driverSearch: string, statusSelected:any, dates:{startDate?: Date; endDate?: Date}) => {    
    try{
        const response = await axios.get('/reports/get_team_reports',{
            params:{
                page: currentPage,
                pageSize: pageSize,                
                searchTerm: searchTerm,
                statusSelected: statusSelected, 
                driverSearch: driverSearch,
                dates: dates
            }
        });           
        return response.data;     
    }catch(error){
        console.error('Error en getTeamReports: ', error);
    }
}

