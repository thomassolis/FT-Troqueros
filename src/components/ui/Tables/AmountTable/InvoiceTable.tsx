interface InvoiceTableProps {
  requestFormData: {
    servicios: Servicio[];
  };
}

interface Extra {
  descripcion: string;
  precio: number;
}

interface Servicio {
  tarifa: number | string;
  costos_extras?: Extra[] | Record<string, any>;
  nuevos_costos_extras?: Extra[];
  servicio?: string;
}

export const InvoiceTable = ({ requestFormData }: InvoiceTableProps) => {
  const servicios = requestFormData?.servicios || [];

  const normalizeExtras = (extras: any): Extra[] => {
    if (!extras) return [];
    if (Array.isArray(extras)) return extras;
    return Object.keys(extras)
      .filter((key) => key !== "length")
      .map((key) => extras[key]);
  };

  const calculateTariff = (idx: number): number => {
    const servicio = servicios[idx];

    const tarifa =
      typeof servicio.tarifa === "string"
        ? Number(servicio.tarifa)
        : servicio.tarifa || 0;

    const extras = normalizeExtras(servicio.costos_extras);
    const nuevosExtras = normalizeExtras(servicio.nuevos_costos_extras);

    const totalExtras = [...extras, ...nuevosExtras].reduce(
      (sum, e) => sum + Number(e.precio || 0),
      0
    );

    return tarifa + totalExtras;
  };

  const calculateTotalInvoice = (): number => {
    return servicios.reduce((sum, _, index) => {
      return sum + calculateTariff(index);
    }, 0);
  };

  return (
    <table className="border border-black w-[70%]">
      <thead className="py-3">
        <tr className="border-b-2 border-gray-400">
          <th className="text-black py-1 text-center">Descripción</th>
          <th className="text-black py-1 text-center">Costo</th>
        </tr>
      </thead>

      <tbody className="text-gray-700 font-mono">
        {servicios.map((servicio, index) => (
          <tr
            key={index}
            className="hover:bg-gray-50 cursor-pointer"
          >
            <td className="py-1 text-center">
              {servicio.servicio || `Servicio ${index + 1}`}
            </td>
            <td className="py-1 text-center">
              ${calculateTariff(index).toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>

      <tfoot className="text-black">
        <tr className="w-[90%] border-t-2 border-gray-400 font-bold">
          <td className="text-center">TOTAL</td>
          <td className="text-center">
            ${calculateTotalInvoice().toLocaleString()}
          </td>
        </tr>
      </tfoot>
    </table>
  );
};
