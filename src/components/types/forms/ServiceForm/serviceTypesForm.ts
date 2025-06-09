export type serviceTypes = {
    nombre_servicio: string;
    datos_servicio: {
        [id: string]: {
        lugar_origen: string;
        lugar_destino: string;
        tarifa: number;
        };
    };
}