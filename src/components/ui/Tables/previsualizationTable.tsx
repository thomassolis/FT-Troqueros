import { useEffect, useState, useContext } from "react";
import { GetDataForPrevisualizationTable } from "../../../api/Home/Vehicles/vehicles.routes";
import { Paginacion } from "../paginación/pagination";
import { Icon } from "@iconify/react/dist/iconify.js";
import { FadeLoader } from "react-spinners";
import { Select } from "../Select/Select";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { vehicleTypeContext } from "../../../context/vehicleType/vehicleType";
import { changeVehicleValue } from "../../../functions/changeVehicleType/changeVehicleType";
import Swal from 'sweetalert2'
import { sendDataForDelete } from "../../../api/Home/Vehicles/vehicles.routes";
import { useLocation } from "react-router-dom";
import { GetDataForPrevisualizationTableCustomers } from "../../../api/Home/Customers/customers.route";
import { searchValueContext } from "../../../context/searchValueForFilter/searchValue";

interface PrevisualizationTableProps {
    headerTable: string[];
    tabSelected?: string;    
}
interface GetDataForPrevisualizationTableProps {
    tabSelected: string | undefined;
    page: number;
    limit: number;
    search?: string    
}

interface TableData {
    [key: string]: any;
}

export const PrevisualizationTable = ({ headerTable, tabSelected }: PrevisualizationTableProps) => {
    const [tableData, setTableData] = useState<TableData[]>([]);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate()
    const {vehicleType} = useContext(vehicleTypeContext)!;
    const {searchValue} = useContext(searchValueContext)!;

      const location = useLocation();
      const pathSegments = location.pathname.split('/');
      const currentAction = pathSegments[pathSegments.length - 1];              
    
    //arreglo que se enviará al componente select para mostrar
    const statusOptions: string[] = ["No Disponible", "Disponible"];
    useEffect(() => {       
        const GetDataForTable = async () => {
            try {
                setIsLoading(true);
                if(currentAction === 'Vehicles'){
                    const response = await GetDataForPrevisualizationTable({
                        tabSelected,
                        page: currentPage, 
                        limit: pageSize,
                        search: searchValue
                    });                
        
                    if (!response) {
                        console.error("Error: La API no devolvió datos válidos.");
                        return;
                    }                
        
    
                    //Cambiar a vehiculos
                    setTableData(response.vehiculos.data || []);                
                    setTotalRecords(response.vehiculos.totalRegistros);
                    setPageSize(response.vehiculos.limite);                
                }else if (currentAction === 'Customers'){
                    const response = await GetDataForPrevisualizationTableCustomers({
                        page: currentPage, 
                        limit: pageSize,
                        search: searchValue
                    });                
        
                    if (!response) {
                        console.error("Error: La API no devolvió datos válidos.");
                        return;
                    }                
        
    
                    //Cambiar a vehiculos
                    setTableData(response.customers.data || []);                
                    setTotalRecords(response.customers.totalRegistros);
                    setPageSize(response.customers.limite);                
                }   
                
                
            } catch (e) {
                console.error("Error en GetDataForPrevisualizationTable: ", e);
            }finally{
                setIsLoading(false);
            }
        };
    
        if (currentPage > 0) {
            GetDataForTable();
        }
    }, [tabSelected, currentPage, pageSize, searchValue]);
    

    // Manejar cambio de página
    const handlePageClick = (selectedPage: number) => {        
        setCurrentPage(selectedPage);
    };    
    const deleteValue = async({id, vehicleType}:any) =>{
        try{
            const response = await sendDataForDelete({id, vehicleType});            
            return response;
        }catch(error){
            console.log('Error en deleteValue: ',error)
        }
    }

    const deleteRow = async (id: string, vehicleType: string | null | undefined, placa: string) => {
        const vehicle = changeVehicleValue(vehicleType);
    
        try {
            Swal.fire({
                title: `¿Seguro que deseas eliminar el ${vehicle} ${placa}?`,
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: "Cancelar",
                denyButtonText: `Eliminar`
            }).then(async (result) => {
                if (result.isDenied) {
                    const response = await deleteValue({ id, vehicleType });
                    
                    if (response.success) {
                        // Eliminar el elemento del estado tableData
                        setTableData(prevData => 
                            prevData.filter(item => 
                                (vehicleType === 'Chasises' && item.id_chasis !== id) ||
                                (vehicleType === 'Furgones' && item.id_furgon !== id) ||
                                (vehicleType === 'Cabezales' && item.id_cabezal !== id)
                            )
                        );
                        
                        Swal.fire({
                            title: 'Eliminado!',
                            text: response.message,
                            icon: 'success'
                        });
                    } else {
                        Swal.fire({
                            title: 'Error!',
                            text: response.message || `Error al eliminar ${vehicle}`,
                            icon: 'error'
                        });
                    }
                }
            });
        } catch (error) {
            console.log('Error en deleteRow', error);
            Swal.fire({
                title: 'Error!',
                text: `Error al eliminar ${vehicle}`,
                icon: 'error'
            });
        }
    };

    return (
        <>
             <div className="flex min-w-full flex-col items-center max-h-[300px] overflow-y-auto">
                <table className="text-sm text-gray-500 w-full min-w-full">
                    <thead className="text-xs uppercase dark:bg-white w-full sticky top-0 shadow-2xl z-30">
                        <tr className="w-full">
                            {headerTable.map((header, index) => (
                                <th key={index} className="px-6 py-3">{header}</th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {tableData.length > 0 ? (
                            tableData.map((item, index) => (
                                <tr key={index} className="odd:bg-slate-300 even:bg-gray-50 even:dark:bg-gray-200 border-b dark:border-gray-300 border-gray-200 text-center">
                                    {Object.entries(item)
                                        .filter(([key]) => key !== "id_chasis" && key !== "id_furgon" && key !== "id_cabezal" && key !== "ruc")
                                        .map(([key, value], idx) => (
                                            <td key={idx} className="px-6 py-4 whitespace-nowrap text-black">
                                                {headerTable[idx] === "STATUS" ? (
                                                    <Select statusOptions={statusOptions}/>
                                                ) : value} 
                                            </td>
                                        ))
                                    }

                                    <div className="flex gap-6 justify-center items-center">
                                        <td className="py-4 whitespace-nowrap text-green-800">
                                            <Icon 
                                                icon="mdi:eye" 
                                                width="24" 
                                                height="24" 
                                                className="cursor-pointer"
                                                onClick={() => {
                                                    if (currentAction === 'Vehicles') {
                                                      const id = vehicleType === 'Chasises' ? item.id_chasis :
                                                                 vehicleType === 'Furgones' ? item.id_furgon :
                                                                 vehicleType === 'Cabezales' ? item.id_cabezal : '';
                                                      navigate(`/home/Vehicles/${vehicleType}/${id}/see`);
                                                    } else {
                                                      navigate(`/home/Customers/${item.ruc}/see`);
                                                    }
                                                  }}
                                            />    
                                        </td>                                                                        
                                        <td className="py-4 whitespace-nowrap text-blue-800">
                                        <Icon 
                                            icon="uil:edit" 
                                            width="24" 
                                            height="24" 
                                            className="cursor-pointer" 
                                            onClick={() => {
                                                if(currentAction === 'Vehicles'){                                                    
                                                    const vehicleID = vehicleType === 'Chasises' ? item.id_chasis :
                                                    vehicleType === 'Furgones' ? item.id_furgon :
                                                    vehicleType === 'Cabezales' && item.id_cabezal 
                                                    navigate(`/home/Vehicles/${vehicleType}/${vehicleID}/modify`)
                                                }else{
                                                    navigate(`/home/Customers/${item.ruc}/modify`)
                                                }                                                
                                            }}
                                            />
                                        </td>                                                                        
                                        <td className="py-4 whitespace-nowrap text-red-700">
                                            <Icon 
                                                icon="material-symbols:delete" 
                                                width="24" 
                                                height="24" 
                                                className="cursor-pointer" 
                                                onClick={()=>
                                                    deleteRow(
                                                    vehicleType==='Chasises'?(
                                                        item.id_chasis
                                                    ): vehicleType==='Furgones'?(
                                                        item.id_furgon
                                                    ):(
                                                        item.id_cabezal
                                                    )
                                                    ,vehicleType, item.placa
                                                )
                                                }
                                            />    
                                        </td>                                                                        
                                    </div>                                    
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={headerTable.length} className="text-center py-4">No hay datos disponibles</td>
                            </tr>
                        )}
                    </tbody>

                </table>

                {isLoading && (
                    <div className="w-full flex items-center justify-center">                        
                        <FadeLoader color="#000"  />                        
                    </div>
                )}
                
            </div>
            {/* Componente de paginación */}
            <Paginacion totalRecords={totalRecords} pageSize={pageSize} handlePageClick={handlePageClick} />
        </>       
    );
};
