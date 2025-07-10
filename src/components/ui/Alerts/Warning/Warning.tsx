import Swal
 from "sweetalert2";

 interface WarningAlertProps {
    title: string;
    text: string;
 }
export const WarningAlert = ({title, text}:WarningAlertProps) => {
    Swal.fire({
    icon: "error",
    title: title,
    text: text,    
});
}