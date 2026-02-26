import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import clienteAxios from '../config/axios'
import Swal from 'sweetalert2'

const Conferencistas = () => {
    const [conferencistas, setConferencistas] = useState([])

    useEffect(() => {
        const obtenerConferencistas = async () => {
            try {
                // Endpoint protegido que devuelve el listado de ponentes
                const { data } = await clienteAxios.get('/conferencistas')
                setConferencistas(data)
            } catch (error) {
                console.log(error)
            }
        }
        obtenerConferencistas()
    }, [])

    const handleEliminar = async (id) => {
        const confirmacion = await Swal.fire({
            title: '¿Eliminar Conferencista?',
            text: "El registro de este ponente será borrado del evento.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar'
        })

        if (confirmacion.isConfirmed) {
            try {
                // Endpoint DELETE protegido por Token
                await clienteAxios.delete(`/conferencista/${id}`)
                setConferencistas(conferencistas.filter(ponente => ponente._id !== id))
                Swal.fire('¡Eliminado!', 'El conferencista ha sido retirado del directorio.', 'success')
            } catch (error) {
                Swal.fire('Error', error.response?.data?.msg || 'Error al eliminar', 'error')
            }
        }
    }

    return (
        <>
            <div className="flex justify-between items-center mb-5 border-b-2 border-violet-100 pb-4">
                <h1 className="font-black text-3xl text-gray-800">Directorio de Conferencistas</h1>
                <Link to="/dashboard/conferencistas/crear" className="bg-violet-600 text-white font-bold px-5 py-2 rounded-lg shadow-md hover:bg-violet-700 transition">
                    + Registrar Ponente
                </Link>
            </div>

            <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-violet-900 text-white">
                        <tr>
                            <th className="p-4">Cédula</th>
                            <th className="p-4">Nombre del Ponente</th>
                            <th className="p-4">Empresa / Afiliación</th>
                            <th className="p-4">Contacto</th>
                            <th className="p-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {conferencistas.map(ponente => (
                            <tr key={ponente._id} className="border-b hover:bg-violet-50 transition">
                                <td className="p-4 font-bold text-gray-700">{ponente.cedula}</td>
                                <td className="p-4 font-medium text-gray-900">{ponente.nombre} {ponente.apellido}</td>
                                <td className="p-4">
                                    <span className="bg-violet-100 text-violet-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
                                        {ponente.empresa}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <p className="text-sm text-violet-600 font-semibold">{ponente.email}</p>
                                    <p className="text-sm text-gray-500">{ponente.telefono}</p>
                                </td>
                                <td className="p-4 flex justify-center gap-3">
                                    <Link to={`/dashboard/conferencistas/editar/${ponente._id}`} className="text-violet-600 hover:text-violet-800 font-bold">Editar</Link>
                                    <button onClick={() => handleEliminar(ponente._id)} className="text-red-500 hover:text-red-700 font-bold">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                        {conferencistas.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-6 text-center text-gray-500">No hay conferencistas registrados para el evento.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Conferencistas