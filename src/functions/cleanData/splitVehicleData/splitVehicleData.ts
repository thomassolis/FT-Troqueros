interface VehicleData {
    fecha_caducidad_poliza?: string | null;
    fecha_expedicion_poliza?: string | null;
    fecha_renovacion_revisado?: string | null;
    fecha_ultimo_revisado?: string | null;
    foto_poliza?: string | null | null;
    foto_revisado?: string | null | null;
    id_chasis?: string | null;
    numero_poliza?: string | null;
    placa?: string | null;
    status?: string | null;
  }
  
  interface PolicyData {    
    placa? : string | null;
    status?: string | null;    
  }
  
  interface InspectionData {
    fecha_ultimo_revisado?: string | null;
    fecha_renovacion_revisado?: string | null;
    poliza?: string | null;
    fecha_expedicion_poliza?: string | null;
    fecha_caducidad_poliza?: string | null | undefined;
  }
  
  function splitVehicleData(data: VehicleData): { policy: PolicyData; inspection: InspectionData } {
    // Objeto para datos de póliza
    const policyData: PolicyData = {      
      placa: data.placa,
      status: data.status
    };
  
    // Objeto para datos de inspección
    const inspectionData: InspectionData = {
        fecha_ultimo_revisado: data.fecha_ultimo_revisado,      
        fecha_renovacion_revisado: data.fecha_renovacion_revisado,        
        poliza: data.numero_poliza,
        fecha_expedicion_poliza: data.fecha_expedicion_poliza,
        fecha_caducidad_poliza: data.fecha_caducidad_poliza
    };
  
    return {
      policy: policyData,
      inspection: inspectionData
    };
  }
  export default splitVehicleData;