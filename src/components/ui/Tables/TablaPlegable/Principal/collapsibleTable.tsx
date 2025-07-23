import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Row from '../DataTable/DataTableWithSections';

interface CollapsibleTableProps {
  servicesData: never[],
  reloadServices: () => Promise<void>
}

export default function CollapsibleTable({servicesData, reloadServices}:CollapsibleTableProps) {
  const rows = servicesData?.map((service:any) => ({
    name: service.nombre,
    id: service.id_servicio,
    history: service.pedidos.map((pedido:any, index:number) => ({
      id_servicio_datos: pedido.id_servicio_datos,
      lugar_origen: pedido.lugar_origen,
      lugar_destino: pedido.lugar_destino,
      tarifa: pedido.tarifa ? `${pedido.tarifa}` : 'N/A',
      tiempo_estimado: pedido.tiempo_estimado ? `${pedido.tiempo_estimado}` : 'N/A',
    })),
  })) || [];
  

  return (
    <TableContainer component={Paper} className='max-h-[400px] overflow-y-auto'>
      
      <Table aria-label="collapsible table" >
        <TableHead id="head">
          <TableRow className='w-full bg-blue-50'>
            <TableCell />
            <TableCell />                                  
            <TableCell />            
            <TableCell />
            <TableCell><span className='font-bold text-xl text-blue-950'>Servicios</span></TableCell>  
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row:any) => (            
            <Row 
              key={`${row.id}-${row.name}`} 
              row={row} 
              id={row.id}
              servicesData={servicesData}
              reloadServices={reloadServices}
            />                               
          ))}


        </TableBody>
      </Table>
    </TableContainer>
  );
}