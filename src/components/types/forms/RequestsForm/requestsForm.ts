import { 
    UseFormRegister, 
    FieldErrors, 
    Control, 
    UseFormSetValue, 
    UseFormGetValues, 
    UseFormWatch 
  } from 'react-hook-form';

  export interface RequestsFormValues {
    id_cliente: string
    tipo_entregaProveedor:string
    fecha_salida: string;
    costos_extras:number;
    id_proveedor:string
    id_servicio_datos:string
  }

export interface StepsRequests {
    register: UseFormRegister<RequestsFormValues>;    
    setValue?: UseFormSetValue<RequestsFormValues>;
    errors: FieldErrors<RequestsFormValues>;
    nextStep?: () => void;
    prevStep?: () => void;
    control?:any
    // providersData?:{
    //     nombre?: string;
    //     personaContacto?: string;
    //     celular?: string;    
    //     email?: string;        
    //     telefono?: string;      
    //     nombreCuenta?: string;     
    //     numeroCuenta?: string;     
    //     persona_contacto?: string;           
    // }
    }    

    export interface StepsRequestsProps extends StepsRequests {
      // Props adicionales específicas del Paso 1
      customProp?: string;
    }