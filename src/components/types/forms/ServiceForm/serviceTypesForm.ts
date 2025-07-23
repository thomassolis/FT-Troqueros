export interface serviceTypes {
  nombre_servicio: string;
  datos_servicio: {
    lugar_origen: string;
    lugar_destino: string;
    tarifa: number;
    tiempo_estimado?: number; 
  }[];
}
