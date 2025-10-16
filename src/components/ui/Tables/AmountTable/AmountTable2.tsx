import { Icon } from "@iconify/react/dist/iconify.js";
import { RequestsFormValues } from "../../../types/forms/RequestsForm/requestsForm";
import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import { AuthContext } from "../../../../context/auth/authProvider";
import { useContext } from "react";

interface AmountTable2Props {
  requestFormData: RequestsFormValues | undefined;
  filteredServiceData: {
    lugar_origen?: string;
    lugar_destino?: string;
    tarifa?: {
      venta: number | string;
      descripcion: string;
      costo?: number | string;
    }
    descripcion?: string;
    precio?: number | string;
  }[];
  serviceIndex: number;  
  procedure?:string;
}

export const AmountTable2 = ({ requestFormData, serviceIndex, procedure}: AmountTable2Props) => {
  const { control, register, formState:{errors}, getValues } = useFormContext<RequestsFormValues>();
  const {userRole}=useContext(AuthContext)!;
  const service = requestFormData?.servicios?.[serviceIndex];
  
  const nameTarifa = `servicios.${serviceIndex}.tarifa` as const;  

// Lleva un init por tab para no re-inicializar al volver  
  // useWatch puede devolver objeto, array o undefineda
  const rawTarifaValues = useWatch({ control, name: nameTarifa });
  // Garantizas que siempre sea un array
  const tarifaValues = Array.isArray(rawTarifaValues) ? rawTarifaValues : [];

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: nameTarifa,
  });


const isJunk = (r: any) => {
  const descEmpty = String(r?.descripcion ?? "").trim() === "";
  const ventaBad = r?.venta === undefined || r?.venta === null || Number.isNaN(r?.venta);
  const costoBad = r?.costo === undefined || r?.costo === null || Number.isNaN(r?.costo);
  // consideramos “basura” solo si no hay descripción y además venta/costo no válidos
  return descEmpty && (ventaBad && costoBad);
};

const handleAdd = (e: React.MouseEvent) => {
  e.stopPropagation();

  append([
    { descripcion: "", costo: null, venta: null, profit: null }
  ] as [{ descripcion: string; costo: number | null; venta: number | null; profit: number | null }]);


  // Saneamos en el microtask: quitamos filas “basura” (venta: NaN/undefined y sin descripción)
  queueMicrotask(() => {
    const arr = (getValues(nameTarifa) ?? []) as any[];
    // si quieres conservar 0 como valor válido, no lo trates como basura
    const cleaned = arr.filter((r) => !isJunk(r));
    if (cleaned.length !== arr.length) {
      replace(cleaned);
    }
  });
};


  
  return (
    <div className="container mx-auto p-8 w-[75%]">
      <div className="bg-gray-100 shadow-lg rounded-xl overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        {service ? (
          <h1 className="text-xl font-bold text-gray-800">
            {service?.lugar_origen} - {service?.lugar_destino}
          </h1>
        ) : (
          <h1 className="text-gray-400 italic">Cargando…</h1>
        )}
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-semibold text-gray-600 uppercase text-sm">Descripción</td>
                  {["Gasto", "Venta", "Profit"].map((title) => (
                    <th key={title} className="py-3 px-4 font-semibold text-gray-600 uppercase text-sm text-right">
                      {title}
                    </th>
                  ))}
                  {(userRole === 'CEO' || (userRole==='ADM' && procedure==='create')) ? (
                  <td className="py-3 px-4 font-semibold text-gray-600 uppercase text-sm text-center">Acciones</td>
                  ):(null)}
                </tr>
              </thead>

              <tbody>
                {fields.map((field, i) => {                                    
                  const raw: any = (tarifaValues as any)?.[i];
                  const row: any = Array.isArray(raw) ? raw[0] : (raw ?? {});
                  const venta = Number(row?.venta ?? 0);  // Si venta es null o undefined, asignar 0
                  const costo = Number(row?.costo ?? 0);  // Si costo es null o undefined, asignar 0

                  const profit = venta - costo;  // Si costo es 0, profit será igual a venta

                  return (
                    <tr key={field.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-2 px-4 w-[70%]">
                        <input
                          type="text"
                          placeholder="Ingrese descripción de gasto"
                          className={`border rounded-md px-2 py-1 w-full text-black ${
                            (errors as any)?.servicios?.[serviceIndex]?.tarifa?.[i]?.descripcion
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          {...register(`${nameTarifa}.${i}.descripcion` as const, {
                            required: "La descripción es obligatoria",
                          })}
                        />
                      </td>

                      <td className="py-2 w-full">
                        <input
                          type="number"
                          placeholder="0"
                          className={`border rounded-md px-2 py-1 w-full text-right text-black ${
                            (errors as any)?.servicios?.[serviceIndex]?.tarifa?.[i]?.costo
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          step="any"
                          inputMode="decimal"
                          {...register(`${nameTarifa}.${i}.costo` as const, {
                            valueAsNumber: true,
                            // setValueAs: (v) => (v === "" ? 0 : Number(v)), 
                            setValueAs: (v) => (v === "" ? undefined : Number(v)),
                            // setValueAs: (v) => (v === "" ? undefined : Number(v)),
                          })}
                        />
                      </td>

                      <td className="py-2 w-full">
                        <input
                          type="number"
                          placeholder="0"
                          step="any"
                          inputMode="decimal"
                          className="border border-gray-300 rounded-md px-2 py-1 w-full text-right text-black"
                          {...register(`${nameTarifa}.${i}.venta` as const, {
                            setValueAs: (v) => (v === "" ? undefined : Number(v)),
                          })}
                        />
                      </td>

                      <td className="py-2 text-gray-900 font-medium text-right">
                        <input
                          type="number"
                          readOnly
                          value={profit}
                          defaultValue={0}
                          className="border-none bg-transparent text-right w-full"
                        />
                      </td>
                      
                      {(userRole === 'CEO' || (userRole==='ADM' && procedure==='create')) ? (
                        <td className="py-2 text-center flex justify-center">
                          <Icon
                            icon="material-symbols:delete"
                            width="24"
                            height="24"
                            className="cursor-pointer text-red-700 hover:text-red-500"
                            onClick={() => remove(i)}
                          />
                        </td>
                        ):(null)
                      }
                    </tr>
                  );
                })}
              </tbody>

            </table>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row sm:justify-between items-center">
            <div className="flex gap-4 mb-4 sm:mb-0">
              <button
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                type="button"
                onClick={handleAdd}
              >
                <Icon icon="material-symbols:add-rounded" width="24" height="24" />
                Agregar Gasto / Venta Adicional
              </button>
            </div>    
          </div>
        </div>
      </div>
    </div>
  );
};
