import { Navbar } from "../../layout/Navbar"

export const Home = () =>{
    
    return (
        <>
<section className="grid grid-cols-[250px_1fr] grid-rows-[80px_1fr]  bg-gray-950 h-screen ">
    
    {/* Header */}
    <div className="col-span-2 bg-red-400 flex items-center justify-between px-6 shadow-md ">
        <h1 className="text-white font-bold text-xl">HEADER</h1>
    </div>

    {/* Sidebar */}
    <div className="bg-red-600 p-4 shadow-lg text-white">
        <h2 className="font-bold text-lg">Sidebar</h2>
        <ul className="space-y-2">
            
        </ul>
    </div>

    {/* Content */}
    <div className="bg-slate-500 p-6 shadow-lg text-white">
        <h2 className="text-2xl font-bold">Contenido Principal</h2>        
    </div>

</section>

        </>
    )
}