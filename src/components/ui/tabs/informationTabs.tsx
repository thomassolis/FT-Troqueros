import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useState } from 'react';
import { SeeVehicleInformation } from '../../others/Vehicles/seeInformation/seeInformation';
import { GetModuleFromURL } from '../../../functions/GetURL/GetURLInfo';

interface InformationTabProps {
    tabTitles: [string, string, string]
    vehicleData: {
      fecha_caducidad_poliza?: string | null;
        fecha_expedicion_poliza?: string | null;
        fecha_renovacion_revisado?: string | null ;
        fecha_ultimo_revisado?: string | null ;
        foto_poliza?: string | null;
        foto_revisado?: string | null;
        id_chasis?: string | null;
        numero_poliza?: string | null;
        placa?: string | null;
        status?: string | null;
    }
}

export const InformationTab = ({tabTitles, vehicleData}: InformationTabProps) => {
    const [selectedTab, setSelectedTab] = useState<number>(0);
    console.log('vehicleData en tab: ', vehicleData);
    const module = GetModuleFromURL();
    console.log('MODULE: ', module);

    const titles = (module === 'Chasises' || module === 'Furgones' || module === 'Cabezales')
      ? ['Chasis:', 'Documentación:']
      : ['Cliente:', 'Persona de Contacto:', 'Contacto Financiero'];

    return(
    <Tabs
    selectedIndex={selectedTab}
    onSelect={(index) => {
        setSelectedTab(index);      
    }}
    
    >
    
    <div className='w-full bg-blue- flex justify-center'>
      <TabList className={'flex gap-2 mt-6 w-[85%] '}>
          {tabTitles.map((value, index)=>(
              <Tab className={`border p-2 text-black px-5 rounded-lg border-black font-bold cursor-pointer font-[jersey] text-xl hover:bg-[#FFBF85] ${selectedTab===index && 'bg-troquerosOrange'}`}>{value}</Tab>
          ))}            
      </TabList>
    </div>    

    <TabPanel>
    <SeeVehicleInformation 
      module={module}        
      vehicleData={vehicleData}
      titles={titles}
    />
    </TabPanel>
    <TabPanel>
      {/* <h2>Any content 2</h2> */}
    </TabPanel>
  </Tabs>
    )  
};