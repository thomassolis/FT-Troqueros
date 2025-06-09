interface ProvidersData {
    telefono?: string | null;
    persona_contacto?: string | null;
    email?: string | null;
    celular?: string | null;
    id_proveedor?: string | null | null;
    nombre?: string | null | null;
    nombre_cuenta?: string | null;
    numero_cuenta?: string | null;
    tipo_banco?: string | null;
    numero_yappy?: string | null;    
  }
  
  interface GeneralInformation {    
    nombreProveedor? : string | null;    
  }
  
  interface ContactInformation {
    celularProveedor?: string | null;
    telefonoProveedor?: string | null;
    contactoProveedor?: string | null;
    emailProveedor?: string | null;    
  }

  interface BankInformation {
    yappyProveedor?: string|null;
    nombreCuentaProveedor?:string|null;
    numeroCuentaProveedor?: string | null;
    tipoBancoProveedor?: string|null;
  }
  
  function splitProvidersData(data: ProvidersData): { generalInfo: GeneralInformation; contactInfo: ContactInformation; paymentInfo: BankInformation} {
    // Objeto para datos de póliza
    const generalInfo: GeneralInformation = {      
      nombreProveedor: data.nombre      
    };
  
    // Objeto para datos de inspección
    const contactData: ContactInformation = {
        celularProveedor: data.celular,      
        emailProveedor: data.email,        
        contactoProveedor: data.persona_contacto,
        telefonoProveedor: data.telefono        
    };

    const BankData: BankInformation = {
        yappyProveedor: data.numero_yappy,
        nombreCuentaProveedor: data.nombre_cuenta,
        numeroCuentaProveedor: data.numero_cuenta,
        tipoBancoProveedor: data.tipo_banco
    }
  
    return {
      generalInfo: generalInfo,
      contactInfo: contactData,
      paymentInfo: BankData
    };
  }
  export default splitProvidersData;