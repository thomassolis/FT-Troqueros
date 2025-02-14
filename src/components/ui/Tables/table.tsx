interface TableProps {
    tableData: Record<string, string>[]; // ✅ Ahora es un array de objetos
    sidebarState: boolean
}

export const Table = ({ tableData, sidebarState }: TableProps) => {
  
    return (
        <div className={`flex min-w-full flex-col items-center w-full relative overflow-x-auto max-sm:ml-6 rounded-b-lg  max-h-60  max-md:max-w-[95%] max-sm:max-w-[90%]  ${sidebarState ? "" : ""}`}>          
          <table className="text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 w-full">
            
            <thead className="text-xs text-gray-700 uppercase dark:bg-white dark:text-gray-400 w-full">
              <tr className="w-full">
                {tableData.length > 0 ? (
                  Object.keys(tableData[0]).map((key, index) => (
                    <th
                      key={index}
                      scope="col"
                      className="px-6 py-3 whitespace-nowrap" // Evita que el texto se divida en varias líneas
                    >
                      {key}
                    </th>
                  ))
                ) : (
                  <th className="px-6 py-3">No hay datos disponibles</th>
                )}
              </tr>
            </thead>

            {/* Cuerpo dinámico */}
            <tbody>
              {tableData.length > 0 ? (
                tableData.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="odd:bg-gray-200 even:bg-gray-50 even:dark:bg-white border-b dark:border-gray-700 border-gray-200"
                  >
                    {Object.values(row).map((value, colIndex) => (
                      <td
                        key={colIndex}
                        className="px-6 py-4 whitespace-nowrap" // Evita que el texto se divida en varias líneas
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={tableData.length > 0 ? Object.keys(tableData[0]).length : 1}
                    className="px-6 py-4 text-center"
                  >
                    No hay datos disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
    );
};
