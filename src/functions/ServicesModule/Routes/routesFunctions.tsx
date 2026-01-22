import { RoutesActions } from "../../../api/Services/services.route";


export const deleteRoute = async(
  id_servicio_datos: string, 
  setLocalHistory: React.Dispatch<React.SetStateAction<any[]>>
) => {

  

  try{
    const response = await RoutesActions('delete', id_servicio_datos);
    

    if(response.success){
      setLocalHistory(prev =>
        prev.filter(item => item.id_servicio_datos !== id_servicio_datos)
      );
    }
  }catch(error){
    console.error('Error en: deleteRoute', error)
  }

};

export const editRoute = async(id_servicio_datos: string, /*setEditingRouteId:any*/data:any) => {    
    const updateRouteData = {
        // serviceID: id,
        id_servicio_datos: id_servicio_datos,
        lugar_origen: data.lugarOrigen,
        lugar_destino: data.lugarDestino,
        tarifa: data.tarifa,
        tiempo_estimado: data.tiempo_estimado
    }    
        

    try{        
        const response = await RoutesActions('update', updateRouteData);


        return response;
    }catch(error){
        console.error('Error en: deleteRoute', error)
    }  
};
