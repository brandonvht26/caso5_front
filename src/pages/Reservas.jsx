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
            text: 'La reserva será eliminada permanentemente del sistema.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EA580C',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Sí, cancelar reserva',
            cancelButtonText: 'Volver'
        })
        if (confirmacion.isConfirmed) {
            try {
                await clienteAxios.delete(`/reserva/${id}`)
                setReservas(reservas.filter(r => r._id !== id))
                Swal.fire('¡Cancelada!', 'La reserva ha sido eliminada del sistema.', 'success')
            } catch (error) {
                Swal.fire('Error', error.response?.data?.msg || 'Error al eliminar', 'error')
            }
        }
    }

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
                .page-wrap-r { font-family: 'DM Sans', sans-serif; }
                .page-header-r {
                    display: flex; align-items: center; justify-content: space-between;
                    flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;
                    padding-bottom: 1.25rem; border-bottom: 2px solid #FDE68A;
                }
                .page-title-r { font-size: clamp(1.4rem, 3vw, 1.9rem); font-weight: 800; color: #1C1410; }
                .page-title-r span {
                    display: block; font-size: 0.75rem; font-weight: 500;
                    color: #9CA3AF; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 0.1rem;
                }
                .btn-primary-r {
                    display: inline-flex; align-items: center; gap: 0.4rem;
                    background: linear-gradient(135deg, #EA580C, #F59E0B);
                    color: #1C1410; font-family: 'DM Sans', sans-serif;
                    font-weight: 700; font-size: 0.875rem; padding: 0.65rem 1.25rem;
                    border-radius: 10px; text-decoration: none;
                    box-shadow: 0 4px 14px rgba(234,88,12,0.3);
                    transition: transform 0.15s, box-shadow 0.15s; white-space: nowrap;
                }
                .btn-primary-r:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(234,88,12,0.4); }
                .table-card-r {
                    background: #fff; border-radius: 16px;
                    box-shadow: 0 4px 24px rgba(0,0,0,0.07);
                    overflow: hidden; border: 1px solid #F3F4F6;
                }
                .table-resp-r { overflow-x: auto; }
                .tbl-r { width: 100%; border-collapse: collapse; min-width: 620px; }
                .tbl-r thead tr { background: linear-gradient(135deg, #1C1410 0%, #2E2010 100%); }
                .tbl-r thead th {
                    padding: 1rem 1.1rem; font-size: 0.72rem; font-weight: 700;
                    letter-spacing: 1.5px; text-transform: uppercase;
                    color: rgba(255,255,255,0.7); white-space: nowrap;
                }
                .tbl-r thead th:first-child { color: #F59E0B; }
                .tbl-r tbody tr { border-bottom: 1px solid #F3F4F6; transition: background 0.15s; }
                .tbl-r tbody tr:last-child { border-bottom: none; }
                .tbl-r tbody tr:hover { background: #FFFBEB; }
                .tbl-r tbody td { padding: 0.9rem 1.1rem; font-size: 0.875rem; color: #374151; }
                .r-code { font-weight: 800; font-size: 0.8rem; color: #EA580C; text-transform: uppercase; }
                .r-desc { color: #6B7280; max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
                .r-name { font-weight: 600; color: #111827; font-size: 0.875rem; }
                .r-sub  { color: #9CA3AF; font-size: 0.75rem; margin-top: 1px; }
                .r-cap  {
                    display: inline-block; background: #FEF3C7; color: #92400E;
                    font-size: 0.72rem; font-weight: 700; padding: 0.2rem 0.65rem;
                    border-radius: 99px; border: 1px solid #FDE68A;
                }
                .action-edit-r {
                    color: #EA580C; font-weight: 700; font-size: 0.85rem;
                    text-decoration: none; padding: 0.3rem 0.65rem;
                    border-radius: 6px; transition: background 0.15s;
                }
                .action-edit-r:hover { background: #FEF3C7; }
                .action-del-r {
                    color: #EF4444; font-weight: 700; font-size: 0.85rem;
                    background: none; border: none; cursor: pointer;
                    padding: 0.3rem 0.65rem; border-radius: 6px;
                    font-family: 'DM Sans', sans-serif; transition: background 0.15s;
                }
                .action-del-r:hover { background: #FEE2E2; }
                .empty-r td { padding: 3rem 1rem; text-align: center; color: #9CA3AF; font-size: 0.9rem; }
            `}</style>

            <div className="page-wrap-r">
                <div className="page-header-r">
                    <div className="page-title-r">
                        <span>Módulo</span>
                        Gestión de Reservas
                    </div>
                    <Link to="/dashboard/reservas/crear" className="btn-primary-r">
                        + Nueva Reserva
                    </Link>
                </div>

                <div className="table-card-r">
                    <div className="table-resp-r">
                        <table className="tbl-r">
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Descripción</th>
                                    <th>Conferencista</th>
                                    <th>Auditorio</th>
                                    <th style={{textAlign:'center'}}>Aforo</th>
                                    <th style={{textAlign:'center'}}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservas.map(reserva => (
                                    <tr key={reserva._id}>
                                        <td><span className="r-code">{reserva.codigo}</span></td>
                                        <td><span className="r-desc">{reserva.descripcion}</span></td>
                                        <td>
                                            <p className="r-name">{reserva.conferencista?.nombre} {reserva.conferencista?.apellido}</p>
                                            <p className="r-sub">{reserva.conferencista?.empresa}</p>
                                        </td>
                                        <td>
                                            <p className="r-name">{reserva.auditorio?.nombre}</p>
                                            <p className="r-sub">{reserva.auditorio?.ubicacion}</p>
                                        </td>
                                        <td style={{textAlign:'center'}}>
                                            <span className="r-cap">{reserva.auditorio?.capacidad} pax</span>
                                        </td>
                                        <td>
                                            <div style={{display:'flex', justifyContent:'center', gap:'0.25rem'}}>
                                                <Link to={`/dashboard/reservas/editar/${reserva._id}`} className="action-edit-r">Editar</Link>
                                                <button onClick={() => handleEliminar(reserva._id)} className="action-del-r">Eliminar</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {reservas.length === 0 && (
                                    <tr className="empty-r">
                                        <td colSpan="6">No hay reservas registradas en el sistema.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Reservas
