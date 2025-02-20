import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { BeatLoader } from "react-spinners";
import { UpdateRequestStatus } from "../../../api/Home/home.route";

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
  tableData: (TableRow | TableRow[])[];
  sidebarState: boolean;
  isLoading: boolean;
}

export const Table = ({ tableData, sidebarState, isLoading }: TableProps) => {
  const [expandedRows, setExpandedRows] = useState<{ [id: string]: boolean }>({});
  const [selectedOptions, setSelectedOptions] = useState<{ [id: string]: string }>({});

  const statusOptions: Record<string, string[]> = {
    "En Proceso": ["Incompletas", "Pendientes", "En Espera"],
    "Incompletas": ["Pendientes", "En Espera", "En Proceso"],
    "En Espera": ["Incompletas", "Pendientes", "En Proceso"],
    "Pendientes": ["Incompletas", "En Espera", "En Proceso"],
  };

  // Función para manejar el cambio en el select de Status
  const handleStatusChange = (id: string, newValue: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [id]: newValue,
    }));
  };

  // Simulación de actualización en backend
  useEffect(() => {
    if (Object.keys(selectedOptions).length > 0) {
      const UpdateRequest = async () => {
        await UpdateRequestStatus({ selectedOptions });
      };
      UpdateRequest();
    }
  }, [selectedOptions]);

  const toggleExpand = (index: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Normalizar la data para obtener el primer elemento cuando hay un array de filas
  const normalizedData = tableData.map((item) => (Array.isArray(item) ? item[0] : item));

  // Obtener headers dinámicamente
  const headers = normalizedData.length > 0 ? Object.keys(normalizedData[0]) : [];

  return (
    <div className={`flex min-w-full flex-col items-center w-full relative overflow-x-auto max-sm:ml-6 rounded-b-lg max-h-60 max-md:max-w-[95%] max-sm:max-w-[90%]`}>
      <table className="text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 w-full">
        <thead className="text-xs text-gray-700 uppercase dark:bg-white dark:text-gray-400 w-full sticky top-0 shadow-2xl">
          <tr className="w-full">
            {headers.map((key, index) => (
              <th key={index} scope="col" className="px-6 py-3 whitespace-nowrap text-black">
                {key}
              </th>
            ))}
            <th className="px-6 py-3 text-black">Detalles</th>
          </tr>
        </thead>
        <tbody>
          {tableData.length > 0 ? (
            tableData.map((item, index) => {
              const rowData = Array.isArray(item) ? item[0] : item;
              const isExpandable = Array.isArray(item) && item.length > 1;
              const remainingData = isExpandable ? item.slice(1) : [];

              return (
                <React.Fragment key={index}>
                  {/* Fila Principal */}
                  <tr className="odd:bg-slate-400 even:bg-gray-50 even:dark:bg-white border-b dark:border-gray-700 border-gray-200">
                    {headers.map((key, colIndex) => (
                      <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-black">
                        {key === "Status" ? (
                          <select
                            value={selectedOptions[rowData.ID] ?? rowData[key as keyof TableRow]}
                            onChange={(e) => handleStatusChange(rowData.ID, e.target.value)}
                            className="border rounded px-2 py-1 bg-white"
                          >
                            <option value={rowData[key as keyof TableRow]}>
                              {rowData[key as keyof TableRow]}
                            </option>
                            {statusOptions[rowData[key as keyof TableRow]]?.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : (
                          rowData[key as keyof TableRow]
                        )}
                      </td>
                    ))}
                    <td className="px-6 py-4 text-center">
                      {isExpandable && (
                        <button
                          className="px-2 py-1 border rounded bg-gray-200 hover:bg-gray-300"
                          onClick={() => toggleExpand(index)}
                        >
                          {expandedRows[index] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      )}
                    </td>
                  </tr>

                  {/* Filas Expandidas */}
                  {expandedRows[index] &&
                    isExpandable &&
                    remainingData.map((subItem, subIndex) => (
                      <tr key={`expanded-${index}-${subIndex}`} className="border bg-gray-100">
                        {headers.map((key, colIndex) => (
                          <td key={colIndex} className="px-6 py-4 border">
                            {key === "Status" ? (
                              <select
                                value={selectedOptions[subItem.ID] ?? subItem[key as keyof TableRow]}
                                onChange={(e) => handleStatusChange(subItem.ID, e.target.value)}
                                className="border rounded px-2 py-1 bg-white"
                              >
                                <option value={subItem[key as keyof TableRow]}>
                                  {subItem[key as keyof TableRow]}
                                </option>
                                {statusOptions[subItem[key as keyof TableRow]]?.map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              subItem[key as keyof TableRow]
                            )}
                          </td>
                        ))}
                        <td className="px-6 py-4 border"></td>
                      </tr>
                    ))}
                </React.Fragment>
              );
            })
          ) : (
            <tr>
              <td colSpan={headers.length + 1} className="px-6 py-4 text-center text-black">
                No hay datos disponibles
              </td>
            </tr>
          )}

          {isLoading && (
            <tr>
              <td colSpan={headers.length + 1} className="px-6 py-4 text-center">
                <BeatLoader color="#000" size={15} />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
