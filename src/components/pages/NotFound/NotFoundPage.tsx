import { Link } from "react-router-dom";

export const NotFoundPage = () =>{
    return(
        <div className="flex flex-col items-center justify-center h-screen bg-troquerosGray">            
                <img className="w-[35%]" src="/NotFoundImage.png" alt="Troqueros Logo" />                                  
        <Link 
          to="/home" 
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
            <span className="font-bold">Volver al inicio</span>          
        </Link>
      </div>
    )
}