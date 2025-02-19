import { Navbar } from "../../layout/Navbar"
import { Sidebar } from "../../layout/Sidebar"
import { useState } from "react"
import { HomeOptions } from "../../others/HomeOptions"
import  '../../../styles/index.css'
import { getDecodedToken } from "../../../functions/JWT/DecodeJWT"
import { useEffect } from "react"
import { SolicitarToken } from "../../../api/Home/home.route"
//COMPONENTE PADRE DE HOME
export const Home = () =>{
    const token = getDecodedToken();
    console.log(token);
    const [sidebarState, setSidebarState] = useState<boolean>(false);

    const handleSideBarChange = (newState: boolean) =>{
        setSidebarState(newState);
    }

    useEffect(()=>{
        const PedirToken = async() =>{
            try{
                const response = await SolicitarToken();
            }catch(error){
                console.error("Error al pedir el token: ", error);
            }
        }
        PedirToken();
    }, [])

    return (        
        <section id="HOME" className={`grid ${sidebarState ? "grid-cols-[15.5%_1fr]" : "grid-cols-[5%_1fr]"} w-full h-screen overflow-y-auto pt-[60px]  `}>
        <Navbar />
        
        {/* Sidebar */}
        <div className="w-full h-full bg-troquerosGray" >                                
            <Sidebar onSidebarChange = {handleSideBarChange}/>
        </div>

        {/* Content */}
        <div className="bg-troquerosGray shadow-lg text-white">
            <HomeOptions sidebarState={sidebarState}/>
        </div>
        </section>

    )
}