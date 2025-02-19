import { Input } from "../../ui/inputs/input"
import { Button } from "../../ui/buttons/button"
import { useForm } from "react-hook-form"
import { SendLoginCredentials } from "../../../api/Login/login.route"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export const Login = () => {    
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (data: any) => {
        setIsLoading(true);

        // Mapeamos los nombres del formulario a los nombres esperados por el backend
        const formattedData = {
            email: data.Email,
            pass: data.Password  
        };

        try {
            const response = await SendLoginCredentials(formattedData, navigate);
            if (response?.success) {  
                navigate('/Troqueros/home');
            }
        } catch (error) {
            console.error("Login failed", error);            
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="grid grid-cols-[50%_1fr] gap-y-[10px] h-screen">
            <div className="bg-cover bg-center h-full bg-troquerosOrange flex items-center justify-center">
                <img className="w-[290px]" src="/public/troqueros-logo.png" alt="Troqueros Logo" />
            </div>

            <div className="bg-troquerosGray h-full flex items-center w-full">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col ml-8">
                    <h1 className="font-inria text-4xl mb-5">Login</h1>

                    {['Email', 'Password'].map((option) => (
                        <div key={option} className="flex flex-col mb-2 w-full">
                            <label htmlFor={option}>{option}</label>
                            <Input
                                type={option === 'Password' ? 'password' : 'email'}
                                placeholder=""
                                {...register(option, { required: true })} // Registramos "Email" y "Password"
                            />
                            {errors[option] && (
                                <span className="text-red-500 text-sm">This field is required</span>
                            )}
                        </div>
                    ))}
                    
                    <div className="w-full mt-10">
                        <Button text="Login" type="submit" isLoading={isLoading} />
                    </div>
                </form>
            </div>
        </section>
    )
}
