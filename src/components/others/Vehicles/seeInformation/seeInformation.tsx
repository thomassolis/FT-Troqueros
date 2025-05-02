import { SmallLabel } from "../../../ui/Labels/smallLabel";
import splitVehicleData from "../../../../functions/splitVehicleData/splitVehicleData";

interface SeeVehicleInformationProps{
    titles: [string, string]
    vehicleData: {
        fecha_caducidad_poliza: string | null;
        fecha_expedicion_poliza: string | null;
        fecha_renovacion_revisado: string | null ;
        fecha_ultimo_revisado: string | null ;
        foto_poliza: string | null;
        foto_revisado: string | null;
        id_chasis: string | null;
        numero_poliza: string | null;
        placa: string | null;
        status: string | null;
    }
}

// Función para formatear las claves del objeto a un formato más legible
const formatKey = (key:any) => {
    return key
      .split('_')
      .map((word:any) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };



  export const SeeVehicleInformation = ({ titles, vehicleData }: SeeVehicleInformationProps) => {
    const { policy, inspection } = splitVehicleData(vehicleData); // <-- ¿Debería ser "policy"?
  
    const datasets = [policy, inspection];
  
    return (
      <section className="w-full flex flex-col items-center mt-14">
        <div className="grid grid-cols-2 w-[80%] gap-10">
          {titles.map((title, index) => (
            <div
              key={index}
              className={`flex flex-col w-full shadow-lg ${
                titles.length % 2 !== 0 && index === titles.length - 1
                  ? "col-span-2 mx-auto w-1/2"
                  : ""
              }`}
            >
              <h1 className="text-xl font-bold text-black p-5">{title}</h1>
              {datasets[index] &&
                Object.entries(datasets[index]!).map(([key, value]) => (
                  <div key={key} className="flex gap-4 px-5 py-2">
                    <span className="font-bold text-black">
                      {formatKey(key)}:
                    </span>
                    <span className="text-gray-800">
                      {value} 
                    </span>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </section>
    );
  };
  