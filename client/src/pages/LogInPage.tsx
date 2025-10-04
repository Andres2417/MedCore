import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// Íconos de Font Awesome para Iniciar Sesión, Correo y Contraseña
// Se asume que la librería CSS/JS de Font Awesome está cargada globalmente.

/*
Paleta de colores:
#121212: Fondo muy oscuro (usado para el contenedor de la página)
#1E1E1E: Fondo principal (usado para la tarjeta de login)
#2E86AB: Azul primario (Botón de acción)
#383535: Fondo de elementos activos/hover y campos de entrada
#56B1BF: Azul de acento (Iconos)
#A8A8A8: Texto secundario/Placeholder
#E0E0E0: Texto principal
*/

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleLogin = async(e) => {
    e.preventDefault();
    console.log('Intentando iniciar sesión con:', email);

    try {
      const res = await axios.post('http://localhost:3002/api/v1/auth/login', {
        email,
        current_password: password
      });
      console.log('Respuesta del servidor:', res.data);

      // Guardar el token en localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      navigate('/admin');
    } catch (error) {
      setError(error.response?.data?.message || "Error de inicio de sesión");
    }
  };

  return (
    // Contenedor principal: Fondo muy oscuro (#121212)
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4 font-sans">
      
      {/* Tarjeta de Login: Fondo principal (#1E1E1E) */}
      <div className="w-full max-w-md bg-[#1E1E1E] p-8 md:p-10 rounded-2xl shadow-2xl shadow-black/50 border border-[#383535]">
        
        {/* Encabezado */}
        <div className="text-center mb-8">
          {/* Ícono de Corazón/Pulso en color azul de acento (#56B1BF) */}
          <i className="fas fa-heart-pulse text-4xl text-[#56B1BF] mb-3"></i>
          <h1 className="text-3xl font-extrabold text-[#E0E0E0]">
            Bienvenido a Medcore
          </h1>
          <p className="text-base text-[#A8A8A8] mt-2">
            Inicia sesión para gestionar tu salud.
          </p>
        </div>

        {/* Formulario de Login */}
        <form onSubmit={handleLogin}>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {/* Campo de Email */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-[#E0E0E0] mb-2">
              Correo Electrónico
            </label>
            <div className="relative">
              {/* Fondo del campo: Elemento activo/hover (#383535) */}
              <input
                type="email"
                id="email"
                className="w-full pl-10 pr-4 py-3 bg-[#383535] border border-transparent rounded-lg text-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent transition duration-150"
                placeholder="tu.correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {/* Icono de Correo en Azul de Acento (#56B1BF) */}
              <i className="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-[#56B1BF]"></i>
            </div>
          </div>

          {/* Campo de Contraseña */}
          <div className="mb-8">
            <label htmlFor="password" className="block text-sm font-medium text-[#E0E0E0] mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                className="w-full pl-10 pr-4 py-3 bg-[#383535] border border-transparent rounded-lg text-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent transition duration-150"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {/* Icono de Candado en Azul de Acento (#56B1BF) */}
              <i className="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-[#56B1BF]"></i>
            </div>
          </div>

          {/* Botón de Iniciar Sesión - Azul Primario (#2E86AB) */}
          <button
            type="submit"
            className="w-full flex items-center justify-center bg-[#2E86AB] text-white text-lg font-semibold px-4 py-3 rounded-lg shadow-lg shadow-[#2E86AB]/40 hover:bg-[#56B1BF] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >Iniciar Sesión
          </button>
        </form>

        {/* Enlace secundario */}
        <div className="mt-6 text-center text-sm">
          {/*<a href="#" className="text-[#56B1BF] hover:underline transition duration-150 mr-4">
            ¿Olvidaste tu Contraseña?
          </a>*/}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
