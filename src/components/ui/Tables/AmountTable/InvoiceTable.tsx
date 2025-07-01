import { table } from "console"


interface InvoiceTableProps {
    services?:[{
        serviceType: string;
        rowIndex:number;
    }];

}
interface Extra {
  descripcion: string;
  precio: number;
}

interface Servicio {
  tarifa: number | string;
  costos_extras?: any;        // viene de requestFormData, puede ser Array o un objeto
}

export const InvoiceTable = ({services, rows, requestFormData}:InvoiceTableProps) => {
    console.log('InvoiceTable rows: ', rows);
    console.log('InvoiceTable services: ', services);
    console.log('InvoiceTable requestFormData: ', requestFormData);

    const calculateTotalInvoice = () => {
    // Suma de tarifas (segura)
    const totalTarifas = requestFormData?.servicios?.reduce((sum, servicio) => {
        return sum + (servicio.tarifa || 0);
    }, 0) || 0;

    // Suma de costos extras (segura)
    const totalCostosExtras = requestFormData?.servicios?.reduce((sum, servicio) => {
        if (!Array.isArray(servicio.costos_extras)) return sum;
        return sum + servicio.costos_extras.reduce((subSum, extra) => {
        return subSum + (extra.precio || 0);
        }, 0);
    }, 0) || 0;

    return totalTarifas + totalCostosExtras;
    };

const calculateTariff = (idx: number): number => {
  const servicio: Servicio = requestFormData.servicios[idx];

  // 1) Normaliza tarifa a número
  const tarifaNum =
    typeof servicio.tarifa === 'string'
      ? Number(servicio.tarifa)
      : servicio.tarifa;

  // 2) Normaliza costos_extras a un array de Extras
  let extrasArr: Extra[] = [];
  if (servicio.costos_extras) {
    if (Array.isArray(servicio.costos_extras)) {
      extrasArr = servicio.costos_extras;
    } else {
      // si viene como {0: {...}, 1: {...}, length: N}, convertimos:
      extrasArr = Object
        .keys(servicio.costos_extras)
        .filter(key => key !== 'length')
        .map(key => servicio.costos_extras[key]);
    }
  }

  // 3) Suma los precios de extras
  const sumaExtras = extrasArr.reduce((acc, e) => acc + (e.precio || 0), 0);

  return tarifaNum + sumaExtras;
};


    return(
        <table className="border border-black w-[70%]">
            <thead className="py-3">
                <tr className="border-b-2 border-gray-400"> 
                    <th className="text-black py-1 text-center">Descripción</th>
                    <th className="text-black py-1 text-center">Costo</th>
                </tr>
            </thead>
            

            <tbody className="text-gray-700 font-mono">
                {rows.map((row, index) => (
                <tr key={row.id_servicio_datos} className="hover:bg-gray-50 cursor-pointer">
                    <td className="py-1 text-center">{row.serviceType}</td>
                    <td className="py-1 text-center">${calculateTariff(index).toLocaleString()}</td>
                </tr>
                ))}
            </tbody>

            <tfoot className="text-black">
                <tr className="w-[90%] border-t-2 border-gray-400 font-bold">
                    <td className="text-center" onClick={calculateTariff}>Total</td>
                    <td className="text-center">${calculateTotalInvoice().toLocaleString()}</td>
                </tr>
            </tfoot>
        </table>
    )
}