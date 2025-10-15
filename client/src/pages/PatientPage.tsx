import React, { useState } from "react";

// Tipos para los datos
interface Appointment {
  id: number;
  doctor: string;
  fecha: string;
  hora: string;
  motivo: string;
  tipo: "Presencial" | "Online";
}

interface Resultado {
  id: number;
  nombre: string;
  fecha: string;
  icono: string;
}

interface ResumenSalud {
  diagnosticos: string;
  medicamentos: string;
  presion: string;
  proximaCita: string;
}

interface PatientData {
  nombre: string;
  proximasCitas: Appointment[];
  ultimosResultados: Resultado[];
  resumenSalud: ResumenSalud;
}

// Datos simulados (mock)
const MOCK_DATA: PatientData = {
  nombre: "Laura",
  proximasCitas: [
    {
      id: 1,
      doctor: "Dr. Carlos Ruiz",
      fecha: "25 de Octubre",
      hora: "10:00 AM",
      motivo: "Consulta de seguimiento",
      tipo: "Presencial",
    },
    {
      id: 2,
      doctor: "Dra. Laura Hernández",
      fecha: "05 de Noviembre",
      hora: "2:30 PM",
      motivo: "Videoconsulta",
      tipo: "Online",
    },
  ],
  ultimosResultados: [
    { id: 101, nombre: "Análisis de Sangre Completo", fecha: "20 de Octubre", icono: "fa-vial" },
    { id: 102, nombre: "Radiografía de Tórax", fecha: "15 de Octubre", icono: "fa-file-medical-alt" },
  ],
  resumenSalud: {
    diagnosticos: "Diabetes tipo 2, Hipertensión",
    medicamentos: "Metformina, Lisinopril",
    presion: "120/80 mmHg",
    proximaCita: "Oct 25",
  },
};

// --- Componentes Reutilizables ---

interface CardProps {
  title?: string;
  className?: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children, className = "" }) => (
  <div className={`bg-[#121212] p-6 rounded-xl shadow-lg border border-[#383535] ${className}`}>
    {title && (
      <h2 className="text-xl font-bold text-[#E0E0E0] mb-4 border-b border-[#383535] pb-2">
        {title}
      </h2>
    )}
    {children}
  </div>
);

interface AppointmentRowProps {
  doctor?: string;
  fecha?: string;
  hora?: string;
  motivo?: string;
  resultadoNombre?: string;
  resultadoFecha?: string;
  icon: string;
  isPrimary?: boolean;
}

const AppointmentRow: React.FC<AppointmentRowProps> = ({
  doctor,
  fecha,
  hora,
  motivo,
  resultadoNombre,
  resultadoFecha,
  icon,
  isPrimary = false,
}) => {
  const borderColor = isPrimary ? "border-[#2E86AB]" : "border-[#383535]";

  return (
    <li className={`p-4 bg-[#1E1E1E] rounded-lg flex items-center justify-between border-l-4 ${borderColor}`}>
      <div className="flex items-center space-x-4">
        <i className={`fas ${icon} text-2xl text-[#56B1BF]`}></i>
        <div>
          <div className="font-bold text-[#E0E0E0]">{doctor || resultadoNombre}</div>
          <div className="text-sm text-[#A8A8A8]">
            {doctor ? `${fecha}, ${hora}` : resultadoFecha}
          </div>
          {motivo && <div className="text-sm text-[#A8A8A8]">{motivo}</div>}
        </div>
      </div>

      <button
        className="text-[#56B1BF] hover:text-[#2E86AB] font-medium text-sm transition-colors duration-200 flex items-center"
        onClick={() => alert(`Navegando a detalles de: ${doctor || resultadoNombre}`)}
      >
        Ver detalles
        <i className="fas fa-chevron-right ml-2 text-xs"></i>
      </button>
    </li>
  );
};

interface HealthStatProps {
  title: string;
  value: string;
  valueColor?: string;
}

const HealthStat: React.FC<HealthStatProps> = ({ title, value, valueColor = "text-[#E0E0E0]" }) => (
  <div className="p-4 rounded-lg bg-[#383535] h-full flex flex-col justify-between">
    <h3 className="font-bold text-[#E0E0E0] mb-1">{title}</h3>
    <div className={`text-xl font-extrabold ${valueColor}`}>{value}</div>
  </div>
);

// --- Sidebar ---

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
  const navItems = [
    { name: "Panel Principal", icon: "fa-tachometer-alt" },
    { name: "Mis Citas", icon: "fa-calendar-alt" },
    { name: "Historia Clínica", icon: "fa-notes-medical" },
    { name: "Resultados", icon: "fa-flask" },
    { name: "Mensajes", icon: "fa-envelope-open-text" },
    { name: "Mi Perfil", icon: "fa-user-circle" },
  ];

  return (
    <aside className="bg-[#121212] w-64 p-6 shadow-md flex flex-col h-screen sticky top-0">
      <div className="text-2xl font-bold text-[#56B1BF] mb-8">MedCore</div>
      <nav className="w-full">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <a
                href="#"
                onClick={() => setActiveSection(item.name)}
                className={`
                  flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200
                  ${
                    activeSection === item.name
                      ? "text-[#E0E0E0] bg-[#383535]"
                      : "text-[#A8A8A8] hover:bg-[#383535]/50 hover:text-[#56B1BF]"
                  }
                `}
              >
                <i
                  className={`fas ${item.icon} ${
                    activeSection === item.name ? "text-[#56B1BF]" : ""
                  }`}
                ></i>
                <span>{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

// --- Contenido del Dashboard Principal ---

interface DashboardContentProps {
  data: PatientData;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ data }) => {
  const { nombre, proximasCitas, ultimosResultados, resumenSalud } = data;

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#E0E0E0]">
          Bienvenido, <span className="text-[#56B1BF]">{nombre}</span>
        </h1>
        <div className="relative group">
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#2E86AB] text-[#E0E0E0] hover:bg-[#56B1BF] transition-colors duration-200">
            <i className="fas fa-user-circle text-xl"></i>
          </button>
          <div className="absolute right-0 mt-2 w-48 bg-[#121212] rounded-md shadow-lg py-1 z-50 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 transform scale-95 group-hover:scale-100 group-focus-within:scale-100 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto origin-top-right">
            <a href="#" className="block px-4 py-2 text-sm text-[#A8A8A8] hover:bg-[#383535]">
              Mi Perfil
            </a>
            <a href="#" className="block px-4 py-2 text-sm text-[#A8A8A8] hover:bg-[#383535]">
              Cerrar Sesión
            </a>
          </div>
        </div>
      </header>

      <section className="mb-8">
        <Card title="Próximas Citas">
          <ul className="space-y-4">
            {proximasCitas.map((cita, index) => (
              <AppointmentRow
                key={cita.id}
                doctor={cita.doctor}
                fecha={cita.fecha}
                hora={cita.hora}
                motivo={cita.motivo}
                icon={cita.tipo === "Online" ? "fa-video" : "fa-user-md"}
                isPrimary={index === 0}
              />
            ))}
          </ul>
        </Card>
      </section>

      <section className="mb-8">
        <Card title="Últimos Resultados">
          <ul className="space-y-4">
            {ultimosResultados.map((resultado) => (
              <AppointmentRow
                key={resultado.id}
                resultadoNombre={resultado.nombre}
                resultadoFecha={resultado.fecha}
                icon={resultado.icono}
              />
            ))}
          </ul>
        </Card>
      </section>

      <section>
        <Card title="Resumen de Salud">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <HealthStat title="Diagnósticos Recientes" value={resumenSalud.diagnosticos} valueColor="text-[#A8A8A8]" />
            <HealthStat title="Medicamentos Actuales" value={resumenSalud.medicamentos} valueColor="text-[#A8A8A8]" />
            <HealthStat title="Última Presión Arterial" value={resumenSalud.presion} valueColor="text-[#56B1BF]" />
            <HealthStat title="Próxima Cita" value={resumenSalud.proximaCita} valueColor="text-[#2E86AB]" />
          </div>
        </Card>
      </section>
    </div>
  );
};

// --- Página principal del paciente ---

const PatientPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("Panel Principal");

  const renderContent = () => {
    switch (activeSection) {
      case "Panel Principal":
        return <DashboardContent data={MOCK_DATA} />;
      default:
        return (
          <div className="flex-1 p-8 text-center flex items-center justify-center">
            <p className="text-xl text-[#A8A8A8]">
              Contenido de la sección{" "}
              <span className="text-[#E0E0E0] font-bold">{activeSection}</span> en desarrollo.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex bg-[#1E1E1E] font-sans">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="flex-1 overflow-y-auto">{renderContent()}</main>
    </div>
  );
};

export default PatientPage;
