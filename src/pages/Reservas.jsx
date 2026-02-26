import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import clienteAxios from '../config/axios'
import Swal from 'sweetalert2'

const Reservas = () => {
    const [reservas, setReservas] = useState([])

    useEffect(() => {
        const obtenerReservas = async () => {
            try {
                const { data } = await clienteAxios.get('/reservas')
                setReservas(data)
            } catch (error) {
                console.log(error)
            }
        }
        obtenerReservas()
    }, [])

    const handleEliminar = async (id) => {
        const confirmacion = await Swal.fire({
            title: '¿Cancelar esta reserva?',
            text: "La reserva será eliminada permanentemente del sistema.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, cancelar reserva'
        })

        if (confirmacion.isConfirmed) {
            try {
                await clienteAxios.delete(`/reserva/${id}`)
                setReservas(reservas.filter(reserva => reserva._id !== id))
                Swal.fire('¡Cancelada!', 'La reserva ha sido eliminada del sistema.', 'success')
            } catch (error) {
                Swal.fire('Error', error.response?.data?.msg || 'Error al eliminar', 'error')
            }
        }
    }

    return (
        <>
            <div className="flex justify-between items-center mb-5 border-b-2 border-violet-100 pb-4">
                <h1 className="font-black text-3xl text-gray-800">Gestión de Reservas</h1>
                <Link to="/dashboard/reservas/crear" className="bg-violet-600 text-white font-bold px-5 py-2 rounded-lg shadow-md hover:bg-violet-700 transition">
                    + Nueva Reserva
                </Link>
            </div>

            <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-violet-900 text-white">
                        <tr>
                            <th className="p-4">Código</th>
                            <th className="p-4">Descripción</th>
                            <th className="p-4">Conferencista</th>
                            <th className="p-4">Auditorio</th>
                            <th className="p-4 text-center">Aforo</th>
                            <th className="p-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservas.map(reserva => (
                            <tr key={reserva._id} className="border-b hover:bg-violet-50 transition">
                                <td className="p-4 font-bold text-violet-600 uppercase">{reserva.codigo}</td>
                                <td className="p-4 text-gray-600 max-w-xs truncate">{reserva.descripcion}</td>
                                <td className="p-4">
                                    <p className="font-medium text-gray-900">
                                        {reserva.conferencista?.nombre} {reserva.conferencista?.apellido}
                                    </p>
                                    <p className="text-xs text-gray-500">{reserva.conferencista?.empresa}</p>
                                </td>
                                <td className="p-4">
                                    <p className="font-medium text-gray-900">{reserva.auditorio?.nombre}</p>
                                    <p className="text-xs text-gray-500">{reserva.auditorio?.ubicacion}</p>
                                </td>
                                <td className="p-4 text-center">
                                    <span className="bg-violet-100 text-violet-800 text-xs font-bold px-3 py-1 rounded-full">
                                        {reserva.auditorio?.capacidad} pax
                                    </span>
                                </td>
                                <td className="p-4 flex justify-center gap-3">
                                    <Link to={`/dashboard/reservas/editar/${reserva._id}`} className="text-violet-600 hover:text-violet-800 font-bold">Editar</Link>
                                    <button onClick={() => handleEliminar(reserva._id)} className="text-red-500 hover:text-red-700 font-bold">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                        {reservas.length === 0 && (
                            <tr>
                                <td colSpan="6" className="p-6 text-center text-gray-500">No hay reservas registradas en el sistema.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Reservas
