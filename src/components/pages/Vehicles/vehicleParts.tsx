import { PrevisualizationTab } from "../../ui/tabs/Tabs"
import { Button } from "../../ui/buttons/button"
import { Icon } from "@iconify/react/dist/iconify.js"
import { useState } from "react"
import { Input } from "../../ui/inputs/input"
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect } from "react"
import { GetDataForPrevisualizationTable } from "../../../api/Home/Vehicles/vehicles.routes"
interface submitData {
    id_chasis: string
}

export const VehicleParts = () =>{
    const [selectedOption, setSelectedOption] = useState<string>("")
    const vehicleParts: string[] = ["Chasises", "Cabezales", "Furgones"] 
    const { register, handleSubmit, formState: { errors } } = useForm<submitData>();
    const [searchValue, setSearchValue] = useState<string>("");

    const onSubmit: SubmitHandler<submitData> = (data) => {
        console.log("Datos enviados:", data);
    };
    
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
        console.log("Nuevo valor:", event.target.value); 
    };


    useEffect(()=>{        
        const getData = async() =>{
            try{
                const response = await GetDataForPrevisualizationTable({
                    tabSelected: selectedOption, 
                    page: 1, 
                    limit: 10, 
                    search: searchValue 
                });
            }catch(error:any){
                console.log("Error en getData: ", error);
            }
            getData();
        }
    }, [searchValue])
 


    return(
        <div>
            <div className="flex w-[full] justify-between items-center mb-10">
                <div className="w-[30%] flex gap-3 items-center">
                    <Icon icon="tabler:arrow-back-up-double" className="text-white bg-black rounded-md" width="24" height="24" />
                    <p className="text-black font-bebas text-xl">Partes de mula actuales</p>
                </div>              

                <div className="w-[15%]">
                    <Button text={`Agregar ${selectedOption}`} bgColor="bg-troquerosOrange" hoverBgColor="bg-[#1B5316]" textColor="white"/>
                </div>              
            </div>            

            <div className="flex w-full items-center justify-center mb-5">

                <div className="flex w-[8%]  items-center justify-center py-2 border border-gray-400 bg-white">
                    <h1 className="text-black">Placa</h1>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="flex">
                    <div className="">                   
                            <Input 
                                type="text" 
                                placeholder={`Buscar ${selectedOption}`} 
                                className2={"py-5 rounded-none border border-gray-400"}
                                {...register("id_chasis", { required: true })} // ✅ Solo deja esto
                            />
                        
                    </div>                

                    <div className="">
                        <Button type="submit" text="Buscar" hoverBgColor="bg-gray-200" className2={"py-2 rounded-none border border-gray-400"}/>
                    </div>
                </form>
            </div>            
            
            <PrevisualizationTab tabContent = {vehicleParts} onTabChange={setSelectedOption}/>
        </div>
    )
}