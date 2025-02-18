import { Navbar } from "../../layout/Navbar"
import { Sidebar } from "../../layout/Sidebar"
import { useState } from "react"
import { HomeOptions } from "../../others/HomeOptions"
import  '../../../styles/index.css'

//COMPONENTE PADRE DE HOME
export const Home = () =>{
    const [sidebarState, setSidebarState] = useState<boolean>(false);

    const handleSideBarChange = (newState: boolean) =>{
        setSidebarState(newState);
    }

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