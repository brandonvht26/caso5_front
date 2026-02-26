import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'

import Login from './pages/Login'
import DashboardLayout from './layout/DashboardLayout'
import Auditorios from './pages/Auditorios'
import FormularioAuditorio from './pages/FormularioAuditorio'
import Conferencistas from './pages/Conferencistas'
import FormularioConferencista from './pages/FormularioConferencista'
import Reservas from './pages/Reservas'
import FormularioReserva from './pages/FormularioReserva'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Ruta Pública */}
          <Route path="/" element={<Login />} />
          
          {/* Rutas Privadas */}
          <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={
                  <div className='text-center mt-20'>
                      <h1 className='text-4xl font-bold text-gray-800'>Panel de Control del Evento</h1>
                      <p className='text-xl text-gray-500 mt-4'>Seleccione un módulo en el menú izquierdo para gestionar la programación.</p>
                  </div>
              } />
              {/* --- RUTAS DE AUDITORIOS --- */}
              <Route path="auditorios" element={<Auditorios />} />
              <Route path="auditorios/crear" element={<FormularioAuditorio />} />
              <Route path="auditorios/editar/:id" element={<FormularioAuditorio />} />
              {/* --- RUTAS DE CONFERENCISTAS --- */}
              <Route path="conferencistas" element={<Conferencistas />} />
              <Route path="conferencistas/crear" element={<FormularioConferencista />} />
              <Route path="conferencistas/editar/:id" element={<FormularioConferencista />} />
              {/* --- RUTAS DE EVENTOS --- */}
              <Route path="reservas" element={<Reservas />} />
              <Route path="reservas/crear" element={<FormularioReserva />} />
              <Route path="reservas/editar/:id" element={<FormularioReserva />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App