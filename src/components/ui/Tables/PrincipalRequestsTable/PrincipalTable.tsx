import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import RequestTableRows from "./RequestTableRows";
import { FadeLoader } from 'react-spinners';
import { TableRowVariables } from '../../../others/TableTabs';
import { useState, useEffect } from 'react';
interface TableProps {
  tableData: TableRowVariables[];
  sidebarState: boolean;
  isLoading: boolean;
  selectedTab: number;  
  procedure: string
}



export const RequestsTable = ({ tableData, sidebarState, isLoading, selectedTab, procedure }: TableProps) => {  
const [rows, setRows] = useState<TableRowVariables[]>([]);
 useEffect(() => {
    if (tableData) {
      const mappedRows = tableData.map(item => ({
        id: item?.id_peticion,
        nombreCliente: item?.cliente,
        servicio: item?.servicio,
        conductor: item?.conductor,
        chasis: item?.chasis,
        cabezal: item?.cabezal,
        furgon: item?.furgon,
        id_proveedor: item?.proveedor,
        monto: item?.monto,
        precio_proveedor: item?.precio_proveedor,
        profit: item?.profit,
        fecha_creacion: item?.fecha_creacion,
        fecha_salida: item?.fecha_salida,
        hora_salida: item?.fecha_salida,
        status: item?.status || 'Sin Status',
        services: item?.services || [],
      }));
      setRows(mappedRows);
    }
  }, [tableData]);

  //   const handleStatusChange = (id: string, newStatus: string) => {
  //   setRows(prev =>
  //     prev.map(row =>
  //       row.id === id ? { ...row, status: newStatus } : row
  //     )
  //   );
  // };

  // const handleDelete = (id: string) => {
  //   setRows(prev => prev.filter(row => row.id !== id));
  // };

  //   const filteredRows = rows.filter(row => {
  //     if (selectedTab === 0) return row.status === 'En espera';
  //     if (selectedTab === 1) return row.status === 'En proceso';
  //     if (selectedTab === 2) return row.status === 'Completado';
  //   return true;
  //   });


  return (
      <div className={`${procedure==='completeRequestHistory'?'overflow-x-auto max-w-[1200px]':'w-full'}`}>
        <TableContainer component={Paper} className={`max-h-[350px]  overflow-auto w-full ${procedure==='completeRequestHistory'?'min-w-fit':''}`}>
          <Table aria-label="collapsible table" className={`${procedure==='completeRequestHistory'?'min-w-[1200px]':'w-full'}`} stickyHeader>
            <TableHead>
              <TableRow >
                <TableCell />
                <TableCell align="center" sx={{paddingX:'25px'}}>ID</TableCell>
                <TableCell align="center">Cliente</TableCell>
                <TableCell align="center">Servicio</TableCell>
                <TableCell align="center">Conductor</TableCell>
                <TableCell align="center">Chasis</TableCell>
                <TableCell align="center">Cabezal</TableCell>
                <TableCell align="center">Furgón</TableCell>                      
                {procedure === 'home'?(
                  <>
                    <TableCell align="center">Status</TableCell>  
                    <TableCell align="center"></TableCell>    
                  </>
                ):(
                  <>
                    <TableCell align="center">Monto Total</TableCell>    
                    <TableCell align="center">Precio Proveedor</TableCell> 
                    <TableCell align="center">Profit</TableCell> 
                    <TableCell align="center">Creación De Petición</TableCell> 
                    <TableCell align="center">Comienzo De Petición</TableCell> 
                    <TableCell align="center">Hora De Comienzo De Petición</TableCell> 
                    <TableCell align="center" sx={{paddingX:'60px'}} >Status</TableCell>                     
                    <TableCell align="center" sx={{paddingX:'60px'}} ></TableCell>
                  </>
                )

                }            
              </TableRow>
            </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <div className='flex w-full justify-center'>
                        <FadeLoader color='orange'/>
                      </div>                  
                    </TableCell>
                  </TableRow>
                ) : rows.length > 0 ? (
                  rows.map((row, index) => (
                    <RequestTableRows 
                      key={row.id || index} 
                      row={row} 
                      selectedTab={selectedTab} 
                      procedure={procedure}
                      // onStatusChange={handleStatusChange}
                      // onDelete={handleDelete}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <p className="text-gray-500">No hay ninguna petición disponible</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>

          </Table>
        </TableContainer>
      </div>
  );
}