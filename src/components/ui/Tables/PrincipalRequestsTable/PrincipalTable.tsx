import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import RequestTableRows from "./RequestTableRows";
import { FadeLoader } from 'react-spinners';

interface TableRow {
  id_peticion: string;
  cliente: string;
  servicio: string;
  conductor: string;
  chasis: string;
  cabezal: string;
  furgon: string;
  status: string;
  proveedor: string
}

interface TableProps {
  tableData: (TableRow)[];
  sidebarState: boolean;
  isLoading: boolean;
  selectedTab: number;
}



export const RequestsTable = ({ tableData, sidebarState, isLoading, selectedTab }: TableProps) => {
  console.log('tableData', tableData)
  console.log('sidebarState', sidebarState)

const rows = (tableData || []).map(item => ({
  id: item?.id_peticion || 'No disponible',           // Valor por defecto si es null/undefined
  nombreCliente: item?.cliente || 'Sin cliente',      // Valor por defecto
  servicio: item?.servicio || 'Sin servicio',         // Valor por defecto
  conductor: item?.conductor || 'No asignado',        // Manejo de null
  chasis: item?.chasis || 'No asignado',              // Manejo de null
  cabezal: item?.cabezal || 'No asignado',            // Manejo de null
  furgon: item?.furgon || 'No asignado',              // Manejo de null
  id_proveedor: item?.proveedor || 'Sin proveedor'    // Valor por defecto
}));

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
                <RequestTableRows key={row.id || index} row={row} selectedTab={selectedTab}/>
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