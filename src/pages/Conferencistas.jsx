import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import clienteAxios from '../config/axios'
import Swal from 'sweetalert2'

const Conferencistas = () => {
    const [conferencistas, setConferencistas] = useState([])

    useEffect(() => {
        const obtenerConferencistas = async () => {
            try {
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
            text: 'El registro de este ponente será borrado del evento.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EA580C',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        })
        if (confirmacion.isConfirmed) {
            try {
                await clienteAxios.delete(`/conferencista/${id}`)
                setConferencistas(conferencistas.filter(p => p._id !== id))
                Swal.fire('¡Eliminado!', 'El conferencista ha sido retirado del directorio.', 'success')
            } catch (error) {
                Swal.fire('Error', error.response?.data?.msg || 'Error al eliminar', 'error')
            }
        }
    }

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
                .page-wrap-c { font-family: 'DM Sans', sans-serif; }

                .page-header-c {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                    padding-bottom: 1.25rem;
                    border-bottom: 2px solid #FDE68A;
                }
                .page-title-c {
                    font-size: clamp(1.4rem, 3vw, 1.9rem);
                    font-weight: 800;
                    color: #1C1410;
                }
                .page-title-c span {
                    display: block;
                    font-size: 0.75rem;
                    font-weight: 500;
                    color: #9CA3AF;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                    margin-bottom: 0.1rem;
                }
                .btn-primary-c {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.4rem;
                    background: linear-gradient(135deg, #EA580C, #F59E0B);
                    color: #1C1410;
                    font-family: 'DM Sans', sans-serif;
                    font-weight: 700;
                    font-size: 0.875rem;
                    padding: 0.65rem 1.25rem;
                    border-radius: 10px;
                    text-decoration: none;
                    box-shadow: 0 4px 14px rgba(234,88,12,0.3);
                    transition: transform 0.15s, box-shadow 0.15s;
                    white-space: nowrap;
                }
                .btn-primary-c:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 6px 20px rgba(234,88,12,0.4);
                }
                .table-card-c {
                    background: #fff;
                    border-radius: 16px;
                    box-shadow: 0 4px 24px rgba(0,0,0,0.07);
                    overflow: hidden;
                    border: 1px solid #F3F4F6;
                }
                .table-resp-c { overflow-x: auto; }
                .tbl-c { width: 100%; border-collapse: collapse; min-width: 560px; }
                .tbl-c thead tr { background: linear-gradient(135deg, #1C1410 0%, #2E2010 100%); }
                .tbl-c thead th {
                    padding: 1rem 1.1rem;
                    font-size: 0.72rem;
                    font-weight: 700;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                    color: rgba(255,255,255,0.7);
                    white-space: nowrap;
                }
                .tbl-c thead th:first-child { color: #F59E0B; }
                .tbl-c tbody tr {
                    border-bottom: 1px solid #F3F4F6;
                    transition: background 0.15s;
                }
                .tbl-c tbody tr:last-child { border-bottom: none; }
                .tbl-c tbody tr:hover { background: #FFFBEB; }
                .tbl-c tbody td { padding: 0.9rem 1.1rem; font-size: 0.875rem; color: #374151; }

                .empresa-badge {
                    display: inline-block;
                    background: #FEF3C7;
                    color: #92400E;
                    font-size: 0.7rem;
                    font-weight: 700;
                    padding: 0.2rem 0.65rem;
                    border-radius: 99px;
                    border: 1px solid #FDE68A;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .contact-email { color: #EA580C; font-weight: 600; font-size: 0.82rem; }
                .contact-tel   { color: #6B7280; font-size: 0.8rem; margin-top: 1px; }
                .action-edit-c {
                    color: #EA580C; font-weight: 700; font-size: 0.85rem;
                    text-decoration: none; padding: 0.3rem 0.65rem;
                    border-radius: 6px; transition: background 0.15s;
                }
                .action-edit-c:hover { background: #FEF3C7; }
                .action-del-c {
                    color: #EF4444; font-weight: 700; font-size: 0.85rem;
                    background: none; border: none; cursor: pointer;
                    padding: 0.3rem 0.65rem; border-radius: 6px;
                    font-family: 'DM Sans', sans-serif; transition: background 0.15s;
                }
                .action-del-c:hover { background: #FEE2E2; }
                .empty-c td {
                    padding: 3rem 1rem; text-align: center;
                    color: #9CA3AF; font-size: 0.9rem;
                }
            `}</style>

            <div className="page-wrap-c">
                <div className="page-header-c">
                    <div className="page-title-c">
                        <span>Módulo</span>
                        Directorio de Conferencistas
                    </div>
                    <Link to="/dashboard/conferencistas/crear" className="btn-primary-c">
                        + Registrar Ponente
                    </Link>
                </div>

                <div className="table-card-c">
                    <div className="table-resp-c">
                        <table className="tbl-c">
                            <thead>
                                <tr>
                                    <th>Cédula</th>
                                    <th>Nombre del Ponente</th>
                                    <th>Empresa / Afiliación</th>
                                    <th>Contacto</th>
                                    <th style={{textAlign:'center'}}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {conferencistas.map(ponente => (
                                    <tr key={ponente._id}>
                                        <td style={{fontWeight:700, color:'#374151'}}>{ponente.cedula}</td>
                                        <td style={{fontWeight:600, color:'#111827'}}>{ponente.nombre} {ponente.apellido}</td>
                                        <td><span className="empresa-badge">{ponente.empresa}</span></td>
                                        <td>
                                            <p className="contact-email">{ponente.email}</p>
                                            <p className="contact-tel">{ponente.telefono}</p>
                                        </td>
                                        <td>
                                            <div style={{display:'flex', justifyContent:'center', gap:'0.25rem'}}>
                                                <Link to={`/dashboard/conferencistas/editar/${ponente._id}`} className="action-edit-c">Editar</Link>
                                                <button onClick={() => handleEliminar(ponente._id)} className="action-del-c">Eliminar</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {conferencistas.length === 0 && (
                                    <tr className="empty-c">
                                        <td colSpan="5">No hay conferencistas registrados para el evento.</td>
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

export default Conferencistas
