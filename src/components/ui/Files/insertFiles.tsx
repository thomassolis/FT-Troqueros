import React, { useState, useRef, useEffect } from "react";
import { FaFilePdf, FaTimes, FaUpload } from 'react-icons/fa';
import * as pdfjs from 'pdfjs-dist';

// Configuración del worker para PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface InsertFilesProps {
    onFileReady: (file: File | null, name: string) => void;
    fileName: string;
    files: any[];
    procedure: string;
}

export const InsertFiles: React.FC<InsertFilesProps> = ({ onFileReady, fileName, files, procedure }) => {

    // Estado para almacenar todos los archivos (cargados y nuevos)
    const [allFiles, setAllFiles] = useState<{ name: string, url: string }[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Cargar archivos al montar el componente si el procedimiento es "modify"
    useEffect(() => {

        if (procedure === 'modify' && files && files.length > 0) {
            const loadedFiles = files.map((file: any) => ({
                name: file.link1.name,
                url: file.link1.url
            }));
            setAllFiles(loadedFiles);
            

        }
    }, [files, procedure]);

    // Manejar la carga de archivos cuando el usuario sube uno nuevo
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const filesArray = Array.from(e.target.files);

            // Para mostrar en la UI
            const previewFiles = filesArray.map((file) => ({
                name: file.name,
                url: URL.createObjectURL(file),
            }));
            setAllFiles((prevFiles) => [...prevFiles, ...previewFiles]);

            // Enviar el File real al padre (por cada archivo)
            filesArray.forEach((file) => onFileReady(file, fileName));
        }
    };

    // Eliminar un archivo específico
    const handleRemoveFile = (fileName: string) => {
        setAllFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
        onFileReady(null, fileName);
    };

    // Disparar el input de archivo
    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="max-w-md mx-auto my-8 p-6 rounded-xl shadow-md outline-dashed outline-gray-500">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="application/pdf"
                className="hidden"
            />

            {/* Mostrar todos los archivos (cargados y nuevos) */}
            {allFiles.length > 0 ? (
                <div className="loaded-files mb-4">
                    {allFiles.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-100 rounded-md mb-2">
                            <FaFilePdf className="text-red-600 text-2xl" />
                            <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                {file.name}
                            </a>
                            <button 
                                className="text-gray-500 hover:text-red-500 transition-colors"
                                onClick={() => handleRemoveFile(file.name)}
                            >
                                <FaTimes />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div 
                    className="upload-area flex flex-col items-center gap-2 cursor-pointer p-8 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={triggerFileInput}
                >                                                 
                    <FaUpload className="text-gray-600 text-4xl" />                    
                    <p className="text-gray-600">Arrastra tu PDF aquí o haz clic para seleccionar</p>
                </div>
            )}
        </div>
    );
};
