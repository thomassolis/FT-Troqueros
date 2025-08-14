import CollapsibleTable from "../../ui/Tables/TablaPlegable/Principal/collapsibleTable"
import { Paginacion } from "../../ui/paginación/pagination"
import { useEffect, useState } from "react"
import { GetServices } from "../../../api/Services/services.route"
import { searchValueContext } from "../../../context/searchValueForFilter/searchValue"
import { useContext } from "react"

interface ServicesTableManagement {
    module: string
}
export const ServicesTableManagement = ({module}: ServicesTableManagement) =>{
        const [servicesData, setServicesData] = useState([]);
        const [totalRecords, setTotalRecords] = useState(0)
        const {searchValue} = useContext(searchValueContext)!;
        const [pageSize, setPageSize] = useState<number>(10)
        const [currentPage, setCurrentPage] = useState<number>(1);

      const getServicesData = async() =>{
          try{
            const response = await GetServices({
                search: searchValue != null ? String(searchValue) : '',
                page: currentPage ?? ''
            });            
            setServicesData(response.data.data);
            // setPaginacion(response.data);
            setTotalRecords(response.data.totalRegistros); 
            setPageSize(response.data.limite);
            setCurrentPage(response.data.paginaActual)
          }catch(error){
            console.error('Error en getServicesData', error)
          }
      }

      useEffect(()=>{
        if (module === 'Services'){
          getServicesData();
        }      
      }, [searchValue, pageSize, currentPage]);
       

            // Manejar cambio de página
    const handlePageClick = (selectedPage: number) => {        
        setCurrentPage(selectedPage);
    };    

    return(
        <div className="w-full">
            <CollapsibleTable 
              servicesData = {servicesData}
              reloadServices = {getServicesData}
            />
            <Paginacion totalRecords={totalRecords} pageSize={pageSize} handlePageClick={handlePageClick} />            
        </div>
    )
}