import { Icon } from "@iconify/react"
import { Input } from "../../ui/inputs/input"
import { useForm } from "react-hook-form"
import { Button } from "../../ui/buttons/button";
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { serviceTypes } from "../../types/forms/ServiceForm/serviceTypesForm";

interface DynamicSectionsProps {
  id: number;
  numero: number;
  onDelete: () => void;
  register: UseFormRegister<serviceTypes>;
  error: FieldErrors<serviceTypes>;
}

export const DynamicSections = ({ id, numero, onDelete, register, error }: DynamicSectionsProps) => {

  return (
    <div className="flex flex-col gap-20">
      <div className="flex items-center gap-3 w-full">
        <div className="border border-gray-500 py-1 px-2 text-black rounded-md">
          {numero}
        </div>

        <div>
          <Input
            type="text"
            className2={"py-4"}
            placeholder="Introduzca lugar de origen"
            {...register(`datos_servicio.${id}.lugar_origen`, { required: true })}
          />

          {error.datos_servicio?.[id]?.lugar_origen && (
            <span className="text-red-500 text-sm">Campo requerido</span>
          )}

        </div>

        <div>
          <Input
            type="text"
            className2={"py-4"}
            placeholder="Introduzca lugar de destino"
            {...register(`datos_servicio.${id}.lugar_destino`, { required: true })}
          />

          {error.datos_servicio?.[id]?.lugar_destino && (
            <span className="text-red-500 text-sm">Campo requerido</span>
          )}
        </div>

        <div>
          <Input
            type="number"
            className2={"py-4 w-[80%]"}
            placeholder="Tarifa $"
            {...register(`datos_servicio.${id}.tarifa`, { 
              required: true,
              valueAsNumber: true
            })}
          />

          {error.datos_servicio?.[id]?.tarifa && (
            <span className="text-red-500 text-sm">Campo requerido</span>
          )}
        </div>

        <div>
          <Icon
            icon="line-md:trash"
            width="25"
            height="25"
            className="text-red-600 cursor-pointer hover:text-red-400"
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  );
};
