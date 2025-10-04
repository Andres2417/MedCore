import { useNavigate } from "react-router-dom";

// Íconos de Font Awesome (se asume que la librería CSS/JS está cargada globalmente)

    /*
    Paleta de colores:
    #121212: Fondo muy oscuro 
    #1E1E1E: Fondo principal 
    #2E86AB: Azul primario 
    #383535: Fondo de elementos activos/hover
    #56B1BF: Azul de acento 
    #A8A8A8: Texto secundario
    #E0E0E0: Texto principal
    */

const HomePage = () => {
    const navigate = useNavigate();
    const handleLoginClick = () => {
        navigate('/login');
    }

  // --- Lógica del Componente de Cabecera (Navbar) ---
  const renderHeader = () => (
    // Fondo más oscuro para la barra de navegación
    <header className="bg-[#121212] sticky top-0 z-10 border-b border-[#383535] shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
        
        {/* Logo/Marca - Enfocado en salud */}
        <div className="flex items-center">
          {/* Ícono de Corazón/Pulso en color azul de acento (#56B1BF) - fa-heart-pulse */}
          <i className="fas fa-heart-pulse h-8 w-8 text-[#56B1BF] text-3xl mr-3"></i>
          <span className="text-3xl font-extrabold text-[#a8a8a8]">Medcore</span>
        </div>
      </div>
    </header>
  );

  // --- Lógica del Componente de Sección Hero (Principal) ---
  const renderHeroSection = () => (
    // Fondo muy oscuro (#121212)
    <section className="bg-[#121212] h-[calc(100vh-81px)] flex items-center py-16" id="inicio">
      <div className="max-w-3xl mx-auto px-4 text-center">
        
        <h1 className="text-5xl sm:text-7xl font-extrabold text-gray-200 leading-tight mb-4">
          Tu <span className="text-[#56B1BF]">Salud Digital</span>, Simplificada
        </h1>
        
        <p className="text-lg sm:text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          Accede a tu historial médico, reserva teleconsultas y gestiona tus citas con total seguridad.
        </p>
        
        {/* Botones de CTA centrales y prominentes */}
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          {/* Botón principal en Azul Primario (#2E86AB) */}
          <button onClick={handleLoginClick} className="flex items-center justify-center bg-[#2E86AB] text-white text-xl font-semibold px-10 py-4 rounded-xl shadow-2xl shadow-[#2E86AB]/50 hover:bg-[#56B1BF] transition duration-300 transform hover:scale-[1.05]">
            <i className="fas fa-arrow-right-to-bracket w-6 h-6 mr-3"></i>
            INICIAR SESIÓN
          </button>
        </div>
        
        <div className="mt-16 flex justify-center space-x-8 text-gray-500">
            <span className="flex items-center text-sm">
                <i className="fas fa-shield-halved w-4 h-4 text-[#56B1BF] mr-2"></i> 
                {/* fa-shield-halved (Shield) */}
                Datos 100% Seguros
            </span>
            <span className="flex items-center text-sm">
                <i className="fas fa-stethoscope w-4 h-4 text-[#56B1BF] mr-2"></i> 
                {/* fa-stethoscope (Stethoscope) */}
                Atención 24/7
            </span>
        </div>
      </div>
    </section>
  );

  return (
    <div className="h-screen font-sans bg-[#1E1E1E]">
      {renderHeader()}
      <main>
        {renderHeroSection()}
      </main>
    </div>
  );
};

export default HomePage;
