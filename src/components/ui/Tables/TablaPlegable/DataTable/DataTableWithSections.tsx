import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../../../inputs/input';
import { deleteRoute } from '../../../../../functions/ServicesModule/Routes/routesFunctions';
import { editRoute } from '../../../../../functions/ServicesModule/Routes/routesFunctions';
import { editService } from '../../../../../functions/ServicesModule/servicesFunctions';
//Funciones de la tabla
import { SubmitTableForm } from './DataTableFunctions/DataTableFunctions';
import { handleEdit } from './DataTableFunctions/DataTableFunctions';
import { DeleteService } from './DataTableFunctions/DataTableFunctions';

function Row(props: { id:any, row: { name: string, history: any[] }, servicesData:any, reloadServices:() => Promise<void> }) {    
  const { id, row, reloadServices } = props; 
  const [open, setOpen] = React.useState(false);
  const [isAdding, setIsAdding] = React.useState(false);
  const [localHistory, setLocalHistory] = useState(row.history); // Estado Interno  

  //Edición de servicio
  const [serviceEdit, setServiceEdit] = useState(false)
  //  const [routeEdit, setRouteEdit] = useState(false)
  const [serviceName, setServiceName] = useState('')
  const [editingRouteId, setEditingRouteId] = useState<number | null>(null);


const {register, handleSubmit, reset} = useForm();


  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} className='flex justify-between w-full ' >
        
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <Icon icon="fe:arrow-up" width="24" height="24" /> : <Icon icon="fe:arrow-down" width="24" height="24" />}
          </IconButton>
        </TableCell>

        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
        

        <TableCell component="th" scope="row">
          {serviceEdit ? (
            <div className='flex items-center'>
              <Input 
                type="text" 
                defaultValue={row.name}
                className2={'w-[50%] text-gray-400'}      
                onChange={(e) =>setServiceName(e.target.value) }
              />
              <Icon icon="ph:check-fill" width="28" height="28" className='text-green-500 rounded-md cursor-pointer hover:text-green-700'  onClick={()=>handleEdit(editService, setServiceEdit, row, serviceName, reloadServices)}/>
              <Icon icon="basil:cancel-solid" width="28" height="28"  className='text-red-600 cursor-pointer hover:text-red-800' onClick={() => setServiceEdit(false)}/>
            </div>              
            ): <span className='font-semibold text-lg'>{row.name}</span>
          }          
        </TableCell>

        <TableCell component="th" scope="row">
            <div className="flex gap-2 justify-center items-center">             
               
                <td className="py-4 whitespace-nowrap text-blue-800">
                <Icon 
                    type='button'
                    icon="uil:edit" 
                    width="24" 
                    height="24" 
                    className="cursor-pointer" 
                    onClick={()=>setServiceEdit(true)}
                    />
                </td>                                                                        
                <td className="py-4 whitespace-nowrap ">
                    <Icon 
                        icon="material-symbols:delete" 
                        width="24" 
                        height="24" 
                        className="cursor-pointer text-red-700" 
                        onClick={()=>DeleteService(id, row.name, reloadServices)}
                    />    
                </td>                                                                        
            </div>  
        </TableCell>        
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Rutas Guardadas
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    {['Lugar de Origen', 'Lugar de Destino', 'Tarifa', 'Tiempo Promedio', 'Acciones'].map((item)=>(
                        <TableCell align="center">{item}</TableCell>    
                    ))}                    
                  </TableRow>
                </TableHead>
                <TableBody className='w-full'>
                  {localHistory.map((historyRow, index) => (
                    
                    <TableRow key={`${historyRow.lugar_origen}-${historyRow.lugar_destino}-${historyRow.tarifa}`}>                                            
                      <TableCell component="th" scope="row" align="center">                        
                        {(editingRouteId === index) ? (
                          <Input
                            defaultValue={historyRow.lugar_origen}
                            type='text'
                            className2={'text-gray-400 w-[90%]'}
                            {...register('lugarOrigen')}                                                   
                          />
                        ):(
                          historyRow.lugar_origen
                        )}
                        
                      </TableCell>
                      
                      <TableCell align="center">
                        {(editingRouteId === index) ? (
                          <Input
                            defaultValue={historyRow.lugar_destino}
                            type='text'
                            className2={'text-gray-400 w-[90%]'}
                            {...register('lugarDestino')}
                          />
                        ):(historyRow.lugar_destino)}                        
                      </TableCell>


                      <TableCell align="center">
                        {(editingRouteId === index) ? (
                        <Input
                            defaultValue={historyRow.tarifa}
                            type='number'                            
                            className2={'text-gray-400 w-[60%]'}
                            {...register('tarifa')}
                          />
                        ):(historyRow.tarifa+'$')}                        
                      </TableCell>

                      <TableCell align="center">
                        {(editingRouteId === index) ? (
                        <Input
                            defaultValue={historyRow.tiempo_estimado}
                            type='number'                            
                            className2={'text-gray-400 w-[60%]'}
                            {...register('tiempo_estimado',{valueAsNumber: true})}
                          />
                        ):(historyRow.tiempo_estimado+'h')}   
                      </TableCell>


                      <TableCell align="center">
                        {(editingRouteId === index) ? (
                          <div className="flex gap-1 justify-center mt-1">
                            <Icon                            
                                icon="ph:check-fill"
                                width="23"
                                height="23"
                                className="text-green-500 cursor-pointer hover:text-green-700"
                                onClick={handleSubmit((data) =>
                                    SubmitTableForm(data, editingRouteId, localHistory, editRoute, row, setLocalHistory, setEditingRouteId, reset, isAdding, setIsAdding)
                                )}
                                
                            />
                            <Icon
                              icon="basil:cancel-solid"
                              width="23"
                              height="23"
                              className="text-red-600 cursor-pointer hover:text-red-800"
                              onClick={() => setEditingRouteId(null)}
                            />
                          </div>
                        ):(
                          <div className='flex gap-3 items-center justify-center'>
                              <Icon 
                                    type='button'
                                  icon="uil:edit" 
                                  width="24" 
                                  height="24" 
                                  className="cursor-pointer hover:text-gray-500"
                                  onClick={(e) => {
                                    e.preventDefault();  // 👈 Evita propagación o efectos colaterales
                                    e.stopPropagation();
                                    // editRoute(historyRow.id_servicio_datos, row.id, setRouteEdit);
                                    setEditingRouteId(index);
                                  }}
                              />

                              <Icon 
                                type='button'
                                  icon="material-symbols:delete" 
                                  width="24" 
                                  height="24" 
                                  className="cursor-pointer hover:text-gray-500"
                                  onClick={()=>{deleteRoute(historyRow.id_servicio_datos, setLocalHistory)}}
                              />
                          </div>
                        )}

                        </TableCell>                                                         
                    </TableRow>
                  ))}

                    {/* ÚLTIMA FILA DE LA TABLA EN DONDE SE AGREGAN NUEVAS FILAS A LA TABLA PARA CREAR NUEVAS RUTAS */}
                {isAdding ? (
                <TableRow>
                    <TableCell align="center">                      
                        <input
                            autoFocus
                            placeholder="Lugar de Origen"
                            style={{ padding: "4px", width: "100%" }}
                            className='border border-gray-300 rounded'
                            {...register('lugarSalida', { required: true })}
                        />                                                               
                    </TableCell>
                    <TableCell align="center">
                    <input
                        placeholder="Lugar de Destino"
                        style={{ padding: "4px", width: "100%" }}
                        className='border border-gray-300 rounded'
                        {...register('lugarLlegada', { required: true })}
                    />
                    </TableCell>
                    <TableCell align="center">
                    <input
                        placeholder="Tarifa $"
                        min={1}
                        type='number'
                        style={{ padding: "4px", width: "100%" }}
                        className='border border-gray-300 rounded'
                        {...register('tarifa', { required: true })}
                    />
                    </TableCell>

                    <TableCell align="center">
                    <input
                      placeholder="Tiempo Estimado2"
                      type="number"
                      style={{ padding: "4px", width: "100%" }}
                      className="border border-gray-300 rounded"
                      {...register("tiempo_estimado", {
                        // en vacío ⇒ undefined; si no, número
                        setValueAs: (v) => v === "" ? 1.5 : Number(v),
                        // opcional: validaciones
                        min: { value: 0, message: "Debe ser ≥ 0" },
                      })}
                    />

                    </TableCell>
                    
                    <TableCell align="center">
                      <button
                          type="submit"
                            onClick={handleSubmit((data) =>
                              SubmitTableForm(data, editingRouteId, localHistory, editRoute, row, setLocalHistory, setEditingRouteId, reset, isAdding, setIsAdding)
                            )}
                          className='p-2 bg-[#007bff] text-white rounded-md hover:bg-blue-400'
                      >Guardar</button>
                    </TableCell>
                </TableRow>
                ) : (
                <TableRow>
                    <TableCell colSpan={4} align="center">
                    <span
                        className="text-gray-400 hover:text-gray-300 cursor-pointer font-semibold"
                        onClick={() => setIsAdding(true)}
                    >
                        + Agregar nueva ruta...
                    </span>
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

export default Row