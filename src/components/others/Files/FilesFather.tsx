import { title } from "process";
import { FilesViewer } from "../../ui/pdfViewer/PDFViewer";

interface FilesFatherProps {
    vehicleData: {
      fecha_caducidad_poliza?: string | null;
        fecha_expedicion_poliza?: string | null;
        fecha_renovacion_revisado?: string | null ;
        fecha_ultimo_revisado?: string | null ;
        foto_poliza?: string | null;
        foto_revisado?: string | null;
        id_chasis?: string | null;
        numero_poliza?: string | null;
        placa?: string | null;
        status?: string | null;
    }
}

//recorre todo el objeto y extrar los arreglos qu econtienen los archivos
const getAllFilesFromVehicleData = (vehicleData: any): any[] => {
    const files: any[] = [];

    // Recorrer todas las propiedades del objeto vehicleData
    Object.keys(vehicleData).forEach((key) => {
        const value = vehicleData[key];

        // Verificar si el valor es un array
        if (Array.isArray(value) && value.length > 0) {
            value.forEach((item: any) => {
                // Recorrer las claves internas de cada objeto en el array (ej: link1, link2)
                Object.keys(item).forEach((subKey) => {
                    const fileData = item[subKey];
                    
                    // Verificar si el subobjeto tiene una URL
                    if (fileData && fileData.url) {
                        // Añadir el archivo junto con el nombre del arreglo de origen
                        files.push({ source: key, ...fileData });
                    }
                });
            });
        }
    });

    return files;
};



// Ejemplo de uso en tu componente
export const FilesFather = ({ vehicleData }: FilesFatherProps) => {    
    const files = getAllFilesFromVehicleData(vehicleData);
    let titles: string[] = [];

    //Obtendrá todos los títulos de archivos que están dentro de files
    files.map((file) => {
        if (!titles.includes(file.source)) {
            if(file.source === 'foto_poliza') titles = ['Póliza', ...titles];
            if(file.source === 'foto_revisado') titles = ['Revisado de Vehículo', ...titles];
            if(file.source === 'cedRepresentanteLegal') titles = ['Cédula de Representante Legal', ...titles];
            if(file.source === 'avisoOperaciones') titles = ['Aviso de Operaciones', ...titles];
            
        }
    });    

    return (
        <div>            
            <FilesViewer                 
                files={files} 
            />        
        </div>
    );
};
