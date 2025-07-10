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

interface TableProps {
  tableData: TableRowVariables[];
  sidebarState: boolean;
  isLoading: boolean;
  selectedTab: number;  
}



export const RequestsTable = ({ tableData, sidebarState, isLoading, selectedTab }: TableProps) => {  

const rows = (tableData || []).map(item => ({
  id: item?.id_peticion,          
  nombreCliente: item?.cliente,  
  servicio: item?.servicio,     
  conductor: item?.conductor,    
  chasis: item?.chasis,          
  cabezal: item?.cabezal,        
  furgon: item?.furgon,          
  id_proveedor: item?.proveedor, 
  status: item?.status || 'Sin Status',
  services: item?.services || [] 
}));

console.log('ROWSS: ', rows);

  return (
    <TableContainer component={Paper} className="max-h-[350px] overflow-auto w-full">
      <Table aria-label="collapsible table" className='w-full' stickyHeader>
        <TableHead>
          <TableRow >
            <TableCell />
            <TableCell align="center">ID</TableCell>
            <TableCell align="center">Cliente</TableCell>
            <TableCell align="center">Servicio</TableCell>
            <TableCell align="center">Conductor</TableCell>
            <TableCell align="center">Chasis</TableCell>
            <TableCell align="center">Cabezal</TableCell>
            <TableCell align="center">Furgón</TableCell>
            <TableCell align="center">Status</TableCell>            
            <TableCell align="center"></TableCell>    
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
  );
}