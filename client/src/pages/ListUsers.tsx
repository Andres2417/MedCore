import React, { useEffect, useState } from "react";
import axios from "axios";

interface User {
  id: number;
  fullname: string;
  email: string;
  role: string;
  status: string;
  phone: string;
  date_of_birth: string | null;
  specialization: string | null;
  department: string | null;
  license_number: string | null;
}

const ROLES = ["Todos", "ADMINISTRADOR", "MEDICO", "ENFERMERO", "PACIENTE"];


const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("Todos");
  const [loading, setLoading] = useState(true);

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;

  useEffect(() => {
    axios
      .get("http://localhost:3002/api/v1/user/all")
      .then((res) => setUsers(res.data.users || res.data)) 
      .catch((err) => console.error("Error al obtener usuarios:", err))
      .finally(() => setLoading(false));
  }, []);

  // Filtro combinado (rol + búsqueda)
 const filteredUsers = users.filter((user) => {
  const roleMatch = selectedRole === "Todos" || user.role === selectedRole;
  const searchMatch =
    user.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase());
  return roleMatch && searchMatch;
});


  // Calcular usuarios para la página actual
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEdit = (id: number) => {
    alert(`Editar usuario ID: ${id}`);
  };

  const handleDelete = (id: number) => {
    if (window.confirm(`¿Seguro deseas eliminar al usuario ${id}?`)) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "text-green-400 bg-green-900/40";
      case "PENDING":
        return "text-yellow-400 bg-yellow-900/40";
      case "INACTIVE":
        return "text-red-400 bg-red-900/40";
      default:
        return "text-[#A8A8A8] bg-[#383535]";
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ADMINISTRADOR":
        return "bg-[#2E86AB] text-white";
      case "MEDICO":
        return "bg-[#56B1BF] text-gray-900";
      case "ENFERMERO":
        return "bg-purple-600/60 text-white";
      case "PACIENTE":
        return "bg-[#383535] text-[#E0E0E0]";
      default:
        return "bg-[#383535] text-[#A8A8A8]";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#1E1E1E] text-[#E0E0E0]">
        <i className="fas fa-spinner fa-spin mr-2"></i> Cargando usuarios...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1E1E1E] p-4 sm:p-8 font-sans">
      {/* Título */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-[#E0E0E0]">
          <i className="fas fa-users-line mr-3 text-[#56B1BF]"></i> Gestión de Usuarios
        </h1>
        {/* Filtro por rol */}
        <div className="relative md:w-56">
          <i className="fas fa-user-tag absolute left-4 top-1/2 transform -translate-y-1/2 text-[#56B1BF]"></i>
          <select
            className="w-full pl-12 pr-10 py-3 bg-[#383535] border border-transparent rounded-lg text-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-[#2E86AB] transition duration-150 appearance-none"
            value={selectedRole}
            onChange={(e) => {
              setSelectedRole(e.target.value);
              setCurrentPage(1);
            }}
          >
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role === "Todos" ? "Todos los Roles" : role}
              </option>
            ))}
          </select>
          <i className="fas fa-caret-down absolute right-3 top-1/2 transform -translate-y-1/2 text-[#A8A8A8] pointer-events-none"></i>
        </div>
      </div>

      {/* Contenedor principal */}
      <div className="bg-[#121212] p-6 rounded-xl shadow-2xl shadow-black/50 border border-[#383535]">
        {/* Filtros */}
        <div className="mb-6 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          {/* Búsqueda */}
          <div className="relative flex-1">
            <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#56B1BF]"></i>
            <input
              type="text"
              placeholder="Buscar por nombre o correo..."
              className="w-full pl-12 pr-4 py-3 bg-[#383535] border border-transparent rounded-lg text-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-[#2E86AB] transition duration-150 placeholder-[#A8A8A8]"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto rounded-lg border border-[#383535]">
          <table className="min-w-full divide-y divide-[#383535]">
            <thead className="bg-[#383535]">
              <tr>
                {["Nombre", "Email", "Rol", "Teléfono", "Estado", "Acciones"].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-bold text-[#E0E0E0] uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#383535]">
              {currentUsers.length > 0 ? (
                currentUsers.map((user, index) => (
                  <tr key={user.id} className={index % 2 === 0 ? "bg-[#1E1E1E]" : "bg-[#121212]"}>
                    <td className="px-6 py-4 text-sm text-[#E0E0E0]">{user.fullname}</td>
                    <td className="px-6 py-4 text-sm text-[#A8A8A8]">{user.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${getRoleBadgeColor(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#A8A8A8]">{user.phone || "—"}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          user.status
                        )}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(user.id)}
                        className="text-[#56B1BF] hover:text-[#2E86AB] transition duration-150 mr-3"
                        title="Editar"
                      >
                        <i className="fas fa-edit text-lg"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-500 hover:text-red-700 transition duration-150"
                        title="Eliminar"
                      >
                        <i className="fas fa-trash-alt text-lg"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-[#A8A8A8] text-lg">
                    <i className="fas fa-user-slash mr-2"></i> No se encontraron usuarios.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-4 py-2 rounded-lg border transition duration-150 ${
                  currentPage === i + 1
                    ? "bg-[#56B1BF] text-gray-900 font-bold"
                    : "bg-[#383535] text-[#E0E0E0] hover:bg-[#2E86AB]"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
