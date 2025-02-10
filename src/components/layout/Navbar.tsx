import { Icon } from "@iconify/react";

export const Navbar = () =>{
    
    return(
        <section className="w-full bg-troquerosOrange h-[7%] flex items-center justify-between shadow-xl">
            <div className="ml-2">
                <img className="w-[50px]" src="/public/troqueros-logo.png" alt="Troqueros Logo" />
            </div>
            <div className="flex mr-1 gap-2">
                <Icon icon="ion:notifications" width="30" height="25" />
                <Icon icon="bxs:user" width="30" height="25"/>
            </div>
        </section>
    )
}