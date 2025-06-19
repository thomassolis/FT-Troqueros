interface TransformSelectDataProps {
    type: 'service' | 'routes' | 'customers' | 'providers' | 'drivers' | 'vehicles' | 'chasis' | 'cabezal' | 'furgon'
    data: [
        {
            nombre:string
            placa:string
            id_servicio: number
            id_servicio_datos:number
            ruta:string
            id_cliente:string
            id_proveedor:string
            id_conductor:string
            id_chasis:string
            id_furgon:string
            id_cabezal:string
        }
    ]
}

//Cambia los datos recibidos por value/label que son requeridos para el Select
export const TransformSelectData = ({type, data}:TransformSelectDataProps) => {
    let transformedData
    if (type === 'service'){
        transformedData = data.map(item => ({
            value: item.id_servicio.toString(),
            label: item.nombre
        }));
    }else if (type === 'routes'){
        transformedData = data.map(item => ({
            value: item.id_servicio_datos.toString(),
            label: item.ruta
        }));
    }else if (type === 'customers'){
        transformedData = data.map(item => ({
            value: item.id_cliente.toString(),
            label: item.nombre
        }));
    }else if (type === 'providers'){
        transformedData = data.map(item => ({
            value: item.id_proveedor.toString(),
            label: item.nombre
        }));
    }else if (type === 'drivers'){
        transformedData = data.map(item => ({
            value: item.id_conductor.toString(),
            label: item.nombre
        }));
    }else if (type === 'chasis'){
        transformedData = data.map(item => ({
            value: item.id_chasis.toString(),
            label: item.placa
        }));
    } else if (type === 'furgon'){
        transformedData = data.map(item => ({
            value: item.id_furgon.toString(),
            label: item.placa
        }));
    } else if (type === 'cabezal'){
        transformedData = data.map(item => ({
            value: item.id_cabezal.toString(),
            label: item.placa
        }));
    }

    return transformedData;
}