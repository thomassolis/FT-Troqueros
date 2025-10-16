// FileViewer.tsx
import { useState } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';

interface FileData {
  fecha_subida: string;
  nombre: string;
  ruta: string;
  size: number;
  tipo: string;
  url: string;
}

type FileViewMode = 'grid' | 'list';

interface FileViewerProps {
  files: FileData[];
  className?: string;
}

const FileViewer = ({ files, className = '' }: FileViewerProps) => {
  const [viewMode, setViewMode] = useState<FileViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);

  // Filter files based on search term
  const filteredFiles = files.filter(file =>
    file.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get file icon based on type (solo el icono, sin enlace)
  const getFileIcon = (tipo: string, isListView: boolean = false) => {
    const type = tipo.toLowerCase();
    const iconSize = isListView ? "24" : "60";
    const imageSize = isListView ? "40" : "80";

    if (type.includes('pdf')) return <Icon icon="streamline:convert-pdf-2-solid" width={iconSize} height={iconSize} className='text-red-500' />;
    if (type.includes('png')) return <Icon icon="stash:image" width={imageSize} height={imageSize} className='text-gray-600' />;        
    if (type.includes('jpg')) return <Icon icon="stash:image" width={imageSize} height={imageSize} className='text-gray-600' />;        
    if (type.includes('jpeg')) return <Icon icon="stash:image" width={imageSize} height={imageSize} className='text-gray-600' />;    
    if (type.includes('image')) return <Icon icon="stash:image" width={imageSize} height={imageSize} className='text-gray-600' />;
    
    return <Icon icon="mdi:file" width={iconSize} height={iconSize} className='text-gray-400' />;
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Check if file is an image
  const isImage = (tipo: string) => tipo.toLowerCase().includes('image');

  // Handle file preview - ABRIR EN NUEVA PESTAÑA para todos los archivos
  const handlePreview = (file: FileData) => {    
    window.open(file.url, '_blank');
  };

  // Handle click en el icono/imagen (para grid view)
  const handleIconClick = (file: FileData, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevenir que se active el click del contenedor
    window.open(file.url, '_blank');
  };

  // Close modal (si decides mantenerlo para imágenes)
  const closeModal = () => setSelectedFile(null);

  return (
    <div className='flex items-center justify-center w-full'>
        <div className={`bg-gray-50 rounded-xl p-6 w-[85%] ${className}`}>
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 space-y-4 lg:space-y-0">
            <div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
                Comprobantes de pago
            </h2>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
                <input
                type="text"
                placeholder="Buscar archivos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
                </span>
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-white border border-gray-300 rounded-lg overflow-hidden">
                <button
                type='button'
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 transition-colors duration-200 ${
                    viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                >
                ⏹️ Grid
                </button>
                <button
                type='button'
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 transition-colors duration-200 ${
                    viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                >
                📋 Lista
                </button>
            </div>
            </div>
        </div>

        {/* Files Display */}
        {filteredFiles.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-6xl mb-4">📁</div>
            <p className="text-gray-600 text-lg">
                {searchTerm ? 'No se encontraron archivos' : 'No hay archivos para mostrar'}
            </p>
            </div>
        ) : viewMode === 'grid' ? (
            // Grid View
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFiles.map((file, index) => (
                <div
                key={index}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden cursor-pointer transform hover:-translate-y-1"
                onClick={() => handlePreview(file)}
                >
                {/* Preview Section */}
                <div className="relative aspect-video bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                    {isImage(file.tipo) ? (
                    <img
                        src={file.url}
                        alt={file.nombre}
                        className="w-full h-full object-cover cursor-pointer"
                        loading="lazy"
                        onClick={(e) => handleIconClick(file, e)}
                    />
                    ) : (
                    <div 
                        className="cursor-pointer p-4"
                        onClick={(e) => handleIconClick(file, e)}
                    >
                        {getFileIcon(file.tipo)}
                    </div>
                    )}
                    
                    {/* File type badge */}
                    <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-md text-xs font-medium">
                    {file.tipo.toUpperCase()}
                    </div>

                    {/* Preview overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                    <span className="text-white text-lg font-semibold opacity-0 hover:opacity-100 transition-opacity duration-300">
                        {isImage(file.tipo) ? '👁️ Ver' : '📖 Abrir'}
                    </span>
                    </div>
                </div>

                {/* File Info Section */}
                <div className="p-4">
                    <h3 className="font-semibold text-gray-800 truncate mb-2 text-sm leading-tight">
                    {file.nombre}
                    </h3>
                    
                    <div className="flex justify-between items-center text-xs text-gray-600">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {formatFileSize(file.size)}
                    </span>
                    <span>{formatDate(file.fecha_subida)}</span>
                    </div>
                </div>
                </div>
            ))}
            </div>
        ) : (
            // List View
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {filteredFiles.map((file, index) => (
                <div
                key={index}
                className="flex items-center p-4 border-b border-gray-100 last:border-b-0 hover:bg-blue-50 transition-all duration-200 cursor-pointer group"
                onClick={() => handlePreview(file)}
                >
                {/* Icono con enlace funcional */}
                <div 
                    className="text-3xl mr-4 text-gray-500 group-hover:text-blue-600 transition-colors duration-200 cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        window.open(file.url, '_blank');
                    }}
                    title="Abrir archivo en nueva pestaña"
                >
                    {getFileIcon(file.tipo, true)}
                </div>
                
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate group-hover:text-blue-700 transition-colors duration-200">
                    {file.nombre}
                    </h3>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600 mt-1">
                    <span className="bg-gray-100 px-2 py-1 rounded-full">{file.tipo}</span>
                    <span>{formatFileSize(file.size)}</span>
                    <span>{formatDate(file.fecha_subida)}</span>
                    </div>
                </div>

                <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="text-blue-600 font-medium">
                    {isImage(file.tipo) ? 'Ver imagen' : 'Abrir archivo'} →
                    </span>
                </div>
                </div>
            ))}
            </div>
        )}

        {/* Image Preview Modal (opcional - puedes eliminarlo si solo quieres abrir en nueva pestaña) */}
        {selectedFile && isImage(selectedFile.tipo) && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl max-h-full overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b">
                <h3 className="font-semibold text-lg truncate max-w-md">
                    {selectedFile.nombre}
                </h3>
                <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700 text-2xl p-2"
                >
                    ✕
                </button>
                </div>
                <div className="p-4 max-h-96 overflow-auto">
                <img
                    src={selectedFile.url}
                    alt={selectedFile.nombre}
                    className="max-w-full h-auto mx-auto rounded"
                />
                </div>
                <div className="p-4 border-t bg-gray-50">
                <div className="flex justify-between text-sm text-gray-600">
                    <span>Tamaño: {formatFileSize(selectedFile.size)}</span>
                    <span>Subido: {formatDate(selectedFile.fecha_subida)}</span>
                </div>
                </div>
            </div>
            </div>
        )}
        </div>
    </div>    
  );
};

export default FileViewer;