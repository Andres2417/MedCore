import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
    // Definiciones de color para referencia
    /*
    Paleta de colores:
    #121212: Fondo muy oscuro (Sidebar)
    #1E1E1E: Fondo principal (Body)
    #2E86AB: Azul primario (Botones/Énfasis)
    #383535: Fondo de elementos activos/hover
    #56B1BF: Azul de acento (Iconos/Resaltado)
    #A8A8A8: Texto secundario
    #E0E0E0: Texto principal
    */

    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Módulos de navegación para renderizar la barra lateral
    const navItems = [
        { name: "Panel de Control", icon: "fas fa-tachometer-alt", isActive: true },
        { name: "Usuarios", icon: "fas fa-user-injured" },
        { name: "Inventario", icon: "fas fa-box-open" },
        { name: "Facturación", icon: "fas fa-file-invoice-dollar" },
        { name: "Reportes", icon: "fas fa-chart-line" },
        { name: "Gestión de Usuarios", icon: "fas fa-users-cog" },
    ];

    // Datos simulados para los KPIs
    const kpis = [
        { title: "Pacientes Activos", value: "12,540", icon: "fas fa-procedures", color: "#56B1BF", textColor: "text-[#56B1BF]" },
        { title: "Citas del Día", value: "45", icon: "fas fa-calendar-check", color: "#2E86AB", textColor: "text-[#2E86AB]" },
        { title: "Ingresos (Mes)", value: "$1.2M", icon: "fas fa-dollar-sign", color: "#56B1BF", textColor: "text-[#56B1BF]" },
        { title: "Alertas de Inventario", value: "3", icon: "fas fa-exclamation-triangle", color: "#2E86AB", textColor: "text-[#2E86AB]" },
    ];

    // Alertas simuladas
    const alerts = [
        { message: 'Stock de "Vacuna Tdap" bajo.', type: 'critical', iconColor: 'text-[#2E86AB]' },
        { message: 'Solicitud de acceso de Dr. García.', type: 'warning', iconColor: 'text-[#56B1BF]' },
        { message: 'Vencimiento próximo de "Anestesia".', type: 'critical', iconColor: 'text-[#2E86AB]' },
    ];

    return (
        <div className="flex min-h-screen bg-[#1E1E1E] text-[#E0E0E0]">
            {/* Barra de Navegación Lateral (Sidebar) */}
            <aside className="bg-[#121212] w-64 p-6 shadow-xl rounded-lg m-4 flex flex-col items-center">
                <div className="text-2xl font-bold text-[#56B1BF] mb-8">MedCore</div>
                <nav className="w-full">
                    <ul className="space-y-4">
                        {navItems.map((item) => (
                            <li key={item.name}>
                                <button
                                    onClick={() => {
                                        if (item.name === "Gestión de Usuarios") {
                                            navigate("/admin/upload-users");
                                        } 
                                        else if (item.name === "Usuarios") {
                                            navigate("/admin/list-users");
                                        } 
                                        // Agregar más rutas NAVBAR
                                        
                                        else {
                                            navigate("/admin");
                                        }
                                    }}
                                    className={`flex items-center w-full text-left space-x-3 p-3 rounded-lg text-[#A8A8A8] transition-colors duration-200 
                                    ${item.isActive ? 'bg-[#383535] text-[#56B1BF]' : 'hover:bg-[#383535] hover:text-[#56B1BF]'}`}
                                >
                                    <i className={item.icon}></i>
                                    <span>{item.name}</span>
                                </button>

                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="mt-auto w-full">
                </div>
            </aside>

            {/* Contenido Principal */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-[#E0E0E0] mb-4 sm:mb-0">Panel de Control</h1>
                    <div className="flex items-center space-x-4">
                        {/* Campo de Búsqueda */}
                        <div className="relative w-full sm:w-auto">
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="px-4 py-2 rounded-lg border border-[#383535] bg-[#121212] text-[#E0E0E0] 
                                    focus:outline-none focus:ring-2 focus:ring-[#2E86AB] transition-all duration-200 w-full"
                            />
                            <i className="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-[#A8A8A8]"></i>
                        </div>
                        {/* Menú de Perfil */}
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center space-x-2 p-2 rounded-full bg-[#2E86AB] text-[#E0E0E0] hover:bg-[#56B1BF] transition-colors duration-200"
                            >
                                <i className="fas fa-user-circle text-lg"></i>
                            </button>
                            {/* Dropdown del Perfil */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-[#121212] rounded-md shadow-lg py-1 z-50 origin-top-right">
                                    <a href="#" className="block px-4 py-2 text-sm text-[#A8A8A8] hover:bg-[#383535]">Mi Perfil</a>
                                    <a href="#" className="block px-4 py-2 text-sm text-[#A8A8A8] hover:bg-[#383535]">Configuración</a>
                                    <a href="#" onClick={(e) => {
                                        e.preventDefault();
                                        localStorage.removeItem('token');
                                        localStorage.removeItem('user');
                                        navigate('/login');
                                    }} className="block px-4 py-2 text-sm text-[#A8A8A8] hover:bg-[#383535]">Cerrar Sesión</a>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Sección de Tarjetas de KPIs (Responsive Grid) */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {kpis.map((kpi) => (
                        <div
                            key={kpi.title}
                            className="bg-[#121212] p-6 rounded-xl shadow-lg flex items-center justify-between transition-transform duration-300 hover:scale-[1.02]"
                        >
                            <div>
                                <div className="text-sm text-[#A8A8A8] font-semibold uppercase">{kpi.title}</div>
                                <div className={`text-3xl font-bold mt-1 ${kpi.textColor || 'text-[#E0E0E0]'}`}>{kpi.value}</div>
                            </div>
                            <i className={`${kpi.icon} text-4xl`} style={{ color: kpi.color }}></i>
                        </div>
                    ))}
                </section>

                {/* Sección de Gráficos y Alertas (Responsive Grid) */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Gráfico (Placeholder) */}
                    <div className="lg:col-span-2 bg-[#121212] p-6 rounded-xl shadow-lg">
                        <h2 className="text-lg font-semibold text-[#E0E0E0] mb-4">Ingresos (Últimos 6 meses)</h2>
                        <div className="bg-[#1E1E1E] rounded-md h-64 flex items-center justify-center text-[#A8A8A8]">
                            <span>Gráfico de líneas aquí (Placeholder)</span>
                        </div>
                    </div>

                    {/* Alertas Recientes */}
                    <div className="bg-[#121212] p-6 rounded-xl shadow-lg">
                        <h2 className="text-lg font-semibold text-[#E0E0E0] mb-4">Alertas Recientes</h2>
                        <ul className="space-y-4">
                            {alerts.map((alert, index) => (
                                <li
                                    key={index}
                                    className={`p-3 bg-[#383535] rounded-lg ${alert}`}
                                >
                                    <i className={`fas fa-info-circle ${alert.iconColor} mr-2`}></i>
                                    <span className="text-sm text-[#E0E0E0]">{alert.message}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AdminPage;
