import { Dispatch, SetStateAction } from 'react';
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
import { ServiceType } from '../../../forms/RequestsForm/StepperFormRequest';

//
// DATOS DEL FORMULARIO (React Hook Form)
// ---------------------------------------

export interface Servicio {
  id_conductor?: string;
  id_servicio_datos: string;
  tarifa?: number | string;
  entrega_vacio?: boolean;
  lugar_origen?: string;
  lugar_destino?: string;
  [key: string]: any;
}

export interface RequestsData {
  id_servicio?: string;
}

export interface RequestsFormValues {
  id_cliente: string;
  tipo_entregaProveedor: boolean;
  fecha_salida: string;
  hora_salida: string;
  costos_extras: number;
  id_proveedor: string | null;
  id_servicio_datos: string;
  isProviderRequest: boolean;
  precio_proveedor: number | null;
  fecha_limite: string;
  servicios?: Servicio[];
  requestsData?: RequestsData;
  tipo_entregaVacio?: boolean;
  id_pedidoServicio: string;
  proveedor?: string;  
}

//
// PROPS QUE SE PASAN A LOS COMPONENTES Step1, Step2, etc.
// --------------------------------------------------------

export interface StepsRequestsProps {
  // Estados compartidos entre pasos
  requestFormData?: RequestsFormValues;
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

  // Navegación opcional entre pasos
  nextStep?: () => void;
  prevStep?: () => void;

  // Extras si los necesitas
  customProp?: string;
}
