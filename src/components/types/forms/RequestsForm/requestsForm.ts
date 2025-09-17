import { Dispatch, SetStateAction } from 'react';
import {
  UseFormRegister,
  FieldErrors,
  Control,
  UseFormSetValue,
  UseFormGetValues,
  UseFormWatch,
  UseFormStateReturn,
  UseFormReset
} from 'react-hook-form';
import { RouteRow } from '../../../../context/Requests/DynamicRequestsOptions';
import { ServiceType } from '../../../forms/RequestsForm/StepperFormRequest';

//
// DATOS DEL FORMULARIO (React Hook Form)
// ---------------------------------------
export interface CostoExtraExistente {
  id_costos_extras: number;
  descripcion: string;
  precio: number;
}

export interface NuevoCostoExtra {
  descripcion: string;
  precio: number;
}

export interface CostoTemporal {
  descripcion?: string;
  precio?: number;
}
export interface Servicio {
  id_conductor?: string;
  id_servicio_datos: string;
  tarifa?: [
    { 
      descripcion: string, 
      costo: number, 
      venta: number,
      profit: number
    }            
  ];
  entrega_vacio?: boolean;  
  lugar_origen?: string;
  lugar_destino?: string;
  costos_extras?: CostoExtraExistente[];
  nuevos_costos_extras?: NuevoCostoExtra[];
  costo_temporal?: CostoTemporal; // Para el formulario de añadir nuevo costo
  [key: string]: any;
}

export interface RequestsData {
  id_servicio?: string;
}

export interface PaymentData {
  descripcion:string, 
  monto?:number, 
  comprobante:string, 
  costo?:number
}

export interface RequestsFormValues {
  id_cliente?: string|undefined;
  tipo_entregaProveedor?: boolean|undefined;
  fecha_salida?: string;
  hora_salida?: string;
  id_proveedor?: string | null;
  id_servicio_datos?: string;
  isProviderRequest?: boolean;
  precio_proveedor?: number | null;
  fecha_limite?: string;
  servicios?: Servicio[];
  paymentFiles?: []
  paymentData?: PaymentData[]
  requestsData?: RequestsData;
  tipo_entregaVacio?: boolean;
  id_pedidoServicio?: string;
  proveedor?: string;
  numero_factura?:string
  // Eliminado: costos_extras: number; // Esto estaba mal definido
}

//
// PROPS QUE SE PASAN A LOS COMPONENTES Step1, Step2, etc.
// --------------------------------------------------------

export interface StepsRequestsProps {
  // Estados compartidos entre pasos
  requestFormData?: RequestsFormValues;
  setRequestFormData?: Dispatch<SetStateAction<RequestsFormValues>>;
  requestData?: RequestsFormValues;
  useProvider?: boolean | null;
  setUseProvider?: Dispatch<SetStateAction<boolean | null>>;
  rows?: RouteRow[] | null;
  setRows?: Dispatch<SetStateAction<RouteRow[]>>;
  serviceTypes?: ServiceType[];
  setServiceTypes?: Dispatch<SetStateAction<ServiceType[]>>;
  isInitialLoad?: boolean;
  setIsInitialLoad?: Dispatch<SetStateAction<boolean>>;

  // Opcionales si necesitas acceso a funciones del form
  register?: UseFormRegister<RequestsFormValues>;
  setValue?: UseFormSetValue<RequestsFormValues>;
  getValues?: UseFormGetValues<RequestsFormValues>;
  watch?: UseFormWatch<RequestsFormValues>;
  errors?: FieldErrors<RequestsFormValues>;
  control?: Control<RequestsFormValues>;
  formState?: UseFormStateReturn<RequestsFormValues>;
  reset?: UseFormReset<RequestsFormValues>
  // Navegación opcional entre pasos
  nextStep?: () => void;
  prevStep?: () => void;

  // Extras si los necesitas
  customProp?: string;
  activeStep?:number
}
