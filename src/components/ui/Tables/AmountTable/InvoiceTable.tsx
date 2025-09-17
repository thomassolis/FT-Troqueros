import { RequestsFormValues } from "../../../types/forms/RequestsForm/requestsForm";

interface InvoiceTableProps {
  requestFormData: RequestsFormValues | undefined;    
}

interface Extra {
  descripcion?: string;
  precio?: number;
}

type TarifaRow = { descripcion?: string; costo?: number; venta?: number; profit?: number };

export const InvoiceTable = ({ requestFormData }: InvoiceTableProps) => {  
  const servicios = requestFormData?.servicios || [];  

  const normalizeExtras = (extras: any): Extra[] => {
    if (!extras) return [];
    if (Array.isArray(extras)) return extras;
    return Object.values(extras).filter(Boolean) as Extra[];
  };

  const normalizeTarifa = (tarifa: unknown): TarifaRow[] => {
    if (!tarifa) return [];
    if (Array.isArray(tarifa)) return tarifa as TarifaRow[];
    if (typeof tarifa === "object") return Object.values(tarifa as Record<string, TarifaRow>).filter(Boolean);
    return [];
  };

  // === CÁLCULOS POR SERVICIO ===
  // Costos = suma costos de tarifa + extras
  const calculateCost = (idx: number): number => {
    const servicio = servicios[idx];
    const tarifaRows = normalizeTarifa(servicio?.tarifa);
    const totalCostoTarifa = tarifaRows.reduce((sum, r) => sum + Number(r?.costo ?? 0), 0);

    const extras = normalizeExtras(servicio?.costos_extras);
    const nuevosExtras = normalizeExtras(servicio?.nuevos_costos_extras);
    const totalExtras = [...extras, ...nuevosExtras].reduce(
      (sum, e) => sum + Number(e?.precio ?? 0),
      0
    );

    return totalCostoTarifa + totalExtras;
  };

  // Ventas = suma ventas de tarifa (por lo general extras no suman ventas)
  const calculateSales = (idx: number): number => {
    const servicio = servicios[idx];
    const tarifaRows = normalizeTarifa(servicio?.tarifa);
    return tarifaRows.reduce((sum, r) => sum + Number(r?.venta ?? 0), 0);
  };

  // Profit = Ventas - Costos
  const calculateProfit = (idx: number): number => {
    return calculateSales(idx) - calculateCost(idx);
  };

  // === TOTALES ===
  const totals = servicios.reduce(
    (acc, _, index) => {
      acc.costo += calculateCost(index);
      acc.venta += calculateSales(index);
      acc.profit += calculateProfit(index);
      return acc;
    },
    { costo: 0, venta: 0, profit: 0 }
  );

  // helper visual opcional (si prefieres 2 decimales fijos, cambia a toLocaleString("es-PA",{minimumFractionDigits:2,maximumFractionDigits:2}))
  const fmt = (n: number) => `$${(n || 0).toLocaleString()}`;

  return (
    <table className="border border-black w-[70%]">
      <thead className="py-3">
        <tr className="border-b-2 border-gray-400">
          <th className="text-black py-1 text-center w-[70%]">Descripción</th>
          <th className="text-black py-1 text-center">Costo</th>
          <th className="text-black py-1 text-center">Ventas</th>
          <th className="text-black py-1 text-center">Profit</th>
        </tr>
      </thead>

      <tbody className="text-gray-700 font-mono">
        {servicios.map((servicio, index) => {
          const labelBase =
            (servicio as any)?.servicio ? String((servicio as any).servicio) : `Servicio ${index + 1}`;
          const label = `${labelBase} (${servicio?.lugar_origen ?? "-"} - ${servicio?.lugar_destino ?? "-"})`;

          const costo  = calculateCost(index);
          const venta  = calculateSales(index);
          const profit = venta - costo;

          return (
            <tr key={index} className="hover:bg-gray-50 cursor-pointer">
              <td className="py-1 text-center">{label}</td>
              <td className="py-1 text-center">{fmt(costo)}</td>
              <td className="py-1 text-center">{fmt(venta)}</td>
              <td className={`py-1 text-center ${profit>0?'text-green-700':'text-red-400'}`}>{fmt(profit)}</td>
            </tr>
          );
        })}
      </tbody>

      <tfoot className="text-black">
        <tr className="w-[90%] border-t-2 border-gray-400 font-bold">
          <td className="text-center">TOTAL</td>
          <td className="text-center">{fmt(totals.costo)}</td>
          <td className="text-center">{fmt(totals.venta)}</td>
          <td className={`text-center ${totals.profit>0?'text-green-800':'text-red-500'}`}>{fmt(totals.profit)}</td>
        </tr>
      </tfoot>
    </table>
  );
};
