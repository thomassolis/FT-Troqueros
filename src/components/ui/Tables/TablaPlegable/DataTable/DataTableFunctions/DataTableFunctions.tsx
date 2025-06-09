import Swal from 'sweetalert2'
import { ServicesActions } from '../../../../../../api/Services/services.route';
import { RoutesActions } from '../../../../../../api/Services/services.route';
import { serviceTypes } from '../../../../../types/forms/ServiceForm/serviceTypesForm';
//Función que se encarga de enviar el formulario cuando se quiere agregar una nueva ruta a un servicio o cuando se quiere editar el nombre de un servicio

export const SubmitTableForm = async(
  data: any, 
  editingRouteId:number|null, 
  localHistory:any, 
  editRoute:any, 
  row: any, 
  setLocalHistory:any, 
  setEditingRouteId:any, 
  reset:any, 
  isAdding:boolean, 
  setIsAdding:any) => {

  if (editingRouteId !== null) {
    const routeId = localHistory[editingRouteId].id_servicio_datos;

    const response = await editRoute(routeId, row.id, {
      lugarOrigen: data.lugarOrigen,
      lugarDestino: data.lugarDestino,
      tarifa: data.tarifa,
    });

    if (response?.success) {
      const updatedHistory = localHistory.map((item:{}, idx:number) =>
        idx === editingRouteId
          ? {
              ...item,
              lugar_origen: data.lugarOrigen,
              lugar_destino: data.lugarDestino,
              tarifa: data.tarifa,
            }
          : item
      );

      setLocalHistory(updatedHistory);
      setEditingRouteId(null);
      reset();
    }
  } else if (isAdding) {
    // Creación de nueva ruta
    const newEntry = {
      lugar_origen: data.lugarSalida,
      lugar_destino: data.lugarLlegada,
      tarifa: data.tarifa,
      id_servicio:row.id,
      id_servicio_datos: Date.now(), // ID temporal hasta que se confirme con el backend
    };

    console.log('NewEntry: ', newEntry);

    RoutesActions('add', newEntry);
    setLocalHistory((prev:any) => [...prev, newEntry]);
    setIsAdding(false);
    reset();
  }
};

//Esta función lo que hace es que cuando se quiere editar un servicio se vuelva a cargar la tabla para así se muestre en cambio en la UI
export const handleEdit = async (editService:any, setServiceEdit:any, row:any, serviceName:string, reloadServices:() => Promise<void>) => {      
    await editService(setServiceEdit, row.id, serviceName)
    setServiceEdit(false);
    await reloadServices(); // 🔁 refetch después de editar
};

//Función para eliminar un servicio
export const DeleteService = async (id: string, serviceName: string, reloadServices?: () => Promise<void>) => {
  console.log('idid', id);
  console.log('serviceName', serviceName);

  const result = await Swal.fire({
    title: `¿Seguro que deseas eliminar el servicio "${serviceName}"?`,
    text: "Ten en cuenta que se perderán todas las rutas con sus tarifas.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    cancelButtonText: "Cancelar",
    confirmButtonText: "Eliminar",
  });

  if (result.isConfirmed) {
    const response = await ServicesActions('delete', id);

    if (response?.success) {
      await Swal.fire({
        title: "Eliminado",
        text: "El servicio ha sido eliminado correctamente.",
        icon: "success"
      });

      if (reloadServices) {
        await reloadServices(); // 🔁 refresca la lista si se pasó una función de refetch
      }
    }else {
        await Swal.fire({
            title: "Error",
            text: "Ha ocurrido un error al momento de eliminar el servicio.",
            icon: "error"
        });
    }
  }
};
