import { Icon } from "@iconify/react/dist/iconify.js"
import { useState, useEffect } from "react"


interface SidebarProps{
    onSidebarChange: (newState: boolean) => void;
}
export const  Sidebar = ({onSidebarChange}: SidebarProps) =>{
    const [openSideBar, setOpenSideBar] = useState(false);

    useEffect(()=>{
        onSidebarChange(openSideBar)
    }, [openSideBar])
    return(
        <section className="">
            <ul className="flex flex-col items-center justify-center gap-14">
                <div className="items-center justify-center flex mt-8">
                <li className="cursor-pointer" onClick={() => setOpenSideBar((prev) => !prev)}><Icon icon="iconamoon:menu-burger-horizontal-bold" width="24" height="24" /></li>
                </div>   

                <div className="flex flex-col justify-center items-center gap-4">
                    <li><Icon className="cursor-pointer" icon="fluent:people-28-filled" width="28" height="28" /></li>
                    <li><Icon className="cursor-pointer" icon="mdi:truck-cargo-container" width="26" height="26" /></li>
                    <li><Icon className="cursor-pointer" icon="healthicons:truck-driver" width="35" height="35" /></li>
                    <li><Icon className="cursor-pointer" icon="eos-icons:service-instance" width="28" height="28" /></li>
                    <li><Icon className="cursor-pointer" icon="fa-solid:hands-helping" width="22" height="22"/></li>
                </div>             

                <div className="flex flex-col justify-center items-center gap-4">
                    <li className="cursor-pointer"><Icon icon="fluent:people-team-toolbox-20-filled" width="26" height="26" /></li>
                </div>                
            </ul> 
        </section>
    )
}