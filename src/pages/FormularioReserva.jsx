import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import clienteAxios from '../config/axios'
import Swal from 'sweetalert2'

const FormularioReserva = () => {
    // 1. Estado basado en el modelo de Reserva
    const [reserva, setReserva] = useState({
        codigo: '',
        descripcion: '',
        conferencista: '',
        auditorio: ''
    })

    // 2. Listas para los selects (poblar desde la API)
    const [conferencistas, setConferencistas] = useState([])
    const [auditorios, setAuditorios] = useState([])

    const navigate = useNavigate()
    const { id } = useParams()

    useEffect(() => {
        // Cargar conferencistas y auditorios para los selects
        const cargarDependencias = async () => {
            try {
                const [resConferencistas, resAuditorios] = await Promise.all([
                    clienteAxios.get('/conferencistas'),
                    clienteAxios.get('/auditorios')
                ])
                setConferencistas(resConferencistas.data)
                setAuditorios(resAuditorios.data)
            } catch (error) {
                Swal.fire('Error', 'No se pudieron cargar los datos necesarios', 'error')
            }
        }
        cargarDependencias()

        // Si hay id, cargar los datos de la reserva existente
        if (id) {
            const obtenerReserva = async () => {
                try {
                    const { data } = await clienteAxios.get(`/reserva/${id}`)
                    // El populate devuelve objetos, necesitamos solo los IDs para los selects
                    setReserva({
                        codigo: data.codigo,
                        descripcion: data.descripcion,
                        conferencista: data.conferencista?._id || '',
                        auditorio: data.auditorio?._id || ''
                    })
                } catch (error) {
                    Swal.fire('Error', 'No se pudo cargar la información de la reserva', 'error')
                    navigate('/dashboard/reservas')
                }
            }
            obtenerReserva()
        }
    }, [id])

    const handleChange = (e) => {
        setReserva({
            ...reserva,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (Object.values(reserva).includes('')) {
            Swal.fire('Atención', 'Todos los campos son obligatorios', 'warning')
            return
        }

        try {
            if (id) {
                // Actualizar Reserva (PUT)
                await clienteAxios.put(`/reserva/${id}`, reserva)
                Swal.fire('¡Actualizada!', 'La reserva se actualizó correctamente', 'success')
            } else {
                // Crear Reserva (POST)
                await clienteAxios.post('/reservas', reserva)
                Swal.fire('¡Registrada!', 'La reserva ha sido creada exitosamente', 'success')
            }
            navigate('/dashboard/reservas')
        } catch (error) {
            Swal.fire('Error', error.response?.data?.msg || 'Error en el servidor', 'error')
        }
    }

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-3xl mx-auto mt-5 border-t-8 border-violet-600">
            <h1 className="text-3xl font-black text-gray-800 mb-6 border-b-2 border-gray-100 pb-4">
                {id ? 'Editar Reserva' : 'Registrar Nueva Reserva'}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Fila 1: Código y Descripción */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Código de Reserva *</label>
                        <input
                            type="text"
                            name="codigo"
                            value={reserva.codigo}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-violet-500 outline-none uppercase"
                            placeholder="Ej: RES-001"
                            disabled={!!id}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Descripción del Evento *</label>
                        <input
                            type="text"
                            name="descripcion"
                            value={reserva.descripcion}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-violet-500 outline-none"
                            placeholder="Ej: Conferencia sobre IA Generativa"
                        />
                    </div>
                </div>

                {/* Fila 2: Select Conferencista */}
                <div>
                    <label className="block text-violet-800 font-bold mb-2">Conferencista Asignado *</label>
                    <select
                        name="conferencista"
                        value={reserva.conferencista}
                        onChange={handleChange}
                        className="w-full p-3 border border-violet-300 rounded-lg bg-violet-50 focus:ring-2 focus:ring-violet-500 outline-none font-semibold"
                    >
                        <option value="">-- Seleccione un conferencista --</option>
                        {conferencistas.map(ponente => (
                            <option key={ponente._id} value={ponente._id}>
                                {ponente.nombre} {ponente.apellido} — {ponente.empresa}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Fila 3: Select Auditorio */}
                <div>
                    <label className="block text-violet-800 font-bold mb-2">Auditorio Asignado *</label>
                    <select
                        name="auditorio"
                        value={reserva.auditorio}
                        onChange={handleChange}
                        className="w-full p-3 border border-violet-300 rounded-lg bg-violet-50 focus:ring-2 focus:ring-violet-500 outline-none font-semibold"
                    >
                        <option value="">-- Seleccione un auditorio --</option>
                        {auditorios.map(salon => (
                            <option key={salon._id} value={salon._id}>
                                {salon.nombre} — {salon.ubicacion} ({salon.capacidad} pax)
                            </option>
                        ))}
                    </select>
                </div>

                {/* Resumen visual si ambos están seleccionados */}
                {reserva.conferencista && reserva.auditorio && (() => {
                    const ponente = conferencistas.find(c => c._id === reserva.conferencista)
                    const salon = auditorios.find(a => a._id === reserva.auditorio)
                    return ponente && salon ? (
                        <div className="bg-violet-50 border border-violet-200 rounded-lg p-4 mt-2">
                            <p className="text-violet-800 font-bold text-sm mb-2 uppercase tracking-wide">Resumen de la Reserva</p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <span className="text-gray-500">Ponente:</span>
                                    <p className="font-semibold text-gray-800">{ponente.nombre} {ponente.apellido}</p>
                                    <p className="text-gray-500 text-xs">{ponente.empresa}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Salón:</span>
                                    <p className="font-semibold text-gray-800">{salon.nombre}</p>
                                    <p className="text-gray-500 text-xs">{salon.ubicacion} · {salon.capacidad} pax</p>
                                </div>
                            </div>
                        </div>
                    ) : null
                })()}

                {/* Botones */}
                <div className="flex flex-col md:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
                    <button type="submit" className="bg-violet-600 w-full text-white p-3 rounded-lg font-black tracking-wide hover:bg-violet-700 transition shadow-md">
                        {id ? 'Guardar Cambios' : 'Confirmar Reserva'}
                    </button>
                    <button type="button" onClick={() => navigate('/dashboard/reservas')}
                        className="bg-gray-400 w-full text-white p-3 rounded-lg font-black tracking-wide hover:bg-gray-500 transition shadow-md">
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    )
}

export default FormularioReserva
