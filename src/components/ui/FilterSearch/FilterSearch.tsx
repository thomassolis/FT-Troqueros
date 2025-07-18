import { Button } from "../buttons/button"
import { Input } from "../inputs/input"
import { useForm, SubmitHandler } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { searchValueContext } from "../../../context/searchValueForFilter/searchValue";
import Select from 'react-select';
import React, { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DownloadRequestExcel } from "../../../api/Home/home.route";

interface SelectOption {
  value: string;
  label: string;
}

interface FilterSearchProps {
  vehicleType?: string | null | undefined
  selectedOption: SelectOption | null;
  setSelectedOption: React.Dispatch<React.SetStateAction<SelectOption | null>>;
}

interface submitData {
  id_chasis: string    
}

export const FilterSearch = ({vehicleType, selectedOption, setSelectedOption, formattedDates, setFormattedDates}: FilterSearchProps) => {
  const { handleSubmit, formState: { errors } } = useForm<submitData>();
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean); 
  const lastSegment = pathSegments[pathSegments.length - 1];    
  const {searchValue, setSearchValue} = useContext(searchValueContext)!;

  // Filtro de fecha
  const [showPicker, setShowPicker] = useState(false);
  const [state, setState] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection"
    }
  ]);
  const pickerRef = useRef(null);

  const handleSelect = (ranges) => {
    const { startDate, endDate } = ranges.selection;
    setState([ranges.selection]);
    
    // Formatear las fechas a YYYY-MM-DD
    const formattedStart = format(startDate, 'yyyy-MM-dd');
    const formattedEnd = format(endDate, 'yyyy-MM-dd');
    
    setFormattedDates({
      start: formattedStart,
      end: formattedEnd
    });

    console.log('Fechas formateadas:', {
      start: formattedStart,
      end: formattedEnd
    });
  };

  const togglePicker = () => {
    setShowPicker(!showPicker);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {                        
    setSearchValue(event.target.value);                         
  };   

  const onSubmit: SubmitHandler<submitData> = (data) => {            
    // Aquí puedes usar formattedDates.start y formattedDates.end
    // para enviar las fechas en formato YYYY-MM-DD
  };        

  // Cierra el picker al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return(
    <div className="flex bg-red-">
      {lastSegment === 'home' ? (
        <Select
            options={[
                {value: 'id', label: 'ID'}, 
                {value: 'nameService', label: 'Servicio'}, 
                {value: 'nameDriver', label: 'Conductor'}, 
                {value: 'nameCustomer', label: 'Cliente'}
            ]}  
            className="text-black max-w-[35%] min-w-[20%]"        
            value={selectedOption}
            onChange={(optionselected) => {setSelectedOption(optionselected)}}                                                            
            menuPortalTarget={document.body} // Esto renderiza el menú en el body
            styles={{
                menuPortal: base => ({ ...base, zIndex: 9999 }),
                menu: provided => ({ ...provided, zIndex: 9999 })
            }}
            isClearable
        />
      ) : lastSegment === 'completeRequestHistory' ? (
        <div className="w-full flex bg-red-200">                        
            <div className="w-full" ref={pickerRef}>
                <input
                    type="text"
                    className="w-full p-2 border rounded cursor-pointer text-black"
                    value={
                    state[0].startDate && state[0].endDate
                        ? `${format(state[0].startDate, "dd/MM/yyyy")} - ${format(
                            state[0].endDate,
                            "dd/MM/yyyy"
                        )}`
                        : ""
                    }

                readOnly
                onClick={togglePicker}
                placeholder="Selecciona un rango de fechas"
                />

                {showPicker && (
                <div className="absolute z-50 mt-1 shadow-lg max-w-[90vw] overflow-x-auto">
                    <DateRangePicker                            
                    onChange={handleSelect}
                    moveRangeOnFirstSelection={false}
                    months={2}
                    ranges={state}
                    direction="horizontal"
                    editableDateInputs={true}
                    rangeColors={["#3b82f6"]}
                    />
                </div>
                )}
            </div>   

            <div className="w-full ">
                          <Select
            options={[
              {value: 'id', label: 'ID'}, 
              {value: 'nameService', label: 'Servicio'}, 
              {value: 'nameDriver', label: 'Conductor'}, 
              {value: 'nameCustomer', label: 'Cliente'}
            ]}  
            className="text-black w-full min-w-[20%]"        
            value={selectedOption}
            onChange={(optionselected) => {setSelectedOption(optionselected)}}                                       
            styles={{
              control: (base) => ({                                
                ...base,
                borderRadius: 0,
                borderColor: 'gray',
                padding: '2px',
                color: 'black'
              }),
              singleValue: (base) => ({
                ...base,
                color: 'black'
              }),
              menu: (base) => ({
                ...base,
                zIndex: 9999,
                marginTop: '2px'
              }),
              menuPortal: (base) => ({
                ...base,
                zIndex: 9999
              })
            }}
          />                        
            </div>                 
        </div>
      ) : (
        <div className="flex w-[8%] px-12 items-center justify-center py-2 border border-gray-400 bg-white">
          <h1 className="text-black">
            {lastSegment === 'Customers'||lastSegment==='Drivers'||lastSegment==='Services'||lastSegment==='Providers' ? (
              'Nombre'
            ) : lastSegment === 'Vehicles' ? (
              'Placa'
            ) : ''}
          </h1>
        </div>
      )}

      <div></div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="flex bg-blue">                                 
        <Input 
          type="text" 
          placeholder={
            lastSegment === 'Customers' ? (
              `Buscar Cliente por nombre`
            ) : lastSegment === 'Vehicles' ? (
              `Buscar ${vehicleType} por número de placa`
            ) : lastSegment === 'Drivers' ? (
              `Buscar Conductor por Nombre`
            ) : lastSegment === 'home' ? (
              `Buscar Petición por ${selectedOption?.label}`
            ) : lastSegment === 'completeRequestHistory' ? (
              `Buscar Petición por ${selectedOption?.label}`
            ) : lastSegment === 'Services' ? (
                `Buscar Servicio por Nombre`
            ): lastSegment === 'Providers' ? (
                `Buscar Proveedor por Nombre`
            ): null
          }                                
          className2={"py-5 rounded-none border border-gray-400"}
          onChange={handleInputChange}                                
        />
              
        <div></div>    

        <div>
          {(lastSegment !== 'home' && lastSegment !== 'completeRequestHistory') ? (
            <Button 
              type="submit" 
              text="Buscar" 
              bgColor="bg-gray-200" 
              className2={"py-2 rounded-none border border-gray-400"}                         
            />
          ) : null}
        </div>
      </form>
    </div>                          
  )
}