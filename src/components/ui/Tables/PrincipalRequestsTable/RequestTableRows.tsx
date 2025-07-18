import React,{useEffect} from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import { Icon } from "@iconify/react/dist/iconify.js";
import Select from 'react-select';
import { useState } from 'react';
import { UpdateRequestStatus } from '../../../../api/Home/home.route';
import { useNavigate } from 'react-router-dom';
import { DoubleConfirmationAlert } from '../../Alerts/DoubleConfirmation/doubleConfirmation';
import { title } from 'process';
import { text } from 'stream/consumers';

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
  furgon: string,  
  hora_salida:string,
  fecha_salida:string,
  id_proveedor: string,  
  profit:number,
  status: string,
  precio_proveedor:number,
  fecha_creacion:string,
  monto:number,
  services: {  // Change from tuple to regular array of objects
    conductor: string,
    id_peticion: string,
    cliente: string,
    monto:number,
    servicio: string,
    cabezal: string,
    chasis: string,
    hora_salida:string,
    fecha_creacion:string,
    fecha_salida:string,
    furgon: string,
    customerId: string,
    precio_proveedor:number,
    profit:number,
    date: string,
  }[]  // Note the [] instead of []
) {
  return {
    id,
    nombreCliente,
    servicio,
    precio_proveedor,
    conductor,
    monto,
    fecha_salida,
    chasis,
    cabezal,
    furgon,
    id_proveedor,
    fecha_creacion,
    profit,
    hora_salida,
    status,
    services,
  };
}


interface RequestTableRowsProps {
  row: ReturnType<typeof createData>;
  selectedTab: number; // Añade esta prop
  procedure: string;
  // onStatusChange?: (id: string, newStatus: string) => void;
  // onDelete?: (id: string) => void;
}


function RequestTableRows({ row, selectedTab, procedure }: RequestTableRowsProps) {
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<{value: string, label: string} | null>({value: '', label: ''});      
  useEffect(()=>{
    console.log('selectedStatus', selectedStatus)
  },[selectedStatus])
  const statusOptions = [
  { value: 'en espera', label: 'En Espera' },
  { value: 'en proceso', label: 'En Proceso' },
  { value: 'Completado', label: 'Completada' },
];

  const navigate = useNavigate();  
  //Función que mapea el status recibido para que vaya acorde con el label, value del select
  useEffect(() => {
    if (row.status) {
      const matched = statusOptions.find(opt =>
        opt.label.toLowerCase() === row.status.toLowerCase()
      );
      setSelectedStatus(matched || null);
    }
  }, [row.status]);

  //Función para cambiar el status de una petición
  const changeRequestStatus = async ({ optionselected, id }: { optionselected: { value: string, label: string }, id: string }) => {
    try {
      await UpdateRequestStatus({ status: optionselected.value, id: id });
      // onStatusChange?.(id, optionselected.label);
    } catch (error) {
      console.error('changeRequestStatus: ', error);
    }
  };

  //Cambio de color en las opciones del select
const getStatusTextColor = (statusValue:string) => {
  switch (statusValue) {
    case 'en espera':
      return '#ffc109'; // Amarillo (texto)
    case 'en proceso':
      return '#0d6efd'; // Azul (texto)
    case 'Completado':
      return '#198754'; // Verde (texto)
    default:
      return '#6c757d'; // Gris por defecto
  }
};

const tableCellStyles = {
  width: '13.5%', // Mismo ancho para todas las celdas normales
  maxWidth: '13.5%',
  wordWrap: 'break-word',
  whiteSpace: 'normal',
  padding: '8px',
  border: '1px solid #e0e0e0',
  boxSizing: 'border-box',
};

  const disableRequest = (requestID:string) => {  
    console.log('Row al eliminar: ', row);
    DoubleConfirmationAlert({
      title:'¿Estás seguro que deseas deshabilitar esta petición?',
      text:'No aparecerán los tiempos de entrega y todo el equipo se encontrará disponible.',
      id: requestID,
      type: 'deleteRequest',
      // onConfirm: () => onDelete?.(row.id)
    });
  }
  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} className={` ${(!row.id_proveedor && row.services.length === 0) ? 'hover:bg-gray-300 cursor-pointer' : ''} ? 'hover:bg-gray-200':''} ${row.id_proveedor ? 'bg-green-300 hover:bg-green-400 cursor-pointer' : ''}  ${row.services.length>0? 'bg-blue-200 hover:bg-blue-300 cursor-pointer': ''}`} onClick={()=>navigate(`/home/Request/edit/${row.id}`)}>
        <TableCell sx={{ ...tableCellStyles, width: '2%', maxWidth: '2%' }} onClick={(e) => e.stopPropagation()}>
          {Array.isArray(row.services) && row.services.length > 0 ? (                        
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <Icon icon="fe:arrow-up" width="24" height="24" /> : <Icon icon="fe:arrow-down" width="24" height="24" />}            
            </IconButton>
          ) : null}

        </TableCell>
        <TableCell align="center" sx={{...tableCellStyles, width: '8%', maxWidth: '8%'}}> 
          <p style={{ margin: 0, wordBreak: 'break-word' }} className={`font-bold ${row.id ? '' : 'text-red-500'}`}>{row.id}</p>
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
        {procedure==='home'&&(
          <>
        <TableCell align="center" sx={{ ...tableCellStyles, width: '12%', maxWidth: '12%' }} onClick={(e) => e.stopPropagation()}>          
        <Select
            options={statusOptions}
            value={selectedStatus}
            onChange={(optionselected) => {
              setSelectedStatus(optionselected);
              if (optionselected) {  // Only proceed if optionselected exists
                console.log('optionselected',optionselected);
                changeRequestStatus({
                  optionselected: optionselected, 
                  id: row.id
                });
              }
            }}
          styles={{
            option: (provided, state) => ({
              ...provided,
              color: getStatusTextColor(state.data.value),
              backgroundColor: state.isSelected 
                ? "rgba(13, 110, 253, 0.5)" // Fondo azul muy claro al seleccionar
                : provided.backgroundColor,
              "&:hover": {
                backgroundColor: "rgba(13, 110, 253, 0.2)", // Fondo al pasar el mouse
              },
            }),
            singleValue: (provided, state) => ({
              ...provided,
              color: getStatusTextColor(state.data.value),
            }),
          }}
        />
        </TableCell>

          {row.status === 'En espera' && (
            <TableCell onClick={(e) => e.stopPropagation()} sx={{...tableCellStyles, width: '2%', maxWidth: '2%'}}>
              <Icon
                icon="line-md:trash"
                width="25"
                height="25"
                className="text-red-600 cursor-pointer hover:text-red-400"            
                onClick={()=>disableRequest({requestID:row.id})}
              />
            </TableCell>
          )}
          </>
        )}

        {procedure === 'completeRequestHistory' && (
          <>
            <TableCell align="center" sx={{...tableCellStyles, width: '12%', maxWidth: '12%'}}> 
              <p style={{ margin: 0, wordBreak: 'break-word' }} className={row.monto ? '' : 'text-red-500'}>{row.monto || 'No asignado'}</p>
            </TableCell>

            <TableCell align="center" sx={{...tableCellStyles, width: '12%', maxWidth: '12%'}}> 
              <p style={{ margin: 0, wordBreak: 'break-word' }} className={row.precio_proveedor ? '' : 'text-red-500'}>{row.precio_proveedor || '-'}</p>
            </TableCell>

            <TableCell align="center" sx={{...tableCellStyles, width: '12%', maxWidth: '12%'}}> 
              <p style={{ margin: 0, wordBreak: 'break-word' }} className={row.profit ? '' : ''}>{row.profit || '-'}</p>
            </TableCell>

            <TableCell align="center" sx={{...tableCellStyles, width: '12%', maxWidth: '12%'}}> 
              <p style={{ margin: 0, wordBreak: 'break-word' }} className={row.fecha_creacion ? '' : ''}>{row.fecha_creacion || '-'}</p>
            </TableCell>

            <TableCell align="center" sx={{...tableCellStyles, width: '12%', maxWidth: '12%'}}> 
              <p style={{ margin: 0, wordBreak: 'break-word' }} className={row.fecha_salida ? '' : ''}>{row.fecha_salida || '-'}</p>
            </TableCell>

            <TableCell align="center" sx={{...tableCellStyles, width: '12%', maxWidth: '12%'}}> 
              <p style={{ margin: 0, wordBreak: 'break-word' }} className={row.hora_salida ? '' : ''}>{row.hora_salida || '-'}</p>
            </TableCell>

            <TableCell align="center" sx={{ ...tableCellStyles, width: '12%', maxWidth: '12%' }} onClick={(e) => e.stopPropagation()}>          
              <Select
                  options={statusOptions}
                  value={selectedStatus}
                  onChange={(optionselected) => {
                    setSelectedStatus(optionselected);
                    if (optionselected) {  // Only proceed if optionselected exists
                      changeRequestStatus({
                        optionselected: optionselected, 
                        id: row.id
                      });
                    }
                  }}
                styles={{
                  option: (provided, state) => ({
                    ...provided,
                    color: getStatusTextColor(state.data.value),
                    backgroundColor: state.isSelected 
                      ? "rgba(13, 110, 253, 0.5)" // Fondo azul muy claro al seleccionar
                      : provided.backgroundColor,
                    "&:hover": {
                      backgroundColor: "rgba(13, 110, 253, 0.2)", // Fondo al pasar el mouse
                    },
                  }),
                  singleValue: (provided, state) => ({
                    ...provided,
                    color: getStatusTextColor(state.data.value),
                  }),
                }}
              />
            </TableCell>

            {row.status === 'En espera' && (
            <TableCell onClick={(e) => e.stopPropagation()} sx={{...tableCellStyles, width: '2%', maxWidth: '2%'}}>
              <Icon
                icon="line-md:trash"
                width="25"
                height="25"
                className="text-red-600 cursor-pointer hover:text-red-400"            
                onClick={()=>disableRequest({requestID:row.id})}
              />
            </TableCell>
          )}
          </>
        )}

      </TableRow>      




      {/* __________________________________________________________ SUBTABLAA __________________________________________________________*/}
      <TableRow >
        <TableCell
          style={{ padding: 0}}
          padding="none"
          colSpan={procedure === 'home'? 10:15}          
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

        <TableBody>
          {row.services?.map((historyRow) => (
            <TableRow key={`${historyRow.date}-${historyRow.customerId}`} className='bg-blue-200'> {/* Key más único */}              
              <TableCell align='center' sx={{ ...tableCellStyles, width: '4.6%', maxWidth: '4.6%' }}></TableCell>
              <TableCell align='center' sx={{ ...tableCellStyles, width: '8%', maxWidth: '8%' }}>
                  <p className='font-bold py-1'>{historyRow.id_peticion}</p>
              </TableCell>
              <TableCell align='center' sx={tableCellStyles} className='bg-emerald-400'>
                <p style={{ margin: 0, wordBreak: 'break-word' }}>{historyRow.cliente}</p>
              </TableCell>
              <TableCell align='center' sx={tableCellStyles}>
                <p style={{ margin: 0, wordBreak: 'break-word' }}>{historyRow.servicio}</p>
              </TableCell>
              <TableCell align='center' sx={tableCellStyles}>
                <p style={{ margin: 0, wordBreak: 'break-word' }} className={historyRow.conductor ? '' : 'text-red-500'}>
                  {historyRow.conductor || 'No asignado'}
                </p>
              </TableCell>

              <TableCell align='center' sx={{ ...tableCellStyles, width: '12%', maxWidth: '12%' }}>
                <p style={{ margin: 0, wordBreak: 'break-word' }} className={historyRow.chasis ? '' : 'text-red-500'}>
                  {historyRow.chasis || 'No asignado'}
                </p>
              </TableCell>

              <TableCell align='center' sx={{ ...tableCellStyles, width: '12%', maxWidth: '12%' }}>
                <p style={{ margin: 0, wordBreak: 'break-word' }} className={historyRow.cabezal ? '' : 'text-red-500'}>
                  {historyRow.cabezal || 'No asignado'}
                </p>
              </TableCell>

              <TableCell align='center' sx={{ ...tableCellStyles, width: '12%', maxWidth: '12%' }}>
                <p style={{ margin: 0, wordBreak: 'break-word' }} className={historyRow.furgon ? '' : 'text-red-500'}>
                  {historyRow.furgon || 'No asignado'}
                </p>
              </TableCell>



              {procedure === 'completeRequestHistory' ? (
                <>
                  <TableCell align='center' sx={{ ...tableCellStyles, width: '12%', maxWidth: '12%' }}>
                    <p style={{ margin: 0, wordBreak: 'break-word' }} className={historyRow.monto ? '' : 'text-red-500'}>
                      {historyRow.monto || '-'}
                    </p>
                  </TableCell>

                  <TableCell align='center' sx={{ ...tableCellStyles, width: '12%', maxWidth: '12%' }}>
                    <p style={{ margin: 0, wordBreak: 'break-word' }} className={historyRow.precio_proveedor ? '' : 'text-red-500'}>
                      {historyRow.precio_proveedor || '-'}
                    </p>
                  </TableCell>

                  <TableCell align='center' sx={{ ...tableCellStyles, width: '12%', maxWidth: '12%' }}>
                    <p style={{ margin: 0, wordBreak: 'break-word' }} className={historyRow.profit ? '' : 'text-red-500'}>
                      {historyRow.profit || '-'}
                    </p>
                  </TableCell>

                  <TableCell align='center' sx={{ ...tableCellStyles, width: '12%', maxWidth: '12%' }}>
                    <p style={{ margin: 0, wordBreak: 'break-word' }} className={historyRow.fecha_creacion ? '' : 'text-red-500'}>
                      {historyRow.fecha_creacion || '-'}
                    </p>
                  </TableCell>

                  <TableCell align='center' sx={{ ...tableCellStyles, width: '12%', maxWidth: '12%' }}>
                    <p style={{ margin: 0, wordBreak: 'break-word' }} className={historyRow.fecha_salida ? '' : 'text-red-500'}>
                      {historyRow.fecha_salida || '-'}
                    </p>
                  </TableCell>

                  <TableCell align='center' sx={{ ...tableCellStyles, width: '12%', maxWidth: '12%' }}>
                    <p style={{ margin: 0, wordBreak: 'break-word' }} className={historyRow.hora_salida ? '' : 'text-red-500'}>
                      {historyRow.hora_salida || '-'}
                    </p>
                  </TableCell>


                  <TableCell align='center' sx={{ ...tableCellStyles, width: '12%', maxWidth: '12%' }}>Status</TableCell>              
                </>
              ):(
                <TableCell align='center' sx={{ ...tableCellStyles, width: '12%', maxWidth: '12%' }}></TableCell>              
              )}
            </TableRow>
          )) ?? (
            <TableRow>
              <TableCell colSpan={10} align="center">
                No hay datos de historial
              </TableCell>
            </TableRow>
          )}
        </TableBody>
                        </Table>                      
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default RequestTableRows;