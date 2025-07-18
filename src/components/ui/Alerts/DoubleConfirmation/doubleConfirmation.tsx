import Swal from "sweetalert2";
import { DeleteServiceFromRequest } from "../../../../api/Requests/requests.route";
import { UpdateRequestStatus } from "../../../../api/Home/home.route";
import { DeleteExtraprice } from "../../../../api/Requests/requests.route";

interface DoubleConfirmationAlertProps {
    title:string;
    text:string;
    id?:string;
    type: string;
}
export const DoubleConfirmationAlert = async ({ title, text, id, type }: DoubleConfirmationAlertProps) => {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
  });

  if (!result.isConfirmed) return { success: false };

  let response;

  if (type === 'deleteService') {
    response = await DeleteServiceFromRequest(id);
  } else if (type === 'deleteRequest') {
    response = await UpdateRequestStatus({ status: 'Cancelado', id: id.requestID });
  } else if (type === 'deleteExtraPrice'){
    response = await DeleteExtraprice(id);
  }  
  console.log('RESPONSE. ', response);
  if (response?.success) {
    await Swal.fire({
      title: "¡Eliminado!",
      text: response.message,
      icon: "success",
    });
    return response; // ✅ Esto se devuelve correctamente
  } else {
    await Swal.fire({
      title: "Error 505",
      text: "Ha habido un problema al eliminar el servicio. Inténtalo más tarde.",
      icon: "error",
    });
    return { success: false }; // ✅ También devuelve algo útil
  }
};

