import { useState, useEffect } from "react";
import { UpdateRequestStatus } from "../../../api/Home/home.route";
import { BeatLoader } from "react-spinners"

interface TableRow {
    ID: string;
    Cliente: string;
    Servicio: string;
    Conductor: string;
    Chasis: string;
    Cabezal: string;
    Furgón: string;
    Status: string;
}

interface TableProps {
    tableData: TableRow[];
    sidebarState: boolean;
    isLoading: boolean;
}

export const Table = ({ tableData, sidebarState, isLoading }: TableProps) => {
    const [selectedOptions, setSelectedOptions] = useState<{ [id: string]: string }>({});

    const statusOptions: Record<string, string[]> = {
        "En Proceso": ["Incompletas", "Pendientes", "En Espera"],
        "Incompletas": ["Pendientes", "En Espera", "En Proceso"],
        "En Espera": ["Incompletas", "Pendientes", "En Proceso"],
        "Pendientes": ["Incompletas", "En Espera", "En Proceso"],
    };

    const handleStatusChange = (id: string, newValue: string) => {
        setSelectedOptions(() => ({    
            [id]: newValue,
        }));
    };

    useEffect(() => {
        if (Object.keys(selectedOptions).length > 0) {
            const UpdateRequest = async () => {
                await UpdateRequestStatus({ selectedOptions });
            };
            UpdateRequest();
        }
    }, [selectedOptions]);

    return (
        <div className={`flex min-w-full flex-col items-center w-full relative overflow-x-auto max-sm:ml-6 rounded-b-lg max-h-60 max-md:max-w-[95%] max-sm:max-w-[90%] ${sidebarState ? "" : ""}`}>
            <table className="text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 w-full">
                <thead className="text-xs text-gray-700 uppercase dark:bg-white dark:text-gray-400 w-full sticky top-0 shadow-2xl">
                    <tr className="w-full">
                        {tableData.length > 0 ? (
                            Object.keys(tableData[0]).map((key, index) => (
                                <th key={index} scope="col" className="px-6 py-3 whitespace-nowrap text-black">
                                    {key}
                                </th>
                            ))
                        ) : (
                            <div className="flex justify-center items-center">
                            {["ID", "CLIENTE", "SERVICIO", "CONDUCTOR", "CHASIS", "CABEZAL", "FURGÓN", "STATUS"].map((opt)=>(
                                <th className="px-6 py-3">{opt}</th>
                            ))

                            }                                                            
                            </div>                                                        
                        )}
                    </tr>
                </thead>

                <tbody>
                    {tableData.length > 0 ? (
                        tableData.map((row: TableRow) => {
                            const rowID: string = row.ID; // ✅ TypeScript ahora reconoce `rowID`

                            return (
                                <tr key={rowID} className="odd:bg-slate-400 even:bg-gray-50 even:dark:bg-white border-b dark:border-gray-700 border-gray-200">
                                    {Object.entries(row).map(([key, value], colIndex) => (
                                        <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-black">
                                            {key === "Status" ? (
                                                <select
                                                    value={selectedOptions[rowID] ?? value}
                                                    onChange={(e) => handleStatusChange(rowID, e.target.value)}
                                                    className="border rounded px-2 py-1 bg-white"
                                                >
                                                    <option value={value}>{value}</option>
                                                    {statusOptions[value]?.map((option) => (
                                                        <option key={option} value={option}>
                                                            {option}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                value
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={tableData.length > 0 ? Object.keys(tableData[0]).length : 1} className="px-6 py-4 whitespace-nowrap text-black">
                                No hay datos disponibles
                            </td>
                        </tr>
                    )}

                    {isLoading &&
                        <div className="flex justify-center items-center">
                            <BeatLoader color="#fff" size={15}/>
                        </div>                        

                    }
                </tbody>
            </table>
        </div>
    );
};
