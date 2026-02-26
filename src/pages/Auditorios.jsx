import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import clienteAxios from '../config/axios'
import Swal from 'sweetalert2'

const Auditorios = () => {
    const [auditorios, setAuditorios] = useState([])

    useEffect(() => {
        const obtenerAuditorios = async () => {
            try {
                const { data } = await clienteAxios.get('/auditorios')
                setAuditorios(data)
            } catch (error) {
                console.log(error)
            }
        }
        obtenerAuditorios()
    }, [])

    const handleEliminar = async (id) => {
        const confirmacion = await Swal.fire({
            title: '¿Dar de baja este auditorio?',
            text: 'El salón será retirado del catálogo de espacios disponibles.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EA580C',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        })
        if (confirmacion.isConfirmed) {
            try {
                await clienteAxios.delete(`/auditorio/${id}`)
                setAuditorios(auditorios.filter(a => a._id !== id))
                Swal.fire('¡Eliminado!', 'El auditorio ha sido borrado del sistema.', 'success')
            } catch (error) {
                Swal.fire('Error', error.response?.data?.msg || 'Error al eliminar', 'error')
            }
        }
    }

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
                .page-wrap { font-family: 'DM Sans', sans-serif; }

                .page-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                    padding-bottom: 1.25rem;
                    border-bottom: 2px solid #FDE68A;
                }
                .page-title {
                    font-size: clamp(1.4rem, 3vw, 1.9rem);
                    font-weight: 800;
                    color: #1C1410;
                }
                .page-title span {
                    display: block;
                    font-size: 0.75rem;
                    font-weight: 500;
                    color: #9CA3AF;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                    margin-bottom: 0.1rem;
                }
                .btn-primary {
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
                .btn-primary:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 6px 20px rgba(234,88,12,0.4);
                }

                .table-card {
                    background: #fff;
                    border-radius: 16px;
                    box-shadow: 0 4px 24px rgba(0,0,0,0.07);
                    overflow: hidden;
                    border: 1px solid #F3F4F6;
                }
                .table-responsive { overflow-x: auto; }
                table { width: 100%; border-collapse: collapse; min-width: 520px; }
                thead tr {
                    background: linear-gradient(135deg, #1C1410 0%, #2E2010 100%);
                }
                thead th {
                    padding: 1rem 1.1rem;
                    font-size: 0.72rem;
                    font-weight: 700;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                    color: rgba(255,255,255,0.7);
                    white-space: nowrap;
                }
                thead th:first-child { color: #F59E0B; }
                tbody tr {
                    border-bottom: 1px solid #F3F4F6;
                    transition: background 0.15s;
                }
                tbody tr:last-child { border-bottom: none; }
                tbody tr:hover { background: #FFFBEB; }
                tbody td { padding: 1rem 1.1rem; font-size: 0.9rem; color: #374151; }

                .code-badge {
                    font-weight: 800;
                    font-size: 0.8rem;
                    color: #EA580C;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .cap-badge {
                    display: inline-block;
                    background: #FEF3C7;
                    color: #92400E;
                    font-size: 0.72rem;
                    font-weight: 700;
                    padding: 0.25rem 0.75rem;
                    border-radius: 99px;
                    border: 1px solid #FDE68A;
                }
                .action-edit {
                    color: #EA580C;
                    font-weight: 700;
                    font-size: 0.85rem;
                    text-decoration: none;
                    padding: 0.3rem 0.65rem;
                    border-radius: 6px;
                    transition: background 0.15s;
                }
                .action-edit:hover { background: #FEF3C7; }
                .action-del {
                    color: #EF4444;
                    font-weight: 700;
                    font-size: 0.85rem;
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 0.3rem 0.65rem;
                    border-radius: 6px;
                    font-family: 'DM Sans', sans-serif;
                    transition: background 0.15s;
                }
                .action-del:hover { background: #FEE2E2; }
                .empty-row td {
                    padding: 3rem 1rem;
                    text-align: center;
                    color: #9CA3AF;
                    font-size: 0.9rem;
                }
            `}</style>

            <div className="page-wrap">
                <div className="page-header">
                    <div className="page-title">
                        <span>Módulo</span>
                        Catálogo de Auditorios
                    </div>
                    <Link to="/dashboard/auditorios/crear" className="btn-primary">
                        + Añadir Auditorio
                    </Link>
                </div>

                <div className="table-card">
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Nombre del Salón</th>
                                    <th>Ubicación</th>
                                    <th style={{textAlign:'center'}}>Aforo</th>
                                    <th style={{textAlign:'center'}}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {auditorios.map(auditorio => (
                                    <tr key={auditorio._id}>
                                        <td><span className="code-badge">{auditorio.codigo}</span></td>
                                        <td style={{fontWeight: 600, color: '#111827'}}>{auditorio.nombre}</td>
                                        <td>{auditorio.ubicacion}</td>
                                        <td style={{textAlign:'center'}}>
                                            <span className="cap-badge">{auditorio.capacidad} pax</span>
                                        </td>
                                        <td>
                                            <div style={{display:'flex', justifyContent:'center', gap:'0.25rem'}}>
                                                <Link to={`/dashboard/auditorios/editar/${auditorio._id}`} className="action-edit">Editar</Link>
                                                <button onClick={() => handleEliminar(auditorio._id)} className="action-del">Eliminar</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {auditorios.length === 0 && (
                                    <tr className="empty-row">
                                        <td colSpan="5">No hay auditorios registrados en el centro de convenciones.</td>
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

export default Auditorios
