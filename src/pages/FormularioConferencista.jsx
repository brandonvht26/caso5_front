import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import clienteAxios from '../config/axios'
import Swal from 'sweetalert2'

const FormularioConferencista = () => {
    // 1. Estado para los 10 campos requeridos por el modelo
    const [conferencista, setConferencista] = useState({
        nombre: '',
        apellido: '',
        cedula: '',
        genero: '',
        ciudad: '',
        direccion: '',
        fecha_nacimiento: '',
        telefono: '',
        email: '',
        empresa: ''
    })

    const navigate = useNavigate()
    const { id } = useParams()

    useEffect(() => {
        if (id) {
            const obtenerConferencista = async () => {
                try {
                    const { data } = await clienteAxios.get(`/conferencista/${id}`) //
                    
                    // Formatear la fecha para que el input type="date" la reconozca
                    const fechaFormat = data.fecha_nacimiento.includes('T') 
                        ? data.fecha_nacimiento.split('T')[0] 
                        : data.fecha_nacimiento;
                        
                    setConferencista({
                        ...data,
                        fecha_nacimiento: fechaFormat
                    })
                } catch (error) {
                    Swal.fire('Error', 'No se pudo cargar la información del ponente', 'error')
                    navigate('/dashboard/conferencistas')
                }
            }
            obtenerConferencista()
        }
    }, [id])

    const handleChange = (e) => {
        setConferencista({
            ...conferencista,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validación frontend replicando el controlador (los 10 campos obligatorios)
        if (Object.values(conferencista).includes('')) {
            Swal.fire('Atención', 'Todos los campos son obligatorios', 'warning')
            return
        }

        try {
            if (id) {
                // Actualizar (PUT)
                await clienteAxios.put(`/conferencista/${id}`, conferencista)
                Swal.fire('¡Actualizado!', 'Datos del ponente actualizados', 'success')
            } else {
                // Crear (POST)
                await clienteAxios.post('/conferencistas', conferencista)
                Swal.fire('¡Registrado!', 'El conferencista ha sido invitado formalmente', 'success')
            }
            navigate('/dashboard/conferencistas')
        } catch (error) {
            // Manejamos el error si la cédula ya existe
            Swal.fire('Error', error.response?.data?.msg || 'Error en el servidor', 'error')
        }
    }

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-5xl mx-auto mt-5 border-t-8 border-violet-600">
            <h1 className="text-3xl font-black text-gray-800 mb-6 border-b-2 border-gray-100 pb-4">
                {id ? 'Editar Perfil del Ponente' : 'Registrar Nuevo Conferencista'}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Fila 1: Identificación Principal */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Cédula / Pasaporte *</label>
                        <input type="text" name="cedula" value={conferencista.cedula} onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-violet-500 outline-none" 
                            placeholder="Ej: 1712345678" disabled={!!id} 
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Nombres *</label>
                        <input type="text" name="nombre" value={conferencista.nombre} onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-violet-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Apellidos *</label>
                        <input type="text" name="apellido" value={conferencista.apellido} onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-violet-500 outline-none" />
                    </div>
                </div>

                {/* Fila 2: Perfil Profesional y Demográfico */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-violet-800 font-bold mb-2">Empresa / Institución *</label>
                        <input type="text" name="empresa" value={conferencista.empresa} onChange={handleChange}
                            className="w-full p-3 border border-violet-300 rounded-lg bg-violet-50 focus:ring-2 focus:ring-violet-500 outline-none font-semibold" 
                            placeholder="Ej: Google, Universidad Central..." />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Fecha Nacimiento *</label>
                        <input type="date" name="fecha_nacimiento" value={conferencista.fecha_nacimiento} onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-violet-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Género *</label>
                        <select name="genero" value={conferencista.genero} onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-violet-500 outline-none">
                            <option value="">-- Seleccione --</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>
                </div>

                {/* Fila 3: Contacto */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Correo Electrónico *</label>
                        <input type="email" name="email" value={conferencista.email} onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-violet-500 outline-none" 
                            placeholder="ponente@empresa.com" />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Teléfono Móvil *</label>
                        <input type="text" name="telefono" value={conferencista.telefono} onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-violet-500 outline-none" 
                            placeholder="Ej: +593 991234567" />
                    </div>
                </div>

                {/* Fila 4: Ubicación */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Ciudad de Origen *</label>
                        <input type="text" name="ciudad" value={conferencista.ciudad} onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-violet-500 outline-none" 
                            placeholder="Ej: Bogotá" />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Dirección *</label>
                        <input type="text" name="direccion" value={conferencista.direccion} onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-violet-500 outline-none" />
                    </div>
                </div>

                {/* Botones */}
                <div className="flex flex-col md:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
                    <button type="submit" className="bg-violet-600 w-full md:w-auto px-12 text-white p-3 rounded-lg font-black tracking-wide hover:bg-violet-700 transition shadow-md">
                        {id ? 'Guardar Cambios' : 'Registrar Conferencista'}
                    </button>
                    <button type="button" onClick={() => navigate('/dashboard/conferencistas')}
                        className="bg-gray-400 w-full md:w-auto px-12 text-white p-3 rounded-lg font-black tracking-wide hover:bg-gray-500 transition shadow-md">
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    )
}

export default FormularioConferencista