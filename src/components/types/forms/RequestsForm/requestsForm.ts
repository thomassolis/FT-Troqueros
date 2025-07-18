import { SetStateAction } from 'react';
import { Dispatch } from 'react';
import { ServiceType } from '../../../forms/RequestsForm/StepperFormRequest';
import { 
  UseFormRegister, 
  FieldErrors, 
  Control, 
  UseFormSetValue, 
  UseFormGetValues, 
  UseFormWatch,
  UseFormStateReturn
} from 'react-hook-form';
import { RouteRow } from '../../../../context/Requests/DynamicRequestsOptions';

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
  defaultValues:{}
  fecha_salida: string;
  hora_salida: string;
  costos_extras: number;
  id_proveedor: string|null;
  id_servicio_datos: string;
  isProviderRequest: boolean;
  precio_proveedor: number|null;
  fecha_limite: string;
  servicios?: Servicio[];
  requestsData?: RequestsData;
  tipo_entregaVacio?: boolean;
  watch?: UseFormWatch<RequestsFormValues>;
  errors?: FieldErrors<RequestsFormValues> | null;  
  useProvider?:boolean|null;
  setUseProvider: Dispatch<SetStateAction<boolean | null>>;
  id_pedidoServicio: string
  setRows?: Dispatch<SetStateAction<RouteRow[]>>;
  proveedor?:string
}

export interface StepsRequests {
  register?: UseFormRegister<RequestsFormValues> | null;
  setValue?: UseFormSetValue<RequestsFormValues> | null;
  getValues?: UseFormGetValues<RequestsFormValues>;
  watch?: UseFormWatch<RequestsFormValues> | null;
  errors?: FieldErrors<RequestsFormValues> | null;  
  nextStep?: () => void;
  prevStep?: () => void;
  control?: Control<RequestsFormValues> | null;
  formState?: UseFormStateReturn<RequestsFormValues>;
  rows?: RouteRow[] | null;
  useProvider?:boolean | null
  setUseProvider?: Dispatch<SetStateAction<boolean | null>> | null;
  requestFormData?: RequestsFormValues| null
  setRows?: Dispatch<SetStateAction<RouteRow[]>>;

  serviceTypes?: ServiceType[]
  setServiceTypes?: Dispatch<SetStateAction<ServiceType[]>>;
  isInitialLoad?:boolean
  setIsInitialLoad?: Dispatch<SetStateAction<boolean>>;
  requestData?:RequestsFormValues| null;
}

export interface StepsRequestsProps extends StepsRequests {
  customProp?: string;
  // Props adicionales específicas del componente
}