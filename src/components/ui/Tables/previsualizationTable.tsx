import { useEffect, useState } from "react";
import { GetDataForPrevisualizationTable } from "../../../api/Home/Vehicles/vehicles.routes";
import { Paginacion } from "../paginación/pagination";

interface PrevisualizationTableProps {
    headerTable: string[];
    tabSelected: string;
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

export const PrevisualizationTable = ({ headerTable, tabSelected }: PrevisualizationTableProps) => {
    const [tableData, setTableData] = useState<TableData[]>([]);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        console.log(`Página actual: ${currentPage}`); // 🔍 Verifica si el estado de currentPage cambia
    
        const GetDataForTable = async () => {
            try {
                const response = await GetDataForPrevisualizationTable({
                    tabSelected,
                    page: currentPage, 
                    limit: pageSize,
                    search:""
                });
    
                if (!response || !response.chassis) {
                    console.error("Error: La API no devolvió datos válidos.");
                    return;
                }
    
                setTableData(response.chassis.data || []);
                setTotalRecords(response.chassis.totalRegistros);
                setPageSize(response.chassis.limite);
    
                console.log("Datos cargados con éxito:", response.chassis);
            } catch (e) {
                console.error("Error en GetDataForPrevisualizationTable: ", e);
            }
        };
    
        if (currentPage > 0) {
            GetDataForTable();
        }
    }, [tabSelected, currentPage, pageSize]);
    

    // Manejar cambio de página
    const handlePageClick = (selectedPage: number) => {
        console.log(`Cambiando a la página: ${selectedPage}`);
        setCurrentPage(selectedPage);
    };

    return (
        <>
             <div className="flex min-w-full flex-col items-center max-h-[300px] overflow-y-auto">
                <table className="text-sm text-gray-500 w-full min-w-full">
                    <thead className="text-xs uppercase dark:bg-white w-full sticky top-0 shadow-2xl">
                        <tr className="w-full">
                            {headerTable.map((header, index) => (
                                <th key={index} className="px-6 py-3">{header}</th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {tableData.length > 0 ? (
                            tableData.map((item, index) => (
                                <tr key={index} className="odd:bg-slate-400 even:bg-gray-50 even:dark:bg-white border-b dark:border-gray-700 border-gray-200">
                                    {Object.entries(item)
                                        .filter(([key]) => key !== "id_chasis" && key !== "id_furgon" && key !== "id_cabezal")
                                        .map(([_, value], idx) => (
                                            <td key={idx} className="px-6 py-4 whitespace-nowrap text-black">{value}</td>
                                        ))}
                                    <td className="px-6 py-4 whitespace-nowrap text-black">Acción 1</td>                                    
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={headerTable.length} className="text-center py-4">No hay datos disponibles</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                
            </div>
            {/* Componente de paginación */}
            <Paginacion totalRecords={totalRecords} pageSize={pageSize} handlePageClick={handlePageClick} />
        </>       
    );
};
