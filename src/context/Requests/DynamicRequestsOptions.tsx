import React, { createContext, useState, ReactNode } from "react";

export interface ServiceType {
  id: number;
  selectedValue: string;
  quantity: number;
  serviceID?: string;
}

interface RouteDetails {
  lugar_origen: string;
  lugar_destino: string;
  tarifa: string | number;
  routeID: string;
}
export interface RouteRow {
  serviceTypeId: number;
  serviceType: string;
  rowNumber: number;
  serviceID?: string;
  groupIndex: number;
  rowIndex: number;
  id_servicio_datos: string;
  lugar_origen: string;
  lugar_destino: string;
  tarifa: string | number;
  routeID: string;
}
interface DynamicRequestsContextType {
  serviceTypes: ServiceType[];
  setServiceTypes: React.Dispatch<React.SetStateAction<ServiceType[]>>;
  rows: RouteRow[];
  setRows: React.Dispatch<React.SetStateAction<RouteRow[]>>;    
  routesInformation: Record<string, RouteDetails>;
  setRoutesInformation: React.Dispatch<React.SetStateAction<Record<string, RouteDetails>>>;
  routeIDsByRow: Record<string, string>;
  setRouteIDsByRow: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export const dynamicRequestsContext = createContext<DynamicRequestsContextType | undefined>(undefined);


export const DynamicRequestsProvider = ({ children }: { children: ReactNode }) => {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [rows, setRows] = useState<RouteRow[]>([]);
  const [routesInformation, setRoutesInformation] = useState<Record<string, RouteDetails>>({});
  const [routeIDsByRow, setRouteIDsByRow] = useState<Record<string, string>>({});

  return (
    <dynamicRequestsContext.Provider value={{ serviceTypes, setServiceTypes, setRows, rows, routesInformation, setRoutesInformation, setRouteIDsByRow, routeIDsByRow }}>
      {children}
    </dynamicRequestsContext.Provider>
  );
};
