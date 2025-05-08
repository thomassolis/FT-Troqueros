import { useLocation } from "react-router-dom";

export const  GetModuleFromURL = () => {
    const location = useLocation();
    const pathSegments = location.pathname.split('/');
    
    const procedure = pathSegments[pathSegments.length - 1];
  
    const module: string =
    procedure === 'create'
      ? pathSegments[pathSegments.length - 2]
      : pathSegments[pathSegments.length - 3];

    return module
}

export const GetProcedureFromURL = () =>{
    const location = useLocation();
    const pathSegments = location.pathname.split('/').filter(Boolean); 
    const procedure = pathSegments[pathSegments.length - 1];

    return procedure;
}