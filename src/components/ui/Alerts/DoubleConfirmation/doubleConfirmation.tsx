import Swal from "sweetalert2";
import { DeleteServiceFromRequest } from "../../../../api/Requests/requests.route";
import { UpdateRequestStatus } from "../../../../api/Home/home.route";
import { DeleteExtraprice } from "../../../../api/Requests/requests.route";

interface DoubleConfirmationAlertProps {
    title: string;
    text: string;
    id?: string|number|undefined; // ID general (string o undefined)
    requestID?: string; // ID específico para requests
    type: 'deleteService' | 'deleteRequest' | 'deleteExtraPrice';
}

export const DoubleConfirmationAlert = async ({
    title,
    text,
    id,
    requestID,
    type
}: DoubleConfirmationAlertProps) => {
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

    try {
        let response;

        switch (type) {
            case 'deleteService':
                if (!id) throw new Error("ID faltante");
                response = await DeleteServiceFromRequest(id);
                break;
                
            case 'deleteRequest':
                if (!requestID) throw new Error("requestID faltante");
                response = await UpdateRequestStatus({ 
                    status: 'Cancelado', 
                    id: requestID // Pasamos directamente el string
                });
                break;
                
            case 'deleteExtraPrice':
                if (!id) throw new Error("ID faltante");
                response = await DeleteExtraprice(id);
                break;
        }

        if (response?.success) {
            await Swal.fire({
                title: "¡Eliminado!",
                text: response.message,
                icon: "success",
            });
            return response;
        }

        throw new Error("Error en la operación");

    } catch (error) {
        await Swal.fire({
            title: "Error",
            text: error instanceof Error ? error.message : "Error desconocido",
            icon: "error",
        });
        return { success: false };
    }
};