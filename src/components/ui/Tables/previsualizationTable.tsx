import { useEffect, useState, useContext } from "react";
import { GetDataForPrevisualizationTable } from "../../../api/Vehicles/vehicles.routes";
import { Paginacion } from "../paginación/pagination";
import { Icon } from "@iconify/react/dist/iconify.js";
import { FadeLoader } from "react-spinners";
import { Select } from "../Select/Select";
import { useNavigate } from "react-router-dom";
import { vehicleTypeContext } from "../../../context/vehicleType/vehicleType";
import { changeVehicleValue } from "../../../functions/changeVehicleType/changeVehicleType";
import { useLocation } from "react-router-dom";
import { GetDataForPrevisualizationTableCustomers } from "../../../api/Customers/customers.route";
import { searchValueContext } from "../../../context/searchValueForFilter/searchValue";
import { DeleteRow } from "../../pages/Vehicles/deleteValue/DeleteValue";
import { GetFullDriversDataForTable } from "../../../api/Drivers/Drivers.route";
import { GetProviders } from "../../../api/Providers/providers.route";

interface PrevisualizationTableProps {
    headerTable: string[];
    tabSelected?: string;    
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
    // const [module, setModule] = useState<string>('')

    const navigate = useNavigate()
    const {vehicleType} = useContext(vehicleTypeContext)!;
    const {searchValue, setSearchValue} = useContext(searchValueContext)!;
    const location = useLocation();
    const pathSegments = location.pathname.split('/');
    const module = pathSegments[pathSegments.length - 1];                
    //arreglo que se enviará al componente select para mostrar
    const statusOptions: string[] = ["No Disponible", "Disponible"];
    
    useEffect(() => {       
        const GetDataForTable = async () => {
            try {
                setIsLoading(true);
        setTableData([]); // Limpiar datos antes de cargar nuevos
                if(module === 'Vehicles'){                    
                    const response = await GetDataForPrevisualizationTable({
                        tabSelected: tabSelected ?? '',
                        page: currentPage, 
                        limit: pageSize,
                        search: searchValue ?? ''
                    });                                        
                    //Cambiar a vehiculos
                    setTableData(response.vehiculos.data || []);             
                    setTotalRecords(response.vehiculos.totalRegistros);
                    setPageSize(response.vehiculos.limite);                                   
                }else if (module === 'Customers'){                    
                    const response = await GetDataForPrevisualizationTableCustomers({
                        page: currentPage, 
                        limit: pageSize,
                        search: searchValue ?? ''
                    });                
        
                    if (!response) {
                        console.error("Error: La API no devolvió datos válidos.");
                        return;
                    }                
        
    
                    //Cambiar a vehiculos
                    setTableData(response.customers.data || []);                
                    setTotalRecords(response.customers.totalRegistros);
                    setPageSize(response.customers.limite);                
                }else if (module === 'Drivers'){                    
                    const response = await GetFullDriversDataForTable({
                        page: currentPage, 
                        limit: pageSize,
                        search: searchValue ?? ''
                    });                                     

                    setTableData(response.data.data || []);  
                    setTotalRecords(response.data.totalRegistros);                    
                    setPageSize(response.data.limite); 
                }else if (module === 'Providers'){
                    const response = await GetProviders({
                        page: currentPage, 
                        limit: pageSize,
                        search: searchValue ?? ''
                    });
                    setTableData(response.data.data || []); 
                    setTotalRecords(response.data.totalRegistros);                    
                    setPageSize(response.data.limite); 
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
    }, [tabSelected, currentPage, pageSize, searchValue, module]);
    
    useEffect(()=>{
        setSearchValue('');
    }, [])

    // Manejar cambio de página
    const handlePageClick = (selectedPage: number) => {        
        setCurrentPage(selectedPage);
    };    

    const deleteRow = async (id: string, nombre: string, vehicleType?: string | undefined) => {
        const vehicle = changeVehicleValue(vehicleType);
        //Función que mostrará la opción de eliminar dentro de la UI usando un modal
        DeleteRow({vehicle, nombre, vehicleType, id, setTableData, module:module, tableData});
    };

    return (
        <>
             <div className="flex min-w-full flex-col items-center max-h-[300px] overflow-y-auto mt-5">
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
                                        .filter(([key]) => key !== "id_chasis" && key !== "id_furgon" && key !== "id_cabezal" && key !== "id_cliente" && key !== "id_conductor" && key !== "id_proveedor" && key !== "numero_cuenta" && key !== "tipo_banco")
                                        .map(([key, value], idx) => (
                                            <td key={idx} className="px-6 py-4 whitespace-nowrap text-black">
                                                {headerTable[idx] === "STATUS" ? (
                                                    <Select 
                                                        statusOptions={statusOptions} 
                                                        apiRequest = {true} 
                                                        id = {vehicleType === 'Chasises'? (
                                                                item.id_chasis
                                                            ): vehicleType === 'Furgones' ? (
                                                                item.id_furgon
                                                            ): vehicleType === 'Cabezales' ? (
                                                                item.id_cabezal
                                                            ): module === 'Drivers' ? (
                                                                item.id_conductor
                                                            ):null} 
                                                        // id = {item.id_chasis} 
                                                        defaultValue = {item.status} 
                                                        tableData = {tableData}
                                                        module={module}
                                                    />
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
                                                className="cursor-pointer hover:text-green-500"
                                                onClick={() => {
                                                    if (module === 'Vehicles') {
                                                      const id = vehicleType === 'Chasises' ? item.id_chasis :
                                                                 vehicleType === 'Furgones' ? item.id_furgon :
                                                                 vehicleType === 'Cabezales' ? item.id_cabezal : '';
                                                      navigate(`/home/Vehicles/${vehicleType}/${id}/see`);
                                                    } else if (module === 'Drivers'){
                                                        navigate(`/home/Drivers/${item.id_conductor}/see`);
                                                    }else if (module === 'Customers'){
                                                      navigate(`/home/Customers/${item.id_cliente}/see`);
                                                    }else if (module === 'Providers'){
                                                        navigate(`/home/Providers/${item.id_proveedor}/see`);
                                                    }
                                                  }}
                                            />    
                                        </td>                                                                        
                                        <td className="py-4 whitespace-nowrap text-blue-800">
                                        <Icon 
                                            icon="uil:edit" 
                                            width="24" 
                                            height="24" 
                                            className="cursor-pointer hover:text-blue-500" 
                                            onClick={() => {
                                                if(module === 'Vehicles'){                                                    
                                                    const vehicleID = vehicleType === 'Chasises' ? item.id_chasis :
                                                    vehicleType === 'Furgones' ? item.id_furgon :
                                                    vehicleType === 'Cabezales' && item.id_cabezal 
                                                    navigate(`/home/Vehicles/${vehicleType}/${vehicleID}/modify`)
                                                }else if (module === 'Drivers'){
                                                    navigate(`/home/Drivers/${item.id_conductor}/modify`)
                                                } else if (module === 'Providers'){
                                                    navigate(`/home/Providers/${item.id_proveedor}/modify`)
                                                }
                                                else{
                                                    navigate(`/home/Customers/${item.id_cliente}/modify`)
                                                }                                                
                                            }}
                                            />
                                        </td>                                                                        
                                        <td className="py-4 whitespace-nowrap text-red-700">
                                            <Icon 
                                                icon="material-symbols:delete" 
                                                width="24" 
                                                height="24" 
                                                className="cursor-pointer hover:text-red-500" 
                                                onClick={()=>
                                                    {module === 'Vehicles' ? (
                                                        deleteRow(
                                                            vehicleType==='Chasises'?(
                                                                item.id_chasis
                                                            ): vehicleType==='Furgones'?(
                                                                item.id_furgon
                                                            ):(
                                                                item.id_cabezal
                                                            )
                                                            ,item.placa, vehicleType
                                                        )   
                                                    ): module === 'Drivers' ? (                                                        
                                                        deleteRow(item.id_conductor, item.nombreCompleto)
                                                    ):(module === 'Providers') ? (
                                                        deleteRow(item.id_proveedor, item.nombre)
                                                    ): (
                                                        deleteRow(item.id_cliente, item.nombre)   
                                                    )}
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
