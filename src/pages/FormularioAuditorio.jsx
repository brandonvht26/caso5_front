import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import clienteAxios from '../config/axios'
import Swal from 'sweetalert2'

const FormularioAuditorio = () => {
    // 1. Estado basado en el modelo de Auditorio
    const [auditorio, setAuditorio] = useState({
        codigo: '',
        nombre: '',
        ubicacion: '',
        capacidad: '',
        descripcion: ''
    })

    const navigate = useNavigate()
    const { id } = useParams()

    useEffect(() => {
        if (id) {
            const obtenerAuditorio = async () => {
                try {
                    const { data } = await clienteAxios.get(`/auditorio/${id}`) //
                    setAuditorio(data)
                } catch (error) {
                    Swal.fire('Error', 'No se pudo cargar la información del auditorio', 'error')
                    navigate('/dashboard/auditorios')
                }
            }
            obtenerAuditorio()
        }
    }, [id])

    const handleChange = (e) => {
        setAuditorio({
            ...auditorio,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validación frontend replicando el controlador (ningún campo vacío)
        if (Object.values(auditorio).includes('')) {
            Swal.fire('Atención', 'Todos los campos son obligatorios', 'warning')
            return
        }

        try {
            if (id) {
                // Actualizar Auditorio (PUT)
                await clienteAxios.put(`/auditorio/${id}`, auditorio)
                Swal.fire('¡Actualizado!', 'Los datos del salón se actualizaron correctamente', 'success')
            } else {
                // Crear Auditorio (POST)
                await clienteAxios.post('/auditorios', auditorio)
                Swal.fire('¡Registrado!', 'El auditorio ha sido agregado al catálogo', 'success')
            }
            navigate('/dashboard/auditorios')
        } catch (error) {
            // Manejamos el error si el código del auditorio ya existe
            Swal.fire('Error', error.response?.data?.msg || 'Error en el servidor', 'error')
        }
    }

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto mt-5 border-t-8 border-violet-600">
            <h1 className="text-3xl font-black text-gray-800 mb-6 border-b-2 border-gray-100 pb-4">
                {id ? 'Editar Datos del Salón' : 'Registrar Nuevo Auditorio'}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Fila 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Código Interno *</label>
                        <input type="text" name="codigo" value={auditorio.codigo} onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-violet-500 outline-none uppercase" 
                            placeholder="Ej: SAL-A1" disabled={!!id} 
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Nombre del Salón *</label>
                        <input type="text" name="nombre" value={auditorio.nombre} onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-violet-500 outline-none" 
                            placeholder="Ej: Gran Salón Principal"
                        />
                    </div>
                </div>

                {/* Fila 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Ubicación *</label>
                        <input type="text" name="ubicacion" value={auditorio.ubicacion} onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-violet-500 outline-none" 
                            placeholder="Ej: Pabellón Norte - Piso 2"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2 text-violet-800">Capacidad (Aforo Max) *</label>
                        <input type="number" name="capacidad" value={auditorio.capacidad} onChange={handleChange}
                            className="w-full p-3 border border-violet-300 rounded-lg bg-violet-50 focus:ring-2 focus:ring-violet-500 outline-none" 
                            min="10" placeholder="Ej: 500"
                        />
                    </div>
                </div>

                {/* Fila 3 */}
                <div>
                    <label className="block text-gray-700 font-bold mb-2">Descripción y Equipamiento *</label>
                    <textarea name="descripcion" value={auditorio.descripcion} onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-violet-500 outline-none" 
                        rows="3" placeholder="Ej: Cuenta con proyector 4K, sistema de audio y tarima..."
                    ></textarea>
                </div>

                {/* Botones */}
                <div className="flex flex-col md:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
                    <button type="submit" className="bg-violet-600 w-full text-white p-3 rounded-lg font-black tracking-wide hover:bg-violet-700 transition shadow-md">
                        {id ? 'Guardar Cambios' : 'Añadir al Catálogo'}
                    </button>
                    <button type="button" onClick={() => navigate('/dashboard/auditorios')}
                        className="bg-gray-400 w-full text-white p-3 rounded-lg font-black tracking-wide hover:bg-gray-500 transition shadow-md">
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    )
}

export default FormularioAuditorio