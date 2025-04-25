interface LabelProps {
    text: string
}    


export const SmallLabel = ({text}:LabelProps) =>{


    return(
        <label htmlFor="" className="text-black">{text}</label>        
    )
}