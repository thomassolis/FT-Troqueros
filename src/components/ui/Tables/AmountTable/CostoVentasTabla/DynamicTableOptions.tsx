// TarifaRow.tsx
import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Icon } from "@iconify/react/dist/iconify.js";
import { RequestsFormValues } from "../../../../types/forms/RequestsForm/requestsForm";
import { Path } from "react-hook-form";

interface TarifaRowProps {
  rowName: `servicios.${number}.tarifa.${number}`;
  onRemove: () => void;
}

export const TarifaRow = ({ rowName, onRemove }: TarifaRowProps) => {
  const { register, setValue, control } = useFormContext<RequestsFormValues>();
  
  // 👇 Asegúrate de que los nombres sean strings válidos
  const ventaName = `${rowName}.venta` as const;
  const costoName = `${rowName}.costo` as const;
  const profitName = `${rowName}.profit` as const;
  const descripcionName = `${rowName}.descripcion` as const;

  // 👇 Observa solo los campos necesarios con nombres validados
  const [watchedVenta, watchedCosto] = useWatch({
    control,
    name: [ventaName, costoName],
  });

  const venta = Number(watchedVenta ?? 0);
  const costo = Number(watchedCosto ?? 0);
  const profit = venta - costo;

  // 👇 Actualiza el profit solo cuando cambian venta o costo
  useEffect(() => {
    if (typeof profitName === 'string' && profitName.startsWith('servicios')) {
    setValue(profitName as Path<RequestsFormValues>, profit, {
      shouldDirty: true,
      shouldValidate: false,
    });
    }
  }, [profit, profitName, setValue]);

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="py-2 px-4 w-[70%]">
        <input
          type="text"
          placeholder="Movimiento"
          className="border border-gray-300 rounded-md px-2 py-1 w-full text-black"
          {...register(descripcionName)}
        />
      </td>

      <td className="py-2 w-full">
        <input
          type="number"
          placeholder="Costo"
          className="border border-gray-300 rounded-md px-2 py-1 w-full text-right text-black"
          {...register(costoName, { valueAsNumber: true })}
        />
      </td>

      <td className="py-2 w-full">
        <input
          type="number"
          placeholder="Venta"
          className="border border-gray-300 rounded-md px-2 py-1 w-full text-right text-black"
          {...register(ventaName, { valueAsNumber: true })}
        />
      </td>

      <td className="py-2 px-4 text-gray-900 font-medium text-right">
        <input
          type="number"
          readOnly
          value={profit}
          className="border-none bg-transparent text-right w-full"
        />
      </td>

      <td className="py-2 px-4 text-center flex justify-center">
        <Icon
          icon="material-symbols:delete"
          width="24"
          height="24"
          className="cursor-pointer text-red-700 hover:text-red-500"
          onClick={onRemove}
        />
      </td>
    </tr>
  );
};