interface VehicleData {
    id_cliente: string;   
    nombre: string;   
    ruc: string;
    direccion: string;   
    nombrePersonaContacto: string;   
    telPersonaContacto: string;   
    emailPersonaContacto: string;   
    nombrePersonaFinanciera: string;   
    telContactoFinanciero: string;   
    emailContactoFinanciero: string;   
    fechaUltimoPedido: string;
}

interface SplitCustomerDataProps {
    generalData: generalData;
    contactPerson: contactPerson;
    businessContact: businessContact;
}

interface generalData {
    nombre: string;
    ruc: string;
    direccion: string;
}

interface contactPerson {
    nombrePersonaContacto: string;
    telPersonaContacto: string;
    emailPersonaContacto: string;
}

interface businessContact {
    nombrePersonaFinanciera: string;
    telContactoFinanciero: string;
    emailContactoFinanciero: string;
}

export const SplitCustomerData = (data: VehicleData): SplitCustomerDataProps => {
    if (!data.id_cliente || !data.nombre || !data.ruc) {
        throw new Error("Datos inválidos para un cliente.");
    }
    
    const generalData: generalData = {      
        nombre: data.nombre,
        ruc: data.ruc,
        direccion: data.direccion
    };

    const contactPerson: contactPerson = {
        nombrePersonaContacto: data.nombrePersonaContacto,
        telPersonaContacto: data.telPersonaContacto,
        emailPersonaContacto: data.emailPersonaContacto
    };

    const businessContact: businessContact = {
        nombrePersonaFinanciera: data.nombrePersonaFinanciera,
        telContactoFinanciero: data.telContactoFinanciero,
        emailContactoFinanciero: data.emailContactoFinanciero
    };

    return { generalData, contactPerson, businessContact };
};
