import { Icon } from "@iconify/react";

export const Navbar = () => {
    return (
      <div className="fixed top-0 left-0 w-full bg-troquerosOrange h-[60px] flex items-center justify-between shadow-xl z-50 px-4">
        <div>
          <img className="w-[50px]" src="/public/troqueros-logo.png" alt="Troqueros Logo" />
        </div>
        <div className="flex gap-2">
          <Icon icon="ion:notifications" width="30" height="25" />
          <Icon icon="bxs:user" width="30" height="25" />
        </div>
      </div>
    );
  };
  