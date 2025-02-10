import { BeatLoader } from "react-spinners"

interface ButtonProps {
    text: string;
    type?: 'button' | 'submit' | 'reset';
    isLoading?: boolean;
}

export const Button = ({ text, type = 'button', isLoading = false }: ButtonProps) => {
    return (
        <button 
            type={type} 
            className={`bg-troquerosOrange p-3 rounded-md w-full hover:bg-[rgba(231,141,60,100)] flex justify-center items-center font-jersey`}
            disabled={isLoading}
        >
            {isLoading ?  
                <BeatLoader color="#fff" size={15}/> : text}
        </button>
    )
}
