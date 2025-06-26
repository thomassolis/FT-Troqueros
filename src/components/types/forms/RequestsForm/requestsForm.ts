import { 
  UseFormRegister, 
  FieldErrors, 
  Control, 
  UseFormSetValue, 
  UseFormGetValues, 
  UseFormWatch,
  UseFormStateReturn
} from 'react-hook-form';

export interface Servicio {
  id_conductor?: string;
  id_servicio_datos: string;
  tarifa?: number|string;  
  entrega_vacio?: boolean;
  lugar_origen?: string;
  lugar_destino?: string;
  [key: string]: any; // Para propiedades dinámicas  
}

export interface RequestsData {
  id_servicio?: string;
  // Otros campos de metadata si son necesarios
}

export interface RequestsFormValues {
  id_cliente: string;
  tipo_entregaProveedor: boolean;
  fecha_salida: string;
  hora_salida: string;
  costos_extras: number;
  id_proveedor: string;
  id_servicio_datos: string;
  precio_proveedor: string;
  fecha_limite: string;
  servicios?: Servicio[];
  requestsData?: RequestsData;
  tipo_entregaVacio?: boolean;
  watch?: UseFormWatch<RequestsFormValues>;
}

export interface StepsRequests {
  register: UseFormRegister<RequestsFormValues>;
  setValue: UseFormSetValue<RequestsFormValues>;
  getValues?: UseFormGetValues<RequestsFormValues>;
  watch?: UseFormWatch<RequestsFormValues>;
  errors: FieldErrors<RequestsFormValues>;  
  nextStep?: () => void;
  prevStep?: () => void;
  control: Control<RequestsFormValues>;
  formState?: UseFormStateReturn<RequestsFormValues>;
}

export interface StepsRequestsProps extends StepsRequests {
  customProp?: string;
  // Props adicionales específicas del componente
}