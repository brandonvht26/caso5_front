import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import clienteAxios from '../config/axios'
import Swal from 'sweetalert2'

const FormularioReserva = () => {
    const [reserva, setReserva] = useState({
        codigo: '', descripcion: '', conferencista: '', auditorio: ''
    })
    const [conferencistas, setConferencistas] = useState([])
    const [auditorios, setAuditorios] = useState([])
    const navigate = useNavigate()
    const { id } = useParams()

    useEffect(() => {
        const cargarDependencias = async () => {
            try {
                const [resC, resA] = await Promise.all([
                    clienteAxios.get('/conferencistas'),
                    clienteAxios.get('/auditorios')
                ])
                setConferencistas(resC.data)
                setAuditorios(resA.data)
            } catch (error) {
                Swal.fire('Error', 'No se pudieron cargar los datos necesarios', 'error')
            }
        }
        cargarDependencias()

        if (id) {
            const obtenerReserva = async () => {
                try {
                    const { data } = await clienteAxios.get(`/reserva/${id}`)
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

    const handleChange = (e) => setReserva({ ...reserva, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (Object.values(reserva).includes('')) {
            Swal.fire('Atención', 'Todos los campos son obligatorios', 'warning')
            return
        }
        try {
            if (id) {
                await clienteAxios.put(`/reserva/${id}`, reserva)
                Swal.fire('¡Actualizada!', 'La reserva se actualizó correctamente', 'success')
            } else {
                await clienteAxios.post('/reservas', reserva)
                Swal.fire('¡Registrada!', 'La reserva ha sido creada exitosamente', 'success')
            }
            navigate('/dashboard/reservas')
        } catch (error) {
            Swal.fire('Error', error.response?.data?.msg || 'Error en el servidor', 'error')
        }
    }

    const ponenteSeleccionado = conferencistas.find(c => c._id === reserva.conferencista)
    const salonSeleccionado   = auditorios.find(a => a._id === reserva.auditorio)

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600;700;800&display=swap');
                .fres-page { font-family: 'DM Sans', sans-serif; }
                .fres-card {
                    background: #fff; border-radius: 20px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.08);
                    max-width: 760px; margin: 0 auto; overflow: hidden;
                }
                .fres-header {
                    background: linear-gradient(135deg, #1C1410 0%, #2E2010 100%);
                    padding: 1.75rem 2rem; border-bottom: 3px solid #F59E0B;
                }
                .fres-header p {
                    font-size: 0.7rem; font-weight: 700; letter-spacing: 2.5px;
                    text-transform: uppercase; color: #F59E0B; margin-bottom: 0.3rem;
                }
                .fres-header h1 {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(1.4rem, 3vw, 1.8rem); font-weight: 700; color: #fff;
                }
                .fres-body { padding: 2rem; display: flex; flex-direction: column; gap: 1.25rem; }
                .fres-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.1rem; }
                .fr-label {
                    display: block; font-size: 0.72rem; font-weight: 700;
                    letter-spacing: 1.5px; text-transform: uppercase;
                    color: #6B7280; margin-bottom: 0.4rem;
                }
                .fr-label.accent { color: #EA580C; }
                .fr-input, .fr-select {
                    width: 100%; padding: 0.8rem 1rem;
                    border: 1.5px solid #E5E7EB; border-radius: 10px;
                    background: #F9FAFB; color: #111827;
                    font-family: 'DM Sans', sans-serif; font-size: 0.875rem;
                    outline: none; transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
                    box-sizing: border-box;
                }
                .fr-input:focus, .fr-select:focus {
                    border-color: #F59E0B; background: #FFFBEB;
                    box-shadow: 0 0 0 3px rgba(245,158,11,0.15);
                }
                .fr-input:disabled { background: #F3F4F6; color: #9CA3AF; cursor: not-allowed; }
                .fr-input.uppercase-i { text-transform: uppercase; }

                /* Resumen */
                .fres-summary {
                    background: linear-gradient(135deg, #FFFBEB, #FEF3C7);
                    border: 1.5px solid #FDE68A;
                    border-radius: 12px; padding: 1.25rem;
                }
                .fres-summary-title {
                    font-size: 0.68rem; font-weight: 800; letter-spacing: 2px;
                    text-transform: uppercase; color: #92400E; margin-bottom: 0.85rem;
                }
                .fres-summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                .summary-item-label { font-size: 0.7rem; color: #9CA3AF; text-transform: uppercase; letter-spacing: 1px; }
                .summary-item-name  { font-weight: 700; color: #111827; font-size: 0.9rem; margin-top: 0.1rem; }
                .summary-item-sub   { font-size: 0.78rem; color: #6B7280; margin-top: 0.1rem; }

                .fres-footer {
                    display: flex; gap: 1rem; flex-wrap: wrap;
                    padding: 1.5rem 2rem; background: #F9FAFB; border-top: 1px solid #F3F4F6;
                }
                .fr-btn-submit {
                    flex: 1; min-width: 160px; padding: 0.875rem 1rem;
                    background: linear-gradient(135deg, #EA580C, #F59E0B);
                    color: #1C1410; font-family: 'DM Sans', sans-serif;
                    font-weight: 800; font-size: 0.9rem; border: none;
                    border-radius: 10px; cursor: pointer;
                    box-shadow: 0 4px 14px rgba(234,88,12,0.3);
                    transition: transform 0.15s, box-shadow 0.15s;
                }
                .fr-btn-submit:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(234,88,12,0.4); }
                .fr-btn-cancel {
                    flex: 1; min-width: 140px; padding: 0.875rem 1rem;
                    background: #fff; color: #374151; font-family: 'DM Sans', sans-serif;
                    font-weight: 700; font-size: 0.9rem; border: 1.5px solid #D1D5DB;
                    border-radius: 10px; cursor: pointer; transition: background 0.15s;
                }
                .fr-btn-cancel:hover { background: #F3F4F6; }

                @media (max-width: 560px) {
                    .fres-grid-2 { grid-template-columns: 1fr; }
                    .fres-summary-grid { grid-template-columns: 1fr; }
                    .fres-body { padding: 1.25rem; }
                    .fres-footer { padding: 1.25rem; }
                }
            `}</style>

            <div className="fres-page">
                <div className="fres-card">
                    <div className="fres-header">
                        <p>{id ? 'Edición' : 'Registro'} · Reservas</p>
                        <h1>{id ? 'Editar Reserva' : 'Registrar Nueva Reserva'}</h1>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="fres-body">

                            {/* Código + Descripción */}
                            <div className="fres-grid-2">
                                <div>
                                    <label className="fr-label">Código de Reserva *</label>
                                    <input type="text" name="codigo" value={reserva.codigo}
                                        onChange={handleChange} className="fr-input uppercase-i"
                                        placeholder="Ej: RES-001" disabled={!!id} />
                                </div>
                                <div>
                                    <label className="fr-label">Descripción del Evento *</label>
                                    <input type="text" name="descripcion" value={reserva.descripcion}
                                        onChange={handleChange} className="fr-input"
                                        placeholder="Ej: Conferencia sobre IA Generativa" />
                                </div>
                            </div>

                            {/* Select Conferencista */}
                            <div>
                                <label className="fr-label accent">Conferencista Asignado *</label>
                                <select name="conferencista" value={reserva.conferencista}
                                    onChange={handleChange} className="fr-select">
                                    <option value="">-- Seleccione un conferencista --</option>
                                    {conferencistas.map(p => (
                                        <option key={p._id} value={p._id}>
                                            {p.nombre} {p.apellido} — {p.empresa}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Select Auditorio */}
                            <div>
                                <label className="fr-label accent">Auditorio Asignado *</label>
                                <select name="auditorio" value={reserva.auditorio}
                                    onChange={handleChange} className="fr-select">
                                    <option value="">-- Seleccione un auditorio --</option>
                                    {auditorios.map(a => (
                                        <option key={a._id} value={a._id}>
                                            {a.nombre} — {a.ubicacion} ({a.capacidad} pax)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Resumen visual */}
                            {ponenteSeleccionado && salonSeleccionado && (
                                <div className="fres-summary">
                                    <p className="fres-summary-title">Resumen de la Reserva</p>
                                    <div className="fres-summary-grid">
                                        <div>
                                            <p className="summary-item-label">Ponente</p>
                                            <p className="summary-item-name">{ponenteSeleccionado.nombre} {ponenteSeleccionado.apellido}</p>
                                            <p className="summary-item-sub">{ponenteSeleccionado.empresa}</p>
                                        </div>
                                        <div>
                                            <p className="summary-item-label">Salón</p>
                                            <p className="summary-item-name">{salonSeleccionado.nombre}</p>
                                            <p className="summary-item-sub">{salonSeleccionado.ubicacion} · {salonSeleccionado.capacidad} pax</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>

                        <div className="fres-footer">
                            <button type="submit" className="fr-btn-submit">
                                {id ? 'Guardar Cambios' : 'Confirmar Reserva'}
                            </button>
                            <button type="button" className="fr-btn-cancel"
                                onClick={() => navigate('/dashboard/reservas')}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default FormularioReserva
