import React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Icon } from "@iconify/react/dist/iconify.js";
import Select from 'react-select';
// Estilos comunes para las celdas
const tableCellStyles = {
  width: '13.5%', // Divide el 100% entre 8 columnas (ajusta según necesidades)
  maxWidth: '13.5%',
  wordWrap: 'break-word',
  whiteSpace: 'normal',
  padding: '8px',
  border: '1px solid #e0e0e0',
  boxSizing: 'border-box',
};

function createData(
  id: string,
  nombreCliente: string,
  servicio: string,
  conductor: string,
  chasis: string,
  cabezal: string,
  furgon:string,  
  id_proveedor:string,
) {
  return {
    id,
    nombreCliente,
    servicio,
    conductor,
    chasis,
    cabezal,
    furgon,
    id_proveedor,
    history: [
      {
        date: '2020-01-05',
        customerId: '11091700',
        amount: 3,
      },
      {
        date: '2020-01-02',
        customerId: 'Anonymous',
        amount: 1,
      },
    ],
  };
}
interface RequestTableRowsProps {
  row: ReturnType<typeof createData>;
  selectedTab: number; // Añade esta prop
}
function RequestTableRows({ row, selectedTab }: RequestTableRowsProps) {
  const [open, setOpen] = React.useState(false);
  console.log('selectedTabselectedTab', selectedTab);
  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} className={`${row.id_proveedor ? 'bg-blue-200' : ''}`}>
        <TableCell sx={{ ...tableCellStyles, width: '2%', maxWidth: '2%' }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <Icon icon="fe:arrow-up" width="24" height="24" /> : <Icon icon="fe:arrow-down" width="24" height="24" />}
          </IconButton>
        </TableCell>
        <TableCell align="center" sx={{...tableCellStyles, width: '8%', maxWidth: '8%'}}> 
          <p style={{ margin: 0, wordBreak: 'break-word' }} className={row.id ? '' : 'text-red-500'}>{row.id}</p>
        </TableCell>
        <TableCell align="center" sx={tableCellStyles}> 
          <p style={{ margin: 0, wordBreak: 'break-word' }} className={row.nombreCliente ? '' : 'text-red-500'}>{row.nombreCliente}</p>
        </TableCell>
        <TableCell align="center" sx={tableCellStyles}> 
          <p style={{ margin: 0, wordBreak: 'break-word' }} className={row.servicio ? '' : 'text-red-500'}>{row.servicio}</p>
        </TableCell>
        <TableCell align="center" sx={tableCellStyles}> 
          <p style={{ margin: 0, wordBreak: 'break-word' }} className={row.conductor ? '' : 'text-red-500'}>{row.conductor || 'No asignado'}</p>
        </TableCell>
        <TableCell align="center" sx={{...tableCellStyles, width: '12%', maxWidth: '12%'}}> 
          <p style={{ margin: 0, wordBreak: 'break-word' }} className={row.chasis ? '' : 'text-red-500'}>{row.chasis || 'No asignado'}</p>
        </TableCell>
        <TableCell align="center" sx={{...tableCellStyles, width: '12%', maxWidth: '12%'}}> 
          <p style={{ margin: 0, wordBreak: 'break-word' }} className={row.cabezal ? '' : 'text-red-500'}>{row.cabezal || 'No asignado'}</p>
        </TableCell>
        <TableCell align="center" sx={{...tableCellStyles, width: '12%', maxWidth: '12%'}}> 
          <p style={{ margin: 0, wordBreak: 'break-word' }} className={row.furgon ? '' : 'text-red-500'}>{row.furgon || 'No asignado'}</p>
        </TableCell>
        <TableCell align="center" sx={{ ...tableCellStyles, width: '12%', maxWidth: '12%' }}>          
          <Select 
            options={[
              {value: 'id', label: 'En Espera'}, 
              {value: 'nameService', label: 'En Proceso'}, 
              {value: 'nameDriver', label: 'Terminadas'},               
            ]}  
          />
        </TableCell>
      </TableRow>      




      {/* SUBTABLAA */}
      <TableRow>
        <TableCell
          style={{ padding: 0}}
          padding="none"
          colSpan={9}          
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ 
            width: '100%',
            display: 'flex',
            justifyContent: 'center',                                                      
          }}>     
              <Table
                size="small"
                aria-label="purchases"
                sx={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  tableLayout: 'fixed',
                }}
              >
                <TableHead>
                  <TableRow>
                    {/* Columna vacía para alinear con el botón expandir */}
                    <TableCell sx={{ ...tableCellStyles, width: '5%', maxWidth: '5%'}}></TableCell>
                    <TableCell sx={{ ...tableCellStyles}} align="center">id</TableCell>
                    <TableCell sx={{ ...tableCellStyles}} align="center">Cliente</TableCell>
                    <TableCell sx={{ ...tableCellStyles}} align="center">Amount</TableCell>
                    <TableCell sx={{ ...tableCellStyles}} align="center">Total price ($)</TableCell>
                    <TableCell sx={{ ...tableCellStyles}} align="center">Amount</TableCell>
                    <TableCell sx={{ ...tableCellStyles}} align="center">Amount</TableCell>
                    <TableCell sx={{ ...tableCellStyles}} align="center">Amount</TableCell>
                    <TableCell sx={{ ...tableCellStyles, width: '10%', maxWidth: '10%' }} align="center">Amount</TableCell>
                  </TableRow>
                </TableHead>

                          {/* <TableBody>
                            {row.history.map((historyRow) => (
                              <TableRow key={historyRow.date}>
                                <TableCell component="th" scope="row">
                                  {historyRow.date}
                                </TableCell>
                                <TableCell>{historyRow.customerId}</TableCell>
                                <TableCell align="right">{historyRow.amount}</TableCell>
                                <TableCell align="right">
                                  {Math.round(historyRow.amount * row.price * 100) / 100}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody> */}
                        </Table>                      
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default RequestTableRows;