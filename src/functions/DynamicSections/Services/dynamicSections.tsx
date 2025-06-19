import { Icon } from "@iconify/react"
import { Input } from "../../../components/ui/inputs/input"
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { serviceTypes } from "../../../components/types/forms/ServiceForm/serviceTypesForm";

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
      <div className="grid grid-cols-[auto_1fr_1fr_0.5fr_auto] items-center gap-3 w-full ">
        
        <div className="min-w-[40px] border border-gray-500 py-1 px-2 text-black rounded-md text-center">
          {numero}
        </div>

        <div className="w-full">
          <Input
            type="text"
            className2="py-4 w-full"
            placeholder="Introduzca lugar de origen"
            {...register(`datos_servicio.${id}.lugar_origen`, { required: true })}
          />
          {error.datos_servicio?.[id]?.lugar_origen && (
            <span className="text-red-500 text-sm">Campo requerido</span>
          )}
        </div>

        <div className="w-full">
          <Input
            type="text"
            className2="py-4 w-full"
            placeholder="Introduzca lugar de destino"
            {...register(`datos_servicio.${id}.lugar_destino`, { required: true })}
          />
          {error.datos_servicio?.[id]?.lugar_destino && (
            <span className="text-red-500 text-sm">Campo requerido</span>
          )}
        </div>
        
        <div className="w-full">
          <Input
            type="number"
            className2="py-4 w-full max-w-[120px]"
            placeholder="Tarifa $"
            min={1}
            {...register(`datos_servicio.${id}.tarifa`, { 
              required: true,
              valueAsNumber: true
            })}
          />
          {error.datos_servicio?.[id]?.tarifa && (
            <span className="text-red-500 text-sm">Campo requerido</span>
          )}
        </div>

        {/* Icono de eliminar */}
        <div className="flex justify-center min-w-[40px]">
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
