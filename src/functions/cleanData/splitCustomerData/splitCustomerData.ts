interface VehicleData {
    id_cliente: string;   
    nombre: string;   
    ruc: string;
    direccion: string;   
    nombrePersonaContacto: string;   
    telPersonaContacto: string;   
    emailPersonaContacto: string;   
    nombreBanco: string;   
    nombreCuenta: string;   
    tipoCuenta: string;
    numeroCuenta: string
    fechaUltimoPedido: string;
    dv:number;
}

interface SplitCustomerDataProps {
    generalData: generalData;
    contactPerson: contactPerson;
    dataBank: dataBank;
}

interface generalData {
    nombre: string;
    ruc: string;
    direccion: string;
    dv: number;
}

interface contactPerson {
    nombrePersonaContacto: string;
    telPersonaContacto: string;
    emailPersonaContacto: string;
}

interface dataBank {
    nombreBanco: string;
    tipoCuenta: string;
    nombreCuenta:string    
    numeroCuenta: string
}

export const SplitCustomerData = (data: VehicleData): SplitCustomerDataProps => {
    if (!data.id_cliente || !data.nombre || !data.ruc ) {
        throw new Error("Datos inválidos para un cliente.");
    }
    
    const generalData: generalData = {      
        nombre: data.nombre,
        ruc: data.ruc,
        direccion: data.direccion,
        dv: data.dv
    };

    const contactPerson: contactPerson = {
        nombrePersonaContacto: data.nombrePersonaContacto,
        telPersonaContacto: data.telPersonaContacto,
        emailPersonaContacto: data.emailPersonaContacto
    };

    const dataBank: dataBank = {
        nombreBanco: data.nombreBanco,
        tipoCuenta: data.tipoCuenta,
        nombreCuenta: data.nombreCuenta,        
        numeroCuenta: data.numeroCuenta
    };

    return { generalData, contactPerson, dataBank };
};
