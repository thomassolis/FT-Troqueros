import React, { createContext, useState, ReactNode } from "react";

export interface ServiceType {
  id: number;
  selectedValue: string;
  quantity: number;
  serviceID?: string;
  tarifa?: TarifaIn[] | [TarifaIn] | null;
}

type TarifaIn = {
  descripcion?: string | null;
  costo?: number | null;
  venta?: number | null;
  profit?: number | null;
};

export interface RouteRow {
  lugar_origen: string;
  lugar_destino: string;
  tarifa: { descripcion: string; costo: number; venta: number; profit: number; }[];


  routeID?: string;
  serviceTypeId: number;
  serviceType: string;
  rowNumber: number;
  id_servicio_datos: string;
  selectedOption: string;
  serviceID: string | undefined;
  groupIndex?: number;
  rowIndex: number;
  entrega_vacio: boolean;
  fecha_limite: string;
}

interface DynamicRequestsContextType {
  routeIDsByRow: Record<string, string>;
  setRouteIDsByRow: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export const dynamicRequestsContext = createContext<
  DynamicRequestsContextType | undefined
>(undefined);

export const DynamicRequestsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [routeIDsByRow, setRouteIDsByRow] = useState<Record<string, string>>({});
  return (
    <dynamicRequestsContext.Provider value={{ setRouteIDsByRow, routeIDsByRow }}>
      {children}
    </dynamicRequestsContext.Provider>
  );
};

// -----------------------------
// 🔹 Normalizador de RouteRow
// -----------------------------
export type Price = {
  descripcion: string;
  costo: number;
  venta: number;
  profit: number;
};

export const toRouteRow = (r: any): RouteRow => {
  const asArray: Price[] = Array.isArray(r?.tarifa)
    ? r.tarifa
    : [
        {
          descripcion: typeof r?.descripcion === "string" ? r.descripcion : "",
          costo: Number(r?.costo ?? 0),
          venta: Number((r?.venta ?? r?.tarifa) ?? 0),
          profit: Number(r?.profit ?? 0),
        },
      ];

  return {
    ...r,
    id_servicio_datos: String(r?.id_servicio_datos ?? ""),
    lugar_origen: String(r?.lugar_origen ?? ""),
    lugar_destino: String(r?.lugar_destino ?? ""),
    entrega_vacio: Boolean(r?.entrega_vacio),
    fecha_limite: String(r?.fecha_limite ?? ""),
    tarifa: asArray,
    // valores por defecto de propiedades requeridas si faltan
    serviceTypeId: Number(r?.serviceTypeId ?? 0),
    serviceType: String(r?.serviceType ?? ""),
    rowNumber: Number(r?.rowNumber ?? 0),
    selectedOption: String(r?.selectedOption ?? ""),
    serviceID: r?.serviceID ?? undefined,
    rowIndex: Number(r?.rowIndex ?? 0),
  } satisfies RouteRow;
};
