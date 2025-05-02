import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useState } from 'react';
import { SeeVehicleInformation } from '../../others/Vehicles/seeInformation/seeInformation';

interface InformationTabProps {
    tabTitles: [string]
    vehicleData: {
      id_chasis:string;
  }
}

export const InformationTab = ({tabTitles, vehicleData}: InformationTabProps) => {
    const [selectedTab, setSelectedTab] = useState<number>(0);
    console.log('vehicleData en tab: ', vehicleData);
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
        titles={['Chasis:', 'Documentación:']}
        vehicleData={vehicleData}
      />
    </TabPanel>
    <TabPanel>
      {/* <h2>Any content 2</h2> */}
    </TabPanel>
  </Tabs>
    )  
};