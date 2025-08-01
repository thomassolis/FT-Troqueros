import { FaFilePdf } from 'react-icons/fa'; // Icono para PDF
interface FilesViewerProps {
    files: any[]
}

export const FilesViewer = ({ files }: FilesViewerProps) => {
    // Verificar si existen archivos en el objeto recibido    
    
    if (!files || files.length === 0) {
        return <p>No hay archivos disponibles.</p>;
    }    

    // Función para determinar el tipo de archivo
    const isImage = (ext: string) => /\.(jfif|jpg|jpeg|png|gif|bmp|webp)$/i.test(ext);
    const isPDF = (ext: string) => /\.pdf$/i.test(ext);

    return (
        <div className="flex items-center justify-center">
            <div 
                style={{ margin: '20px' }} 
                className="grid grid-cols-2 items-center w-[90%]  gap-12"
            >            
                {files.length > 0 ? (

                    files.map((file, index) => {                
                        return (
                            <div 
                                key={index} 
                                className="flex flex-col items-center justify-center shadow-lg w-full h-[400px] max-h-[400px] rounded-lg"
                            >
                                <p className="text-black">
                                    <strong>
                                        {file.source === 'foto_poliza' 
                                        ? 'Póliza' 
                                        : file.source === 'foto_revisado' 
                                        ? 'Revisado del vehículo' 
                                        : file.source === 'cedRepresentanteLegal' 
                                        ? 'Cédula de Representante Legal' 
                                        : file.source === 'avisoOperaciones' 
                                        ? 'Aviso de Operaciones'
                                        : file.source === 'licencia' 
                                        ? 'Licencia'
                                        : file.source === 'pazSalvo' 
                                        ? 'Paz Y Salvo'
                                        : file.source === 'record_policivo'
                                        ? 'Record Policivo'
                                        :null
                                        }
                                    </strong>
                                </p>

                                <p className="text-black">
                                    <strong>Nombre:</strong> {file.name}
                                </p>

                                {isImage(file.ext) ? (
                                    <>                                
                                        <a href={file.url} target="_blank" rel="noopener noreferrer">
                                            <img 
                                                src={file.url} 
                                                alt={file.name} 
                                                style={{ 
                                                    maxWidth: '300px', 
                                                    height: '300px', 
                                                    maxHeight: '300px', 
                                                    objectFit: 'contain', 
                                                    borderRadius: '8px', 
                                                    marginTop: '10px', 
                                                    cursor: 'pointer' 
                                                }} 
                                            />
                                        </a>                                
                                    </>
                                ) : isPDF(file.ext) && (
                                    <>
                                        {/* Ícono PDF interactivo */}
                                        <a href={file.url} target="_blank" rel="noopener noreferrer" className='mt-9'>
                                            <FaFilePdf size={100} color="#E53935" style={{ cursor: 'pointer' }} />
                                        </a>

                                    </>

                                )}
                            </div>
                        );
                    })
                ) : (
                    <></>
                )}
            </div>
        </div>


    );
};
