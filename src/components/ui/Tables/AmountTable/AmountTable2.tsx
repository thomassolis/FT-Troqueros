import { Icon } from "@iconify/react/dist/iconify.js";
import { RequestsFormValues } from "../../../types/forms/RequestsForm/requestsForm";
import { useFormContext, useFieldArray, useWatch, Path } from "react-hook-form";
import { useEffect, useRef } from "react";

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
  activeStep?:number;
}

export const AmountTable2 = ({ requestFormData, serviceIndex, activeStep }: AmountTable2Props) => {
  const { control, register, setValue, formState:{errors} } = useFormContext<RequestsFormValues>();
  const service = requestFormData?.servicios?.[serviceIndex];
  
  const nameTarifa = `servicios.${serviceIndex}.tarifa` as const;
  // useWatch puede devolver objeto, array o undefined
  const rawTarifaValues = useWatch({ control, name: nameTarifa });
  // Garantizas que siempre sea un array
  const tarifaValues = Array.isArray(rawTarifaValues) ? rawTarifaValues : [];

  const { fields, append, remove } = useFieldArray({
    control,
    name: nameTarifa,
  });

  // Observa TODO el array de este tab
    

  // Evita múltiples append al montar/cambiar de tab
  const initializedRef = useRef(false);
  useEffect(() => {
    initializedRef.current = false; // reset al cambiar de tab (porque remount con key)
  }, [serviceIndex]);

  // useEffect(() => {
  //   if (initializedRef.current) return;
  //   if (!Array.isArray(tarifaValues) || tarifaValues.length === 0) {
  //     append({ descripcion: "", costo: 0, venta: 0, profit: 0 });
  //   }
  //   initializedRef.current = true;
  //   // NO pongas tarifaValues en deps o se ejecutará dos veces
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [append, serviceIndex]);
  

  // useEffect(() => {
  //   tarifaValues.forEach((row, i) => {      
  //     const venta = Number(row?.venta ?? 0);
  //     const costo = Number(row?.costo ?? 0);
  //     const newProfit = venta - costo;

  //     // Solo actualiza si cambió
  //     if (row?.profit !== newProfit) {
  //       setValue(
  //         `${nameTarifa}.${i}.profit` as Path<RequestsFormValues>,
  //         newProfit,
  //         {
  //           shouldValidate: false,
  //           shouldDirty: true,
  //         }
  //       );
  //     }
  //   });
  // }, [tarifaValues, nameTarifa]);

  
  // 1) Reemplaza la lógica de "append si vacío" por esta:

// useEffect(() => {
//   // Si no hay filas en el field array, añade una
//   if (fields.length === 0) {
//     append({ descripcion: "", costo: 0, venta: 0, profit: 0 });
//   }
//   // eslint-disable-next-line react-hooks/exhaustive-deps
// }, [fields.length, append]);

// // 2) Sustituye COMPLETO el efecto que recalcula profit por este:
// const lastPairRef = useRef<Record<number, string>>({}); 
// // guarda un “hash” de [costo,venta] por índice para no recalcular inútilmente

// useEffect(() => {
//   // Tomamos solo costo/venta (lo que afecta el profit)
//   tarifaValues.forEach((row, i) => {
//     const venta = Number(row?.venta ?? 0);
//     const costo = Number(row?.costo ?? 0);
//     const newProfit = venta - costo;

//     // Hash simple para detectar cambios reales
//     const pairKey = `${costo}|${venta}`;
//     if (lastPairRef.current[i] === pairKey && row?.profit === newProfit) {
//       return; // nada cambió para esta fila
//     }
//     lastPairRef.current[i] = pairKey;

//     // Si el profit no coincide, actualiza SIN ensuciar el form
//     if (row?.profit !== newProfit) {
//       setValue(
//         `${nameTarifa}.${i}.profit` as Path<RequestsFormValues>,
//         newProfit,
//         { shouldValidate: false, shouldDirty: false, shouldTouch: false } // 👈 clave
//       );
//     }
//   });
//   // Dependemos de costo/venta, no de todo el objeto (evita cambios por identidad)
// }, [
//   nameTarifa,
//   // dependencias “estables”: solo costo y venta, serializadas
//   JSON.stringify(
//     tarifaValues.map((r: any) => [Number(r?.costo ?? 0), Number(r?.venta ?? 0)])
//   ),
// ]);

  
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
                  <td className="py-3 px-4 font-semibold text-gray-600 uppercase text-sm text-center">Acciones</td>
                </tr>
              </thead>

              <tbody>
                {fields.map((field, i) => {
                  const row = tarifaValues?.[i] || {};
                  const venta = Number(row?.venta ?? 0);
                  const costo = Number(row?.costo ?? 0);
                  const profit = venta - costo;

                  return (
                    <tr key={field.id} className="border-b border-gray-200 hover:bg-gray-50">
<td className="py-2 px-4 w-[70%]">
  <input
    type="text"
    placeholder="Ingrese descripción de gasto"
    className={`border rounded-md px-2 py-1 w-full text-black ${
      errors?.servicios?.[serviceIndex]?.tarifa?.[i]?.descripcion
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
    placeholder="Gasto"
    className={`border rounded-md px-2 py-1 w-full text-right text-black ${
      errors?.servicios?.[serviceIndex]?.tarifa?.[i]?.costo
        ? "border-red-500"
        : "border-gray-300"
    }`}
    step="any"
    inputMode="decimal"
    {...register(`${nameTarifa}.${i}.costo` as const, {
      valueAsNumber: true,
      // IMPORTANTE: que "" se vuelva undefined para que 'required' dispare
      setValueAs: (v) => (v === "" ? undefined : Number(v)),
      // validate: (v) => (activeStep >= 5 ? (!!v || "Obligatorio") : true),
      // Si 0 NO debe permitirse, agrega además:
      // validate: (v) => v > 0 || "Debe ser mayor a 0",
    })}
  />
</td>


                      <td className="py-2 w-full">
                        <input
                          type="number"
                          placeholder="Venta"
                          className="border border-gray-300 rounded-md px-2 py-1 w-full text-right text-black"                          
                          {...register(`${nameTarifa}.${i}.venta` as const, { valueAsNumber: true })}
                        />
                      </td>

                      <td className="py-2  text-gray-900 font-medium text-right">
                        <input
                          type="number"
                          readOnly
                          value={profit}
                          className="border-none bg-transparent text-right w-full"                          
                        />
                      </td>

                      <td className="py-2  text-center flex justify-center">
                        <Icon
                          icon="material-symbols:delete"
                          width="24"
                          height="24"
                          className="cursor-pointer text-red-700 hover:text-red-500"
                          onClick={() => remove(i)}
                        />
                      </td>
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
                onClick={() => append({ descripcion: "", costo: 0, venta: 0, profit: 0 })}
              >
                <Icon icon="material-symbols:add-rounded" width="24" height="24" />
                Agregar Gasto / Venta Adicional
              </button>
            </div>

            {/* <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-r-lg">
              PROFIT TOTAL: 
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};
