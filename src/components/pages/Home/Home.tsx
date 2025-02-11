import { Navbar } from "../../layout/Navbar"
import { Sidebar } from "../../layout/Sidebar"

export const Home = () =>{
    
    return (        
            <section className="grid grid-cols-[150px_1fr] grid-rows-[60px_1fr]  bg-gray-950 h-screen ">
                
                {/* Header */}
                <div className="col-span-2 bg-troquerosOrange flex items-center justify-between  shadow-md ">
                    {/* <h1 className="text-white font-bold text-xl">HEADER</h1> */}
                    <Navbar/>
                </div>

                {/* Sidebar */}
                <div className="bg-white ">
                    {/* <h2 className="font-bold text-lg">Sidebar</h2>
                    <ul className="space-y-2">
                        
                    </ul> */}
                    <Sidebar/>
                </div>

                {/* Content */}
                <div className="bg-slate-500 p-6 shadow-lg text-white">
                    <h2 className="text-2xl font-bold">Contenido Principal</h2>        
                </div>

            </section> 
    )
}