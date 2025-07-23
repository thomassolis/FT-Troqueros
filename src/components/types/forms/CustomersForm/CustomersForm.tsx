import { 
    UseFormRegister, 
    FieldErrors,     
    UseFormSetValue,         
  } from 'react-hook-form';

  export interface CustomersFormValues {
    nombre: string;
    ruc: string;
    correo: string;
    fechaUltimoPedido?: Date | null;
    direccion: string;    
    telefono: string;
    nombrePersonaContacto: string;
    telPersonaContacto: string;
    emailPersonaContacto: string;
    nombreBanco?:string;
    tipoCuenta?:string;
    numeroCuenta?:string
    nombreCuenta?:string
    dv?:number;

    cedRepresentanteLegal?: string[]; // en lugar de string
    avisoOperaciones?: string[];
  }

export interface StepOneCustomers {
    register: UseFormRegister<CustomersFormValues>;    
    setValue: UseFormSetValue<CustomersFormValues>;
    errors: FieldErrors<CustomersFormValues>;
    nextStep?: () => void;
    prevStep?: () => void;
    control?:any
    setPdfFile? :[]
    // setCustomersData: {}
    customersData: {
      nombre?: string;
      ruc?: string;
      direccion?: string;
      nombrePersonaContacto?:string
      telPersonaContacto?:string;
      emailPersonaContacto?:string

      nombreBanco?:string;
      tipoCuenta?:string;
      numeroCuenta?:string
      nombreCuenta?:string
      dv?:number;
      cedRepresentanteLegal?: string[]; // en lugar de string
      avisoOperaciones?: string[];
    }    
  }

    export interface StepOneCustomerProps extends StepOneCustomers {
      // Props adicionales específicas del Paso 1
      customProp?: string;
    }