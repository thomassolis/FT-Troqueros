interface DriversData {
    id_conductor: string;   
    nombre: string;   
    apellido: string;
    cedula: string;   
    status: string;   
    telefono: string; 
    tipo_licencia:string;   
    email:string;       
}

interface SplitCustomerDataProps {
    generalData: generalData;
}

interface generalData {
    nombre: string;
    apellido: string;
    cedula: string;
    tipo_licencia: string;
    telefono:string;
    email:string;
}

export const SplitDriversData = (data: DriversData): SplitCustomerDataProps => {
    if (!data.id_conductor) {
        throw new Error("Datos inválidos para un cliente.");
    }
    
    const generalData: generalData = {      
        nombre: data.nombre,
        apellido: data.apellido,
        cedula: data.cedula,
        tipo_licencia: data.tipo_licencia,
        telefono:data.telefono,
        email:data.email
    };

    return { generalData};
};
