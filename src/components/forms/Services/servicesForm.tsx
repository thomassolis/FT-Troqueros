import { SmallLabel } from "../../ui/Labels/smallLabel"
import { Input } from "../../ui/inputs/input"
import { DynamicSections } from "./dynamicSections"
import { useState } from "react"
import { Button } from "../../ui/buttons/button"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { CreateNewService } from "../../../api/Services/services.route"
import { serviceTypes } from "../../types/forms/ServiceForm/serviceTypesForm"

export const ServicesForm = () => {
  const [options, setOptions] = useState<number[]>([1]);
  const navigate = useNavigate();

  const {
    register, 
    handleSubmit, 
    formState: { errors }
  } = useForm<serviceTypes>();

  const addOption = () => {
    const newId = options.length > 0 ? Math.max(...options) + 1 : 1;
    setOptions((prev) => [...prev, newId]);
  };

  const handleDeleteOption = (id: number) => {
    setOptions((prev) => prev.filter((item) => item !== id));
  };

  const onSubmit = async(data:serviceTypes) => {
    // Transformamos los datos al formato requerido
  const formData: serviceTypes = {
    nombre_servicio: data.nombre_servicio,
    datos_servicio: Object.fromEntries(
      options.map(id => [
        id,
        {
          lugar_origen: data.datos_servicio?.[id]?.lugar_origen ?? '',
          lugar_destino: data.datos_servicio?.[id]?.lugar_destino ?? '',
          tarifa: data.datos_servicio?.[id]?.tarifa ?? 0,
        }
      ])
    )
  };



    console.log('Datos enviados:', formData);
    try{

      const response = await CreateNewService(formData);

      if(response.success){
        navigate('/home/Services');
      }
    }catch(error:unknown){
      console.log('Error en try ', error);
    }
    // Aquí harías el envío real a tu API
  }

  return (
    <section className="w-full">
      <h1 className="text-black mt-10 ml-6 text-lg font-semibold">
        Llene el siguiente formulario para crear un nuevo servicio
      </h1>

      <div className="flex justify-center">
        <div className="flex w-[70%]">
          {/* FORMULARIO COMPLETO AQUÍ */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-12 items-start w-full mt-12">
            
            {/* Nombre del servicio */}
            <div className="flex w-full justify-start gap-8">
              <div className="h-10 flex items-center">
                <SmallLabel text="Nombre del servicio:" />
              </div>

              <div className="h-10 flex items-center gap-2">
                <Input
                  className2={"py-4"}
                  type="text"
                  placeholder="Nombre del servicio"
                  {...register('nombre_servicio', {required:"Campo requerido"})}
                />

                {errors.nombre_servicio && (
                    <span className="text-red-500">{errors.nombre_servicio.message}</span>
                )}



              </div>
            </div>

            <label htmlFor="" className="text-gray-600">
              Datos del Servicio
            </label>

            {/* Secciones dinámicas */}
            {options.map((id) => (
              <div key={id} className="flex flex-col gap-12">
                <DynamicSections 
                  id={id}
                  numero={id} 
                  onDelete={() => handleDeleteOption(id)} 
                  register={register}
                  error={errors}
                />
              </div>
            ))}

            {/* Agregar opción */}
            <div className="flex items-center gap-3 w-full">
              <div className="border border-gray-500 py-1 px-2 text-black rounded-md">
                {options.length + 1}
              </div>

              <div
                onClick={addOption}
                className="border-b-2 border-gray-400 py-1 px-2 w-full text-blue-500 font-bold cursor-pointer hover:text-blue-400 flex items-center gap-2"
              >
                <span>Agregar Opción</span>
              </div>
            </div>

            {/* Botones */}
            <div className="w-full flex justify-between">
              <div className="w-[10%]">
                <Button
                  text={'Atrás'}
                  className2={'bg-red-500'}                        
                  onClick={() => navigate('/home/Services')}
                  type="button" // Importante para que no envíe el formulario
                />
              </div>                    

              <div className="w-[10%]">
                <Button
                  text={'Crear'}
                  type="submit" // Esto activará el onSubmit
                />
              </div>
            </div>
          </form>
        </div>        
      </div>
    </section>
  );
};
