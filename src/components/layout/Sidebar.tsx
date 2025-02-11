import { Icon } from "@iconify/react/dist/iconify.js"

export const  Sidebar = () =>{
    return(
        <section className="">
            <ul className="items-center">
                <div className="items-center">
                    <li className="items-center content-center"><Icon icon="iconamoon:menu-burger-horizontal-bold" width="24" height="24" /></li>
                </div>                
                <li><Icon icon="fluent:people-28-filled" width="28" height="28" /></li>
                <li><Icon icon="mdi:truck-cargo-container" width="24" height="24" /></li>
            </ul> 
        </section>
    )
}