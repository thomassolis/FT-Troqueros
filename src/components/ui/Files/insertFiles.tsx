import React, { useState, useRef } from "react";
import { FaFilePdf, FaTimes, FaUpload, FaDownload } from 'react-icons/fa';
import { Document, Page } from 'react-pdf';
import * as pdfjs from 'pdfjs-dist';

// Configura el worker con la versión local
try {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  } catch (e) {
    pdfjs.GlobalWorkerOptions.workerSrc = require('pdfjs-dist/build/pdf.worker.min.js');
  }

export const InsertFiles = () => {
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [numPages, setNumPages] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files.length > 0){
            const file = e.target.files[0];
            if(file.type === "application/pdf"){
                setPdfFile(file);
            } else {
                alert('Por favor, selecciona un archivo PDF');
            }
        }
    };

    const handleRemoveFile = () => {
        setPdfFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };
    
    const handlePreview = () => {
        if (pdfFile) {
            setShowModal(true);
        }
    };
    
    const handleCloseModal = () => {
        setShowModal(false);
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
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
            
            {pdfFile ? (
                <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div 
                        className="flex items-center gap-2 flex-grow cursor-pointer"
                        onClick={handlePreview}
                    >
                        <FaFilePdf className="text-red-600 text-2xl" />
                        <span className="text-gray-800 text-sm truncate max-w-xs">
                            {pdfFile.name}
                        </span>
                    </div>
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
                    onClick={triggerFileInput}
                >
                    <FaUpload className="upload-icon text-gray-600 text-4xl" />
                    <p className="text-gray-600 text-center">Arrastra tu PDF aquí o haz clic para seleccionar</p>          
                </div>
            )}

            {showModal && pdfFile && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
                    onClick={handleCloseModal}
                >
                    <div 
                        className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button 
                            className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"
                            onClick={handleCloseModal}
                        >
                            <FaTimes className="text-xl" />
                        </button>
                        
                        <div className="p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                Previsualización: {pdfFile.name}
                            </h3>
                            
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-sm text-gray-600">
                                    Páginas: {numPages || 'Cargando...'}
                                </span>
                                <a 
                                    href={URL.createObjectURL(pdfFile)} 
                                    download={pdfFile.name}
                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                                >
                                    <FaDownload /> Descargar PDF
                                </a>
                            </div>
                            
                            <div className="border border-gray-200 rounded-md overflow-hidden">
                                <Document
                                    file={pdfFile}
                                    onLoadSuccess={onDocumentLoadSuccess}
                                    loading={<div className="py-20 text-center text-gray-500">Cargando PDF...</div>}
                                    error={<div className="py-20 text-center text-red-500">Error al cargar el PDF</div>}
                                >
                                    {Array.from(new Array(numPages), (el, index) => (
                                        <Page 
                                            key={`page_${index + 1}`}
                                            pageNumber={index + 1}
                                            width={800}
                                            className="border-b border-gray-200 last:border-b-0"
                                            loading={<div className="py-10 text-center text-gray-500">Cargando página {index + 1}...</div>}
                                        />
                                    ))}
                                </Document>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};