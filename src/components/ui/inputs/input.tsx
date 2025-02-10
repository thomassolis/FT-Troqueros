import { ForwardedRef, forwardRef } from "react";

interface InputProps {
    type: string;
    placeholder: string;
}

export const Input = forwardRef <HTMLInputElement, InputProps>(
    ({type, placeholder, ...rest}, ref) =>{
        return(
            <input 
                type={type} 
                placeholder={placeholder} 
                ref={ref}
                className="w-96 h-9 rounded-md border border-gray-300 px-2"
                {...rest}
            />
        );
    }
)