import React, { useState, useCallback } from 'react';
import axios, { type AxiosProgressEvent } from 'axios';
/*
Paleta de colores:
#121212: Fondo muy oscuro (Contenedor de la página)
#1E1E1E: Fondo principal (Tarjeta del formulario)
#2E86AB: Azul primario (Botón de acción)
#383535: Fondo de elementos activos/hover y campos de entrada
#56B1BF: Azul de acento (Iconos)
#A8A8A8: Texto secundario/Placeholder
#E0E0E0: Texto principal
*/

const BulkUserUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>(''); // 'pending', 'uploading', 'success', 'error'
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // --- Manejadores de Archivos ---

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setStatus('pending');
    } else {
      setFile(null);
      setStatus('error');
      alert('Error: Por favor, selecciona un archivo CSV válido.'); 
    }
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFileChange(files[0]);
    }
    // Quitar efectos visuales de drag over si los hubiera
  }, []);

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Añadir efectos visuales para indicar que se puede soltar el archivo
  };

  const handleButtonClick = () => {
    // Simular el click en el input de tipo file oculto
    fileInputRef.current?.click();
  };

  // --- Lógica de Subida ---
  
const handleUpload = async (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();

  if (!file) {
    setStatus('error');
    return;
  }

  setIsLoading(true);
  setStatus('uploading');

  try {
    const formData = new FormData();
    formData.append('file', file); // el nombre "file" debe coincidir con multer.single('file')

    const token = localStorage.getItem('token');

    const response = await axios.post(
      'http://localhost:3002/api/v1/user/upload-users/',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          const loaded = progressEvent?.loaded ?? 0;
          const total = progressEvent?.total ?? 1;
          const percent = Math.round((loaded * 100) / total);
          console.log(`Progreso: ${percent}%`);
        },
      }
    );

    console.log('Respuesta del servidor:', response.data);
    setStatus('success');
    setFile(null);
  } catch (error: any) {
    console.error('Error subiendo el archivo:', error.response?.data || error.message);
    setStatus('error');
  } finally {
    setIsLoading(false);
  }
};


  // --- Renderizado de la Interfaz ---

  const renderStatusMessage = () => {
    if (status === 'success') {
      return (
        <p className="mt-4 text-[#56B1BF] font-semibold flex items-center justify-center">
          <i className="fas fa-check-circle mr-2 text-xl"></i> Carga completada. ¡Usuarios añadidos!
        </p>
      );
    }
    if (status === 'error' && !isLoading) {
      return (
        <p className="mt-4 text-red-500 font-semibold flex items-center justify-center">
          <i className="fas fa-triangle-exclamation mr-2 text-xl"></i> Error de archivo. Asegúrate de que sea CSV.
        </p>
      );
    }
    if (status === 'pending' && file) {
        return (
            <p className="mt-4 text-[#A8A8A8] font-semibold flex items-center justify-center">
                <i className="fas fa-file-csv mr-2 text-xl"></i> Archivo listo: {file.name}
            </p>
        );
    }
    return null;
  };

  return (

    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4 font-sans">
      
      {/* Tarjeta de Carga Masiva: Fondo principal (#1E1E1E) */}
      <div className="w-full max-w-xl bg-[#1E1E1E] p-8 md:p-10 rounded-2xl shadow-2xl shadow-black/50 border border-[#383535]">
        
        {/* Encabezado */}
        <div className="text-center mb-8">
          {/* Ícono de Carga Masiva en color azul de acento (#56B1BF) */}
          <i className="fas fa-cloud-arrow-up text-4xl text-[#56B1BF] mb-3"></i>
          <h1 className="text-3xl font-extrabold text-[#E0E0E0]">
            Carga Masiva de Usuarios
          </h1>
          <p className="text-base text-[#A8A8A8] mt-2">
            Sube un archivo CSV para registrar múltiples usuarios a la vez.
          </p>
        </div>

        {/* Área de Drag and Drop */}
        <div 
          className="p-8 border-2 border-dashed rounded-xl transition duration-200"
          style={{ borderColor: file ? '#56B1BF' : '#383535' }} // Borde de acento si hay archivo
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={(e) => { e.preventDefault(); /* quitar estilo de drag over */ }}
          onClick={handleButtonClick} // Permite hacer click para abrir el diálogo
        >
          <div className="text-center">
            {/* Icono de Archivo o Subida */}
            <i className="fas fa-upload text-5xl text-[#56B1BF] opacity-80 mb-4"></i>
            <p className="text-lg text-[#E0E0E0] font-medium">
              Arrastra y suelta tu archivo CSV aquí
            </p>
            <p className="text-sm text-[#A8A8A8] mt-1 mb-4">
              o haz click para seleccionar el archivo. (Solo formato CSV)
            </p>

            {/* Input de archivo Oculto */}
            <input 
              type="file" 
              ref={fileInputRef} 
              accept=".csv" 
              onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)} 
              className="hidden" 
            />
            
            {/* Botón de Carga Manual (Alternativa al drag and drop) */}
            <button
              type="button"
              onClick={handleButtonClick}
              className="bg-[#383535] text-[#E0E0E0] font-semibold px-6 py-3 rounded-lg hover:bg-gray-700 transition duration-150 border border-transparent hover:border-[#56B1BF]"
            >
              Seleccionar Archivo
            </button>
          </div>
        </div>

        {/* Mensaje de Estado */}
        {renderStatusMessage()}
        
        {/* Botón de Procesar Subida */}
        <div className="mt-6">
            <button
              type="button"
              onClick={handleUpload}
              className="w-full flex items-center justify-center bg-[#2E86AB] text-white text-lg font-semibold px-4 py-3 rounded-lg shadow-xl shadow-[#2E86AB]/40 hover:bg-[#56B1BF] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || status !== 'pending'}
            >
              {isLoading ? (
                <i className="fas fa-spinner fa-spin mr-2"></i>
              ) : (
                <i className="fas fa-cloud-arrow-up mr-2"></i>
              )}
              {isLoading ? 'PROCESANDO DATOS...' : 'PROCESAR SUBIDA MASIVA'}
            </button>
          </div>
          
          {/* Ejemplo de formato */}
          <div className="mt-8 text-center border-t border-[#383535] pt-6">
            <p className="text-sm text-[#A8A8A8]">
                El archivo CSV debe incluir las siguientes columnas: <br/>
                <code className="text-[#56B1BF] font-mono">email, fullname, role, current_password, status, specialization, department, license_number, phone, date_of_birth</code>
            </p>
          </div>

      </div>
    </div>
  );
};

export default BulkUserUploader;
