import React, { useState } from "react";
import { Icon } from "@iconify/react";
import Select from 'react-select';
import { DoubleConfirmationAlert } from "../../Alerts/DoubleConfirmation/doubleConfirmation";
import { UpdateRequestStatus } from "../../../../api/Home/home.route";
import { useNavigate } from "react-router-dom";

interface Service {
  id: string;
  tipo: string;
  origen: string;
  destino: string;
  tarifa: string;
  status: string;
  sh: string;
  numero_contenedor: string;
  monto: number;
  fecha_creacion: string;
  fecha_salida: string;
  proveedor: string;
  precio_proveedor: string;
  profit: string;
  id_peticion: string;
  cliente: string;
  servicio:string;
  conductor:string;
  chasis: string;
  cabezal: string;
  furgon: string;
  comentario: string;
  size_contenedor:string;
}

export interface TableRowVariables {
  id_peticion: string;
  nombreCliente: string;
  servicio: string;
  sh: string;
  numero_contenedor: string;
  monto: number;
  fecha_creacion: string;
  fecha_salida: string;
  proveedor: string;
  precio_proveedor: number;
  profit: number;
  chasis:string;
  conductor:string;
  cabezal:string;
  furgon:string;
  id:string
  id_proveedor:string;
  comentario:string;
  size_contenedor:string;
  status:string;  
  services: Service[];  
}

interface RequesCollapsibleTableProps {
  tableData: TableRowVariables[];
  setTableData: React.Dispatch<React.SetStateAction<TableRowVariables[]>>;
  procedure: string;
}

export const RequestCollapsibleTable = ({ tableData, setTableData, procedure }: RequesCollapsibleTableProps) => {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [_selectedStatus, setSelectedStatus] = useState<{value: string, label: string} | null>({value: '', label: ''});        
  const navigate = useNavigate();

    const statusOptions = [
      { value: 'en espera', label: 'En Espera' },
      { value: 'en proceso', label: 'En Proceso' },
      { value: 'Completado', label: 'Completado' },
    ];
  const toggleRow = (index: number) => {
    setExpandedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

    const onStatusChange = (rowID: string) => {
        setTableData(prev => prev.filter(r => r.id !== rowID)); // elimina de la tabla  
    };

    const disableRequest = async (requestID:string) => {
      const response = await DoubleConfirmationAlert({
        title:'¿Estás seguro que deseas deshabilitar esta petición?',
        text:'No aparecerán los tiempos de entrega y todo el equipo se encontrará disponible.',
        id: requestID,
        type: 'deleteRequest',
        // onConfirm: () => onDelete?.(requestID)
      });
      if(response.success){
        onStatusChange?.(requestID);
      }    
    }

    const changeRequestStatus = async ({ optionselected, id }: { optionselected: { value: string, label: string }, id: string }) => {
      try {
        const response = await UpdateRequestStatus({ status: optionselected.value, id: id });      
        if(response.success){
          onStatusChange?.(id);
        }            
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

  return (
    <div className="overflow-x-auto max-w-[1260px] mx-auto rounded-lg border border-gray-200">
      <div className="overflow-y-auto max-h-96"> 
        <table className="min-w-full divide-y divide-gray-200 min-h-7 ">
          <thead className="bg-gray-50 z-50">
            <tr>
                   <th className="sticky top-0 bg-gray-50 px-2 py-3 text-xs font-medium text-black uppercase tracking-wider w-[2%]" align="center"></th>

                  {procedure==='completeRequestHistory' ? (
                    ['ID','Cliente', 'Servicio', 'Conductor', 'Chasis', 'Cabezal', 'Furgón', 'SH', 'Contenedor','Tamaño Contenedor','Monto Total','Creación de Petición','Comienzo de Petición','Proveedor','Costo Proveedor','Profit','Comentario'].map((title)=>(
                        <th className="sticky top-0 bg-gray-50 px-2 py-3 text-xs font-medium text-black uppercase tracking-wider w-[2%] z-40" align="center">{title}</th>
                    ))
                  ):(
                    ['ID','Cliente', 'Servicio', 'Conductor', 'Chasis', 'Cabezal', 'Furgón'].map((title)=>(
                        <th className="sticky top-0 bg-gray-50 px-2 py-3 text-xs font-medium text-black uppercase tracking-wider w-[2%] z-40" align="center">{title}</th>
                    ))
                  )}

                  <th className={`sticky top-0 bg-gray-50 py-3 text-xs font-medium text-black uppercase tracking-wider w-[2%] ${procedure==='completeRequestHistory'?'px-16':'px-10'}`} align="center">Status</th>
                  <th className="sticky top-0 bg-gray-50 px-2 py-3 text-xs font-medium text-black uppercase tracking-wider w-[2%]" align="center"></th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {tableData.length>0? (
            tableData.map((item, index) => (
              <React.Fragment key={`${item.id_peticion}-${index}`}>
                {/* Fila principal */}
                <tr
                  onClick={() => navigate(`/home/Request/edit/${item.id_peticion}`)}
                  className={
                    `cursor-pointer transition-colors 
                    ${item.services.length>0?'bg-blue-200':''} 
                    ${item.id_proveedor?'bg-red-100':''}
                    ${
                    expandedRows.includes(index)
                      ? "border-blue-800"
                      : "hover:bg-blue-50"
                    }
                    `}
                >
                  <td className=" py-4 text-gray-900 " align="center" onClick={(e) => {e.stopPropagation(); toggleRow(index)}}>
                    {item.services.length > 0 && (
                      <Icon 
                        icon={expandedRows.includes(index) ? "fe:arrow-up" : "fe:arrow-down"} 
                        width="20" 
                        height="20" 
                      />
                    )}
                  </td>
                  <td className="px-2 py-1 text-sm text-gray-900 max-w-xs break-words whitespace-normal" >
                    {item.id_peticion}
                  </td>
                  <td className="px-2 py-1 text-sm text-gray-500 max-w-xs break-words whitespace-normal " align="center">
                      {item.nombreCliente}
                  </td>
                  <td className="px-2 py-1 text-sm text-gray-500 max-w-xs break-words whitespace-normal" align="center">
                    {item.servicio}
                  </td>
                  <td className="px-2 py-1 text-sm text-gray-500 max-w-xs break-words whitespace-normal" align="center">
                      {item.conductor||'No Asignado'}
                  </td>
                  <td className={`px-2 py-1 text-sm text-gray-500 max-w-xs break-words whitespace-normal ${item.chasis?'':'text-red-500'}`} align="center">
                      {item.chasis||'No Asignado'}
                  </td>
                  <td className={`px-2 py-1 text-sm text-gray-500 max-w-xs break-words whitespace-normal ${item.cabezal?'':'text-red-500'}`} align="center">
                      {item.cabezal||'No Asignado'}
                  </td>
                  <td className={`px-2 py-1 text-sm text-gray-500 max-w-xs break-words whitespace-normal ${item.furgon?'':'text-red-500'}`} align="center">
                      {item.furgon||'No Asignado'}
                  </td>

                  {procedure==='completeRequestHistory' ? (
                    <>
                      <td className={`px-2 py-1 text-sm text-gray-500 max-w-xs break-words whitespace-normal ${item.sh?'':'text-red-500'}`} align="center">
                        {item.sh||'-'}
                      </td>

                      <td className={`px-2 py-1 text-sm text-gray-500 max-w-xs break-words whitespace-normal ${item.numero_contenedor?'':'text-red-500'}`} align="center">
                        {item.numero_contenedor||'-'}
                      </td>

                      <td className={`px-2 py-1 text-sm text-gray-500 max-w-xs break-words whitespace-normal ${item.size_contenedor?'':'text-red-500'}`} align="center">
                        {item.size_contenedor||'-'}
                      </td>

                      <td className={`px-2 py-1 text-sm text-gray-500 max-w-xs break-words whitespace-normal ${item.monto?'':'text-red-500'}`} align="center">
                        {item.monto||'-'}
                      </td>

                      <td className={`px-2 py-1 text-sm text-gray-500 max-w-xs break-words whitespace-normal ${item.fecha_creacion?'':'text-red-500'}`} align="center">
                        {item.fecha_creacion||'-'}
                      </td>

                      <td className={`px-2 py-1 text-sm text-gray-500 max-w-xs break-words whitespace-normal ${item.fecha_salida?'':'text-red-500'}`} align="center">
                        {item.fecha_salida||'-'}
                      </td>

                      <td className={`px-2 py-1 text-sm text-gray-500 max-w-xs break-words whitespace-normal ${item.proveedor?'':'text-red-500'}`} align="center">
                        {item.proveedor||'-'}
                      </td>

                      <td className={`px-2 py-1 text-sm text-gray-500 max-w-xs break-words whitespace-normal ${item.precio_proveedor?'':'text-red-500'}`} align="center">
                        {item.precio_proveedor || '-'}
                      </td>

                      <td className={`px-2 py-1 text-sm text-gray-500 max-w-xs break-words whitespace-normal ${item.profit?'':'text-red-500'}`} align="center">
                        {item.profit || '-'}
                      </td>

                      <td className={`px-2 py-1 text-sm text-gray-500 max-w-xs break-words whitespace-normal ${item.comentario?'':'text-red-500'}`} align="center">
                        {item.comentario || '-'}
                      </td>
                    </>
                  ):null
                  }
                  <td className="px-2 py-1 text-sm text-gray-500 max-w-xs break-words whitespace-normal" onClick={(e)=>{e.stopPropagation()}} align="center">
                      <Select
                          options={statusOptions}       
                          className="z-0"                 
                          value={statusOptions.find(
                            opt => opt.value.toLowerCase() === item.status?.toLowerCase()
                          ) || null}
                          onChange={(optionselected) => {
                              setSelectedStatus(optionselected);
                              if (optionselected) {
                              changeRequestStatus({
                                  optionselected,
                                  id: item.id_peticion,
                              }).then(() => {
                                  onStatusChange(item.id_peticion); // ← aquí disparas el cambio al padre
                              });
                              }
                          }}
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: base => ({ ...base, zIndex: 10 }),
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
                  </td>
                  <td className="px-1 py-1 text-sm text-gray-500 max-w-xs break-words whitespace-normal" align="center" onClick={(e)=>{e.stopPropagation()}}>
                      <Icon
                          icon="line-md:trash"
                          width="25"
                          height="25"
                          className={`${item.status === 'Cancelado' ? 'cursor-not-allowed text-gray-400' : 'text-red-600 hover:text-red-400 cursor-pointer'}`}            
                          onClick={()=>disableRequest(item.id_peticion)}
                      />
                  </td>
                </tr>

                {/* Fila expandible */}
                {expandedRows.includes(index) && item.services.map((service, serviceIndex) => (
                  <tr key={`service-${service.id}-${serviceIndex}`} className="bg-blue-50 hover:bg-blue-100 ">
                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-500 border-t border-blue-100 bg-blue-100"></td>
                    <td className="px-2 py-1 text-sm text-gray-500 bg-blue-100 max-w-xs break-words whitespace-normal" align="center">
                      {service.id_peticion}
                    </td>
                    <td className="px-2 py-1 text-sm text-gray-500 bg-blue-100 max-w-xs break-words whitespace-normal" align="center">
                      {service.cliente}
                    </td>
                    <td className="px-2 py-1 text-sm text-gray-500 bg-blue-100 max-w-xs break-words whitespace-normal" align="center">
                      {service.servicio}
                    </td>
                    <td className={`px-2 py-1 text-sm text-gray-500 bg-blue-100 max-w-xs break-words whitespace-normal ${service.conductor?'':'text-red-500'}`} align="center">
                      {service.conductor || 'No Asignado'}
                    </td>
                    <td className={`px-2 py-1 text-sm text-gray-500 bg-blue-100 max-w-xs break-words whitespace-normal ${service.chasis?'':'text-red-500'}`} align="center">
                      {service.chasis||'No Asignado'}
                    </td>
                    <td className={`px-2 py-1 text-sm text-gray-500 bg-blue-100 max-w-xs break-words whitespace-normal ${service.cabezal?'':'text-red-500'}`} align="center">
                      {service.cabezal}
                    </td>
                    <td className={`px-2 py-1 text-sm text-gray-500 bg-blue-100 max-w-xs break-words whitespace-normal ${service.furgon?'':'text-red-500'}`} align="center">
                      {service.furgon||'No Asignado'}
                    </td>

                    {procedure === 'completeRequestHistory' && (
                      <>
                        <td className={`px-2 py-1 text-sm text-gray-500 bg-blue-100 max-w-xs break-words whitespace-normal ${service.sh?'':'text-red-500'}`} align="center">
                          {service.sh||'-'}
                        </td>
                        <td className={`px-2 py-1 text-sm text-gray-500 bg-blue-100 max-w-xs break-words whitespace-normal ${service.numero_contenedor?'':'text-red-500'}`} align="center">
                          {service.numero_contenedor||'-'}
                        </td>
                        <td className={`px-2 py-1 text-sm text-gray-500 bg-blue-100 max-w-xs break-words whitespace-normal ${service.size_contenedor?'':'text-red-500'}`} align="center">
                          {service.size_contenedor||'-'}
                        </td>
                        <td className={`px-2 py-1 text-sm text-gray-500 bg-blue-100 max-w-xs break-words whitespace-normal ${service.monto?'':'text-red-500'}`} align="center">
                          {service.monto||'-'}
                        </td>
                        <td className={`px-2 py-1 text-sm text-gray-500 bg-blue-100 max-w-xs break-words whitespace-normal ${service.fecha_creacion?'':'text-red-500'}`} align="center">
                          {service.fecha_creacion||'-'}
                        </td>
                        <td className={`px-2 py-1 text-sm text-gray-500 bg-blue-100 max-w-xs break-words whitespace-normal ${service.fecha_salida?'':'text-red-500'}`} align="center">
                          {service.fecha_salida ||'-'}
                        </td>                    
                        <td className={`px-2 py-1 text-sm text-gray-500 bg-blue-100 max-w-xs break-words whitespace-normal ${service.proveedor?'':'text-red-500'}`} align="center">
                          {service.proveedor ||'-'}
                        </td>
                        <td className={`px-2 py-1 text-sm text-gray-500 bg-blue-100 max-w-xs break-words whitespace-normal ${service.precio_proveedor?'':'text-red-500'}`} align="center">
                          {service.precio_proveedor ||'-'}
                        </td>
                        <td className={`px-2 py-1 text-sm text-gray-500 bg-blue-100 max-w-xs break-words whitespace-normal ${service.profit?'':'text-red-500'}`} align="center">
                          {service.profit ||'-'}
                        </td>
                        <td className={`px-2 py-1 text-sm text-gray-500 bg-blue-100 max-w-xs break-words whitespace-normal ${service.comentario?'':'text-red-500'}`} align="center">
                          {service.comentario || '-'}
                      </td>
                      </>
                    )}
                    <td className={`px-2 py-1 text-sm text-gray-500 bg-blue-100 max-w-xs break-words whitespace-normal`} align="center"></td>
                    <td className={`px-2 py-1 text-sm text-gray-500 bg-blue-100 max-w-xs break-words whitespace-normal`} align="center"></td>
                  </tr>
                ))}
              </React.Fragment>
            ))):(             
                  <tr>
                    <td 
                      colSpan={
                        procedure === 'completeRequestHistory' ? 
                        20 : // Número total de columnas cuando procedure es 'completeRequestHistory'
                        10   // Número total de columnas en otros casos
                      } 
                      className="text-center py-4 text-black"
                    >
                      No hay datos disponibles
                    </td>
                  </tr>
              )
          }
          </tbody>
        </table>
      </div>
    </div>
  );
};