import React, { useState, useRef, useEffect } from "react";
import { FaFilePdf, FaTimes, FaUpload } from 'react-icons/fa';
import * as pdfjs from 'pdfjs-dist';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface InsertFilesProps {
    onFileReady: (file: File | { name: string; url: string } | null, name: string) => void;
    fileName: string;
    files: any[];
    procedure: string;
}

export const InsertFiles: React.FC<InsertFilesProps> = ({ onFileReady, fileName, files, procedure }) => {
    const [currentFile, setCurrentFile] = useState<{ name: string; url: string; file?: File } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 1. Cargar archivo existente en modo 'modify'
useEffect(() => {
    if (procedure === 'modify' && files?.[0]) {
        const fileData = files[0];
        const fileUrl = fileData.link1?.url || fileData.url;
        const fileName = fileData.link1?.name || fileData.name;
        
        if (fileUrl && fileName) {
            fetch(fileUrl)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], fileName, { type: 'application/pdf' });
                    setCurrentFile({ name: file.name, url: URL.createObjectURL(file), file });
                    onFileReady(file, fileName); // ✅ ahora sí es un File válido
                });
        }
    }
}, [files, procedure]);


    // 2. Manejar nuevo archivo subido
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            const filePreview = {
                name: file.name,
                url: URL.createObjectURL(file),
                file: file // Guardamos el File object
            };
            setCurrentFile(filePreview);
            onFileReady(file, fileName); // Enviamos el File object al padre
        }
    };

    // 3. Eliminar archivo (tanto existente como nuevo)
    const handleRemoveFile = () => {
        setCurrentFile(null);
        onFileReady(null, fileName); // Notificar al padre que se eliminó
    };

    return (
        <div className="max-w-md mx-auto my-8 p-6 rounded-xl shadow-md outline-dashed outline-gray-500">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="application/pdf,image/*"
                className="hidden"
            />

            {/* Mostrar archivo actual */}
            {currentFile ? (
                <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-md mb-2">
                    <FaFilePdf className="text-red-600 text-2xl" />
                    <a 
                        href={currentFile.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-500 underline"
                    >
                        {currentFile.name}
                    </a>
                    <button
                        className="text-gray-500 hover:text-red-500 transition-colors"
                        onClick={handleRemoveFile}
                    >
                        <FaTimes />
                    </button>
                </div>
            ) : (
                <div 
                    className="upload-area flex flex-col items-center gap-2 cursor-pointer p-8 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <FaUpload className="text-gray-600 text-4xl" />
                    <p className="text-gray-600">Arrastra tu PDF aquí o haz clic para seleccionar</p>
                </div>
            )}
        </div>
    );
};