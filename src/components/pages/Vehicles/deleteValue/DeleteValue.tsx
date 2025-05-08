import Swal from "sweetalert2";
import { sendDataForDelete } from "../../../../api/Home/Vehicles/vehicles.routes";
import { sendDataForDeleteCustomers } from "../../../../api/Home/Customers/customers.route";

type VehicleRow = {
    id_chasis?: string;
    id_furgon?: string;
    id_cabezal?: string;
    id_cliente?:string
  };
  
interface DeleteRowProps {
    vehicle?: string;
    nombre?: string;//Nombre de lo que se quiere eliminar, en caso de vehículos es la placa
    // deleteValue: ({ id, vehicleType }: any) => Promise<any>
    vehicleType?: string|undefined
    id?: string|undefined
    setTableData: React.Dispatch<React.SetStateAction<VehicleRow[]>>
    module: string;
    tableData: any
}
export const DeleteRow = ({vehicle, nombre, /*deleteValue,*/ vehicleType, id, setTableData, module, tableData}: DeleteRowProps) =>{
    console.log('module', module);
    console.log('tableData: ', tableData);
    console.log('id: ', id);
    let response:{
        message: string,
        success: boolean
    }

    let title: string | null
    if (module === 'Vehicles'){
        title = `¿Seguro que deseas eliminar el ${vehicle} ${nombre}?`
    }   else if (module === 'Customers') {
        title = `¿Seguro que deseas eliminar el cliente ${nombre}?`
    }   else {
        title = null
    }
    
    try {
        Swal.fire({
            title: title ?? '',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Cancelar",
            denyButtonText: `Eliminar`
        }).then(async (result) => {
            if (result.isDenied) {


                if(module === 'Vehicles'){
                    response = await sendDataForDelete({ id, vehicleType });                    
                }else if (module === 'Customers'){
                    response = await sendDataForDeleteCustomers({id})
                }

                if (response.success) {
                    // Eliminar el elemento del estado tableData
                    setTableData((prevData: VehicleRow[]) => 
                        prevData.filter((item: VehicleRow) => 
                        {module === 'Vehicles' ? (
                            (vehicleType === 'Chasises' && item.id_chasis !== id) ||
                            (vehicleType === 'Furgones' && item.id_furgon !== id) ||
                            (vehicleType === 'Cabezales' && item.id_cabezal !== id)
                        ):(
                            item.id_cliente !== id
                        )

                        }                            
                        )
                    );
                    Swal.fire({
                        title: 'Eliminado!',
                        text: response.message,
                        icon: 'success'
                    });

                }else {
                    Swal.fire({
                        title: 'Error!',
                        text: response.message || `Error al eliminar ${vehicle}`,
                        icon: 'error'
                    });
                }
            
    }});
    } catch (error) {
        console.log('Error en deleteRow', error);
        Swal.fire({
            title: 'Error!',
            text: `Error al eliminar ${vehicle}`,
            icon: 'error'
        });
    }
}