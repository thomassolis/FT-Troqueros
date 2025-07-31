import React, { createContext, useState, ReactNode } from "react";

export interface ServiceType {
  id: number;
  selectedValue: string;
  quantity: number;
  serviceID?: string;
}

export interface RouteRow {
  lugar_origen: string;
  lugar_destino: string;
  tarifa: string | number;
  routeID?: string ;
  serviceTypeId: number;
  serviceType: string;
  rowNumber: number;
  id_servicio_datos:string;
  selectedOption:string
  serviceID: string | undefined;
  groupIndex?: number;
  rowIndex: number;  
  entrega_vacio: boolean; // Agregar la propiedad 'entrega_vacio'  
  fecha_limite: string;  
}
interface DynamicRequestsContextType {
  // serviceTypes: ServiceType[];
  // setServiceTypes: React.Dispatch<React.SetStateAction<ServiceType[]>>;
  // rows: RouteRow[];
  // setRows: React.Dispatch<React.SetStateAction<RouteRow[]>>;    
  // routesInformation: Record<string, RouteDetails>;
  // setRoutesInformation: React.Dispatch<React.SetStateAction<Record<string, RouteDetails>>>;
  routeIDsByRow: Record<string, string>;
  setRouteIDsByRow: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export const dynamicRequestsContext = createContext<DynamicRequestsContextType | undefined>(undefined);


export const DynamicRequestsProvider = ({ children }: { children: ReactNode }) => {
  const [routeIDsByRow, setRouteIDsByRow] = useState<Record<string, string>>({});
  
  return (
    <dynamicRequestsContext.Provider value={{setRouteIDsByRow, routeIDsByRow}}>
      {children}
    </dynamicRequestsContext.Provider>
  );
};
