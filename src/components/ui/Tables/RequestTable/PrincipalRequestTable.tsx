import React, { useState } from "react";
import { Icon } from "@iconify/react";
import Select from 'react-select';
import { DoubleConfirmationAlert } from "../../Alerts/DoubleConfirmation/doubleConfirmation";
import { UpdateRequestStatus } from "../../../../api/Home/home.route";
import { useNavigate } from "react-router-dom";
import { FadeLoader } from "react-spinners";

interface Service {
  id: string;
  tipo: string;
  origen: string;
  destino: string;
  hora_salida: string;
  numero_factura: string;
  tarifa: string;
  status: string;
  cliente:string;
  sh: string;
  numero_contenedor: string;
  monto: number;
  fecha_creacion: string;
  fecha_salida: string;
  proveedor: string;
  precio_proveedor: string;
  profit: string;
  id_peticion: string;
  nombre_cliente:string;
  servicio:string;
  conductor:string;
  id_Pedido_Servicio:number
  chasis: string;
  cabezal: string;
  furgon: string;
  comentario: string;
  size_contenedor:string;
  lugar_origen:string;
  lugar_destino:string;
  costo:number;
  venta:number;
}

export interface TableRowVariables {
  id_peticion: string;
  id_proveedor: string;
  nombre_cliente: string;
  servicio: string;
  sh: string;
  numero_contenedor: string;
  tarifa: number;
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
  proveedor_id:string;
  comentario:string;
  size_contenedor:string;
  status:string;  
  lugar_origen:string;
  lugar_destino:string;
  numero_factura:string;
  costo:number;
  venta:number;
  services: Service[];  
}

interface RequesCollapsibleTableProps {
  tableData: TableRowVariables[];
  setTableData: React.Dispatch<React.SetStateAction<TableRowVariables[]>>;
  procedure: string;
  _isLoading: boolean;
}

export const RequestCollapsibleTable = ({ tableData, setTableData, procedure, _isLoading }: RequesCollapsibleTableProps) => {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [_selectedStatus, setSelectedStatus] = useState<{ value: string, label: string } | null>({ value: '', label: '' });
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

  const changeServiceStatus = async ({ optionselected, requestID, serviceID }: { optionselected: { value: string, label: string }, requestID: string, serviceID: number }) => {    
    try {
      const response = await UpdateRequestStatus({ status: optionselected.value, id: requestID });
      if (response.success) {
        // Modificar el estado de un servicio específico
        setTableData(prevData => prevData.map(item => {
          if (item.id_peticion === requestID) {
            // Actualizamos el estado del servicio dentro de 'services'
            const updatedServices = item.services.map(service => {
              if (service.id_Pedido_Servicio === serviceID) {
                return { ...service, status: optionselected.value };
              }
              return service;
            });
            return { ...item, services: updatedServices };
          }
          return item;
        }));
      }
    } catch (error) {
      console.error('changeRequestStatus: ', error);
    }
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


  const getStatusTextColor = (statusValue: string) => {
    switch (statusValue) {
      case 'en espera':
        return '#ffc109'; // Amarillo
      case 'en proceso':
        return '#0d6efd'; // Azul
      case 'Completado':
        return '#198754'; // Verde
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
              <th className="sticky top-0 bg-gray-50 px-2 py-3 text-xs font-medium text-black uppercase tracking-wider w-[2%]" align="center"></th>

              {procedure === 'completeRequestHistory' ? (
                ['ID', 'Cliente', 'Servicio', 'Conductor', 'Chasis', 'Cabezal', 'Furgón', 'SH', 'Contenedor', 'Tamaño Contenedor', 'Costo Total', 'Venta Total', 'Comienzo de Petición', 'Proveedor', 'Costo Proveedor', 'Profit', 'Comentario', '# Facturación'].map((title) => (
                  <th className="sticky top-0 bg-gray-50 px-2 py-3 text-xs font-medium text-black uppercase tracking-wider w-[2%] z-40" align="center">{title}</th>
                ))
              ) : (
                ['ID', 'Cliente', 'Servicio', 'Conductor', 'Chasis', 'Cabezal', 'Furgón'].map((title) => (
                  <th className="sticky top-0 bg-gray-50 px-2 py-3 text-xs font-medium text-black uppercase tracking-wider w-[2%] z-40" align="center">{title}</th>
                ))
              )}

              <th className={`sticky top-0 bg-gray-50 py-3 text-xs font-medium text-black uppercase tracking-wider w-[2%] ${procedure === 'completeRequestHistory' ? 'px-16' : 'px-10'}`} align="center">Status</th>
              <th className="sticky top-0 bg-gray-50 py-3 text-xs font-medium text-black uppercase tracking-wider w-[1%]" align="center"></th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {tableData.length > 0 ? (
              tableData.map((item, index) => (
                <React.Fragment key={`${item.id_peticion}-${index}`}>
                  {/* Fila principal - el primer servicio será el padre */}
                  {item.services[0] && (
                    <tr
                      onClick={() => navigate(`/home/Request/edit/${item.id_peticion}`)}
                      className={`
                        cursor-pointer transition-colors 
                        ${item.services.length > 1 ? 'bg-blue-200' : ''} 
                        ${item.id_proveedor ? 'bg-red-100' : ''}
                        ${expandedRows.includes(index) ? "border-blue-800" : "hover:bg-blue-50"}
                      `}
                    >
                      <td className="py-4 text-gray-900 " align="center" onClick={(e) => { e.stopPropagation(); toggleRow(index) }}>
                        {item.services.length > 1 && (
                          <Icon
                            icon={expandedRows.includes(index) ? "fe:arrow-up" : "fe:arrow-down"}
                            width="20"
                            height="20"
                          />
                        )}
                      </td>

                      <td className="py-4 text-gray-900 " align="center" onClick={(e) => { e.stopPropagation(); toggleRow(index) }}>
                        <Icon
                          icon="mdi:invoice-check"
                          width="24"
                          height="24"
                          className={`${item.services[0].numero_factura ? 'text-green-600' : 'text-gray-400'}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/home/Request/edit/${item.id_peticion}`, { state: { jumpToStep: 4 } });
                          }}
                        />
                      </td>

                      <td className="px-2 py-1 text-sm text-gray-900 max-w-xs break-words whitespace-normal">
                        {item.services[0].id_peticion}
                      </td>
                      <td className="px-2 py-1 text-sm text-gray-500 max-w-xs break-words whitespace-normal" align="center">
                        {item.services[0].cliente}
                      </td>
                      <td className="px-2 py-1 text-sm text-gray-500 max-w-xs break-words whitespace-normal" align="center">
                        {item.services[0].servicio} ({item.services[0].lugar_origen}-{item.services[0].lugar_destino})
                      </td>
                      <td className="px-2 py-1 text-sm text-gray-500 max-w-xs break-words whitespace-normal" align="center">
                        {item.services[0].conductor || 'No Asignado'}
                      </td>
                      <td className={`px-2 py-1 text-sm text-gray-500 max-w-xs break-words whitespace-normal ${item.services[0].chasis ? '' : 'text-red-500'}`} align="center">
                        {item.services[0].chasis || 'No Asignado'}
                      </td>
                      <td className={`px-2 py-1 text-sm text-gray-500 max-w-xs break-words whitespace-normal ${item.services[0].cabezal ? '' : 'text-red-500'}`} align="center">
                        {item.services[0].cabezal || 'No Asignado'}
                      </td>
                      <td className={`px-2 py-1 text-sm text-gray-500 max-w-xs break-words whitespace-normal ${item.services[0].furgon ? '' : 'text-red-500'}`} align="center">
                        {item.services[0].furgon || 'No Asignado'}
                      </td>

                      {procedure === 'completeRequestHistory' && (
                        <>
                          <td className={`px-2 py-1 text-sm text-gray-500 max-w-xs break-words whitespace-normal ${item.services[0].sh ? '' : 'text-red-500'}`} align="center">
                            {item.services[0].sh || '-'}
                          </td>
                          <td className={`px-2 py-1 text-sm text-gray-500 max-w-xs break-words whitespace-normal ${item.services[0].numero_contenedor ? '' : 'text-red-500'}`} align="center">
                            {item.services[0].numero_contenedor || '-'}
                          </td>
                          <td className={`px-2 py-1 text-sm text-gray-500 max-w-xs break-words whitespace-normal ${item.services[0].size_contenedor ? '' : 'text-red-500'}`} align="center">
                            {item.services[0].size_contenedor || '-'}
                          </td>
                          <td className={`px-2 py-1 text-sm text-gray-500 max-w-xs break-words whitespace-normal ${item.services[0].costo ? '' : 'text-red-500'}`} align="center">
                            {item.services[0].costo || 0}
                          </td>
                          <td className={`px-2 py-1 text-sm text-gray-500 max-w-xs break-words whitespace-normal ${item.services[0].venta ? '' : 'text-red-500'}`} align="center">
                            {item.services[0].venta || '-'}
                          </td>
                          <td className={`px-2 py-1 text-sm text-gray-500 max-w-xs break-words whitespace-normal ${item.services[0].fecha_salida ? '' : 'text-red-500'}`} align="center">
                            {`${item.services[0].fecha_salida}-${item.services[0].hora_salida}` || '-'}
                          </td>
                          <td className={`px-2 py-1 text-sm text-gray-500 max-w-xs break-words whitespace-normal ${item.services[0].proveedor ? '' : 'text-red-500'}`} align="center">
                            {item.services[0].proveedor || '-'}
                          </td>
                          <td className={`px-2 py-1 text-sm text-gray-500 max-w-xs break-words whitespace-normal ${item.services[0].precio_proveedor ? '' : 'text-red-500'}`} align="center">
                            {item.services[0].precio_proveedor || '-'}
                          </td>
                          <td className={`px-2 py-1 text-sm text-gray-500 max-w-xs break-words whitespace-normal ${item.services[0].profit ? '' : 'text-red-500'}`} align="center">
                            {item.services[0].profit || '-'}
                          </td>
                          <td className={`px-2 py-1 text-sm text-gray-500 max-w-xs break-words whitespace-normal ${item.services[0].comentario ? '' : 'text-red-500'}`} align="center">
                            {item.services[0].comentario || '-'}
                          </td>
                          <td className={`px-2 py-1 text-sm text-gray-500 max-w-xs break-words whitespace-normal`} align="center" onClick={(e) => { e.stopPropagation() }}>
                            {item.numero_factura}
                          </td>
                        </>
                      )}
                      <td className="px-2 py-1 text-sm text-gray-500 max-w-xs break-words whitespace-normal" onClick={(e) => { e.stopPropagation() }} align="center">
                        <Select
                          options={statusOptions}
                          className="z-0"
                          value={statusOptions.find(opt => opt.value.toLowerCase() === item.services[0].status?.toLowerCase()) || null}
                          onChange={(optionselected) => {
                            setSelectedStatus(optionselected);
                            if (optionselected) {
                              changeServiceStatus({
                                optionselected,
                                requestID: item.id_peticion,
                                serviceID: item.services[0].id_Pedido_Servicio
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

                      <td className="px-1 py-1 text-sm text-gray-500 max-w-xs break-words whitespace-normal" align="center" onClick={(e) => { e.stopPropagation() }}>
                        <Icon
                          icon="line-md:trash"
                          width="25"
                          height="25"
                          className={`${item.services[0].status === 'Cancelado' ? 'cursor-not-allowed text-gray-400' : 'text-red-600 hover:text-red-400 cursor-pointer'}`}
                          onClick={() => disableRequest(item.id_peticion)}
                        />
                      </td>
                    </tr>
                  )}

                  {/* Fila expandible: renderizamos los servicios */}
                  {expandedRows.includes(index) && item.services.slice(1).map((service, serviceIndex) => (
                    <tr key={`service-${service.id_Pedido_Servicio}-${serviceIndex}`} className="bg-blue-50 hover:bg-blue-100">
                      {/* Renderizamos los servicios, pero sin los controles */}
                      <td className="px-2 py-1 text-sm text-gray-500" align="center"></td>
                      <td className="px-2 py-1 text-sm text-gray-500" align="center"></td>
                      <td className="px-2 py-1 text-sm text-gray-500" align="center">{service.id_peticion}</td>
                      <td className="px-2 py-1 text-sm text-gray-500" align="center">{service.cliente}</td>
                      <td className="px-2 py-1 text-sm text-gray-500" align="center">{service.servicio}</td>
                      <td className="px-2 py-1 text-sm text-gray-500" align="center">{service.conductor || 'No Asignado'}</td>
                      <td className={`px-2 py-1 text-sm text-gray-500 ${service.chasis ? '' : 'text-red-500'}`} align="center">{service.chasis || 'No Asignado'}</td>
                      <td className={`px-2 py-1 text-sm text-gray-500 ${service.cabezal ? '' : 'text-red-500'}`} align="center">{service.cabezal || 'No Asignado'}</td>
                      <td className={`px-2 py-1 text-sm text-gray-500 ${service.furgon ? '' : 'text-red-500'}`} align="center">{service.furgon || 'No Asignado'}</td>
                      

                      {procedure === 'completeRequestHistory' ? (
                        <>
                          <td className={`px-2 py-1 text-sm text-gray-500 ${service.sh ? '' : 'text-red-500'}`} align="center">{service.sh || '-'}</td>
                          <td className={`px-2 py-1 text-sm text-gray-500 ${service.numero_contenedor ? '' : 'text-red-500'}`} align="center">{service.numero_contenedor || '-'}</td>
                          <td className={`px-2 py-1 text-sm text-gray-500 ${service.size_contenedor ? '' : 'text-red-500'}`} align="center">{service.size_contenedor || '-'}</td>
                          <td className={`px-2 py-1 text-sm text-gray-500 ${service.costo ? '' : 'text-red-500'}`} align="center">{service.costo || 0}</td>
                          <td className={`px-2 py-1 text-sm text-gray-500 ${service.venta ? '' : 'text-red-500'}`} align="center">{service.venta || '-'}</td>
                          <td className={`px-2 py-1 text-sm text-gray-500 ${service.fecha_salida ? '' : 'text-red-500'}`} align="center">{service.fecha_salida || '-'}</td>
                          <td className={`px-2 py-1 text-sm text-gray-500 ${service.proveedor ? '' : 'text-red-500'}`} align="center">{service.proveedor || '-'}</td>
                          <td className={`px-2 py-1 text-sm text-gray-500 ${service.precio_proveedor ? '' : 'text-red-500'}`} align="center">{service.precio_proveedor || '-'}</td>
                          <td className={`px-2 py-1 text-sm text-gray-500 ${service.profit ? '' : 'text-red-500'}`} align="center">{service.profit || '-'}</td>
                          <td className={`px-2 py-1 text-sm text-gray-500 ${service.comentario ? '' : 'text-red-500'}`} align="center">{service.comentario || '-'}</td>
                          <td className="px-2 py-1 text-sm text-gray-500" align="center">{service.numero_factura || '-'}</td>
                          <td className="px-2 py-1 text-sm text-gray-500" align="center">{service.status || '-'}</td>
                          <td className="px-2 py-1 text-sm text-gray-500" align="center"></td>
                        </>
                      ):(
                        <>
                        <td className={`px-2 py-1 text-sm text-gray-500 ${service.furgon ? '' : 'text-red-500'}`} align="center"></td>
                      <td className={`px-2 py-1 text-sm text-gray-500 ${service.furgon ? '' : 'text-red-500'}`} align="center"></td>
                        </>
                      )}
                      
                    </tr>

            ))}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={procedure === 'completeRequestHistory' ? 20 : 10} className="text-center py-4 text-black">
                  {_isLoading ? (
                    <div className="flex justify-center">
                      <FadeLoader />
                    </div>
                  ) : 'No hay datos disponibles'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
