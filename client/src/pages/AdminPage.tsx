import { useEffect, useState } from "react";

const AdminPage = () => {

    return (
  <>
    <aside>
      <div>MedCore</div>
      <nav>
        <ul>
          <li>
            <a href="#">
              <span>Panel de Control</span>
            </a>
          </li>
          <li>
            <a href="#">
              <span>Pacientes</span>
            </a>
          </li>
          <li>
            <a href="#">
              <span>Citas</span>
            </a>
          </li>
          <li>
            <a href="#">
              <span>Inventario</span>
            </a>
          </li>
          <li>
            <a href="#">
              <span>Facturación</span>
            </a>
          </li>
          <li>
            <a href="#">
              <span>Reportes</span>
            </a>
          </li>
          <li>
            <a href="#">
              <span>Gestión de Usuarios</span>
            </a>
          </li>
        </ul>
      </nav>
      <div>
        <div>© 2024 MedCore. Todos los derechos reservados.</div>
      </div>
    </aside>

    <main>
      <header>
        <h1>Panel de Control</h1>
        <div>
          <div>
            <input type="text" placeholder="Buscar..." />
          </div>
          <div>
            <button>
              <span>Usuario</span>
            </button>
            <div>
              <a href="#">Mi Perfil</a>
              <a href="#">Configuración</a>
              <a href="#">Cerrar Sesión</a>
            </div>
          </div>
        </div>
      </header>

      <section>
        <div>
          <div>
            <div>Pacientes Activos</div>
            <div>12,540</div>
          </div>
        </div>
        <div>
          <div>
            <div>Citas del Día</div>
            <div>45</div>
          </div>
        </div>
        <div>
          <div>
            <div>Ingresos (Mes)</div>
            <div>$1.2M</div>
          </div>
        </div>
        <div>
          <div>
            <div>Alertas de Inventario</div>
            <div>3</div>
          </div>
        </div>
      </section>

      <section>
        <div>
          <h2>Ingresos y Citas (Últimos 6 meses)</h2>
          <div>Placeholder para Gráfico de Líneas</div>
        </div>
        <div>
          <h2>Alertas Recientes</h2>
          <ul>
            <li>
              <span>Stock de "Vacuna Tdap" bajo.</span>
            </li>
            <li>
              <span>Solicitud de acceso de Dr. García.</span>
            </li>
            <li>
              <span>Vencimiento próximo de "Anestesia".</span>
            </li>
          </ul>
        </div>
      </section>
    </main>
  </>
);

}
export default AdminPage;