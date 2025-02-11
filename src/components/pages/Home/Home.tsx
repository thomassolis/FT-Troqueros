import { Navbar } from "../../layout/Navbar"
import { Sidebar } from "../../layout/Sidebar"
import { useState } from "react"

export const Home = () =>{
    const [sidebarState, setSidebarState] = useState<boolean>(false);

    const handleSideBarChange = (newState: boolean) =>{
        setSidebarState(newState);
    }
    
    return (        
        <section
        className={`grid ${sidebarState ? "grid-cols-[18%_1fr]" : "grid-cols-[5.5%_1fr]"} grid-rows-[60px_1fr] h-screen`}
      >
                
                {/* Header */}
                <div className="col-span-2 bg-troquerosOrange flex items-center justify-between  shadow-md ">                    
                    <Navbar/>
                </div>

                {/* Sidebar */}
                <div className="w-full h-full">                                
                    <Sidebar onSidebarChange = {handleSideBarChange}/>
                </div>

                {/* Content */}
                <div className="bg-slate-500 p-6 shadow-lg text-white">
                    <h2 className="text-2xl font-bold">Contenido Principal</h2>        
                </div>

            </section> 
    )
}