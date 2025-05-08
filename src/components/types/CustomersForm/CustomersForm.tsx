import { 
    UseFormRegister, 
    FieldErrors, 
    Control, 
    UseFormSetValue, 
    UseFormGetValues, 
    UseFormWatch 
  } from 'react-hook-form';

  export interface CustomersFormValues {
    nombre: string;
    ruc: string;
    direccion: string;    
    nombrePersonaContacto: string;
    telPersonaContacto: string;
    emailPersonaContacto: string;
    nombrePersonaFinanciera: string;
    telContactoFinanciero: string;
    emailContactoFinanciero: string;
  }

export interface StepOneCustomers {
    register: UseFormRegister<CustomersFormValues>;    
    setValue?: UseFormSetValue<CustomersFormValues>;
    errors: FieldErrors<CustomersFormValues>;
    nextStep?: () => void;
    prevStep?: () => void;
    setPdfFile? :[]
    // setCustomersData: {}
    customersData?: {
      nombre?: string;
      ruc?: string;
      direccion?: string;
      nombrePersonaContacto?:string
      telPersonaContacto?:string;
      emailPersonaContacto?:string
      nombrePersonaFinanciera?:string;
      telContactoFinanciero?:string;
      emailContactoFinanciero?:string
    }    
  }

    export interface StepOneCustomerProps extends StepOneCustomers {
      // Props adicionales específicas del Paso 1
      customProp?: string;
    }