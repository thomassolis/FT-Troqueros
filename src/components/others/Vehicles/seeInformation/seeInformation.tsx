import { SmallLabel } from "../../../ui/Labels/smallLabel";
import splitVehicleData from "../../../../functions/cleanData/splitVehicleData/splitVehicleData";
import { SplitCustomerData } from "../../../../functions/cleanData/splitCustomerData/splitCustomerData";

interface VehicleData {
  fecha_caducidad_poliza?: string | null;
  fecha_expedicion_poliza?: string | null;
  fecha_renovacion_revisado?: string | null;
  fecha_ultimo_revisado?: string | null;
  foto_poliza?: string | null;
  foto_revisado?: string | null;
  id_chasis?: string | null;
  numero_poliza?: string | null;
  placa?: string | null;
  status?: string | null;
}

interface CustomerData {
  id_cliente: string;
  nombre: string;
  ruc: string;
  direccion: string;
  nombrePersonaContacto: string;
  telPersonaContacto: string;
  emailPersonaContacto: string;
  nombrePersonaFinanciera: string;
  telContactoFinanciero: string;
  emailContactoFinanciero: string;
  fechaUltimoPedido: string;
}

type SeeVehicleInformationData = VehicleData | CustomerData;

interface SeeVehicleInformationProps{
    titles: string[]
    module: string;
    vehicleData: SeeVehicleInformationData;
}

const isVehicleData = (data: any): data is VehicleData => {
  return 'placa' in data || 'numero_poliza' in data;
};

const isCustomerData = (data: any): data is CustomerData => {
  return 'id_cliente' in data || 'nombrePersonaContacto' in data;
};

// Función para formatear las claves del objeto a un formato más legible
const formatKey = (key:any) => {
    return key
      .split('_')
      .map((word:any) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };



  export const SeeVehicleInformation = ({ titles, vehicleData, module }: SeeVehicleInformationProps) => {
    console.log('vehicleData', vehicleData);
    let datasets: any[] = [];

    if (['Chasises', 'Furgones', 'Cabezales'].includes(module) && isVehicleData(vehicleData)) {
      const { policy, inspection } = splitVehicleData(vehicleData);    
      datasets = [policy, inspection];
    } else if (module === 'Customers' && isCustomerData(vehicleData)) {
      try {
        const { generalData, contactPerson, businessContact } = SplitCustomerData(vehicleData);
        datasets = [generalData, contactPerson, businessContact];
      } catch (error) {
        console.error("Error al dividir los datos del cliente:", error);
      }
    }
  
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
                      {String(value)}
                    </span>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </section>
    );
  };
  