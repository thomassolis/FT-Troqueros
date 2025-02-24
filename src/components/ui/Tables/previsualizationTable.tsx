import { useEffect, useState } from "react";
import { GetDataForPrevisualizationTable } from "../../../api/Home/Vehicles/vehicles.routes";
import { Paginacion } from "../paginación/pagination";
import { Icon } from "@iconify/react/dist/iconify.js";
import { FadeLoader } from "react-spinners";
import { Select } from "../Select/Select";

interface PrevisualizationTableProps {
    headerTable: string[];
    tabSelected: string;
    searchValue: string;
}
interface GetDataForPrevisualizationTableProps {
    tabSelected: string;
    page: number;
    limit: number;
    search?: string    
}

interface TableData {
    [key: string]: any;
}

export const PrevisualizationTable = ({ headerTable, tabSelected, searchValue }: PrevisualizationTableProps) => {
    const [tableData, setTableData] = useState<TableData[]>([]);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    //arreglo que se enviará al componente select para mostrar
    const statusOptions: string[] = ["No Disponible", "Disponible"];
    useEffect(() => {       
        const GetDataForTable = async () => {
            try {
                setIsLoading(true);
                const response = await GetDataForPrevisualizationTable({
                    tabSelected,
                    page: currentPage, 
                    limit: pageSize,
                    search: searchValue
                });
    
                if (!response || !response.chassis) {
                    console.error("Error: La API no devolvió datos válidos.");
                    return;
                }
    
                setTableData(response.chassis.data || []);                
                setTotalRecords(response.chassis.totalRegistros);
                setPageSize(response.chassis.limite);                
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
                                <tr key={index} className="odd:bg-slate-400 even:bg-gray-50 even:dark:bg-white border-b dark:border-gray-700 border-gray-200 text-center">
                                    {Object.entries(item)
                                        .filter(([key]) => key !== "id_chasis" && key !== "id_furgon" && key !== "id_cabezal")
                                        .map(([key, value], idx) => (
                                            <td key={idx} className="px-6 py-4 whitespace-nowrap text-black">
                                                {headerTable[idx] === "STATUS" ? (

                                                    <Select statusOptions={statusOptions}/>
                                                    // <select className="rounded-md p-1">                                                        
                                                    //     <option value="" className="text-red-700">No Disponible</option>
                                                    //     <option value="" className="text-green-900">Disponible</option>
                                                    // </select>
                                                ) : value} 
                                            </td>
                                        ))
                                    }

                                    <div className="flex gap-6 justify-center items-center">
                                        <td className="py-4 whitespace-nowrap text-green-800">
                                            <Icon icon="mdi:eye" width="24" height="24" className="cursor-pointer"/>    
                                        </td>                                                                        
                                        <td className="py-4 whitespace-nowrap text-blue-800">
                                            <Icon icon="uil:edit" width="24" height="24" className="cursor-pointer"/>
                                        </td>                                                                        
                                        <td className="py-4 whitespace-nowrap text-red-700">
                                            <Icon icon="material-symbols:delete" width="24" height="24" className="cursor-pointer"/>    
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
