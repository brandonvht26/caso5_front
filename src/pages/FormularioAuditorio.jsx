import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import clienteAxios from '../config/axios'
import Swal from 'sweetalert2'

const FormularioAuditorio = () => {
    const [auditorio, setAuditorio] = useState({
        codigo: '', nombre: '', ubicacion: '', capacidad: '', descripcion: ''
    })
    const navigate = useNavigate()
    const { id } = useParams()

    useEffect(() => {
        if (id) {
            const obtenerAuditorio = async () => {
                try {
                    const { data } = await clienteAxios.get(`/auditorio/${id}`)
                    setAuditorio(data)
                } catch (error) {
                    Swal.fire('Error', 'No se pudo cargar la información del auditorio', 'error')
                    navigate('/dashboard/auditorios')
                }
            }
            obtenerAuditorio()
        }
    }, [id])

    const handleChange = (e) => setAuditorio({ ...auditorio, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (Object.values(auditorio).includes('')) {
            Swal.fire('Atención', 'Todos los campos son obligatorios', 'warning')
            return
        }
        try {
            if (id) {
                await clienteAxios.put(`/auditorio/${id}`, auditorio)
                Swal.fire('¡Actualizado!', 'Los datos del salón se actualizaron correctamente', 'success')
            } else {
                await clienteAxios.post('/auditorios', auditorio)
                Swal.fire('¡Registrado!', 'El auditorio ha sido agregado al catálogo', 'success')
            }
            navigate('/dashboard/auditorios')
        } catch (error) {
            Swal.fire('Error', error.response?.data?.msg || 'Error en el servidor', 'error')
        }
    }

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600;700;800&display=swap');
                .form-page { font-family: 'DM Sans', sans-serif; }
                .form-card {
                    background: #fff;
                    border-radius: 20px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.08);
                    max-width: 720px;
                    margin: 0 auto;
                    overflow: hidden;
                }
                .form-card-header {
                    background: linear-gradient(135deg, #1C1410 0%, #2E2010 100%);
                    padding: 1.75rem 2rem;
                    border-bottom: 3px solid #F59E0B;
                }
                .form-card-header p {
                    font-size: 0.7rem; font-weight: 700; letter-spacing: 2.5px;
                    text-transform: uppercase; color: #F59E0B; margin-bottom: 0.3rem;
                }
                .form-card-header h1 {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(1.4rem, 3vw, 1.8rem);
                    font-weight: 700; color: #fff;
                }
                .form-body { padding: 2rem; }
                .form-grid-2 {
                    display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;
                    margin-bottom: 1.25rem;
                }
                .form-group { margin-bottom: 1.25rem; }
                .form-label {
                    display: block; font-size: 0.72rem; font-weight: 700;
                    letter-spacing: 1.5px; text-transform: uppercase;
                    color: #6B7280; margin-bottom: 0.45rem;
                }
                .form-label.accent { color: #EA580C; }
                .form-input, .form-select, .form-textarea {
                    width: 100%; padding: 0.8rem 1rem;
                    border: 1.5px solid #E5E7EB; border-radius: 10px;
                    background: #F9FAFB; color: #111827;
                    font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
                    outline: none; transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
                    box-sizing: border-box;
                }
                .form-input:focus, .form-select:focus, .form-textarea:focus {
                    border-color: #F59E0B;
                    background: #FFFBEB;
                    box-shadow: 0 0 0 3px rgba(245,158,11,0.15);
                }
                .form-input:disabled {
                    background: #F3F4F6; color: #9CA3AF; cursor: not-allowed;
                }
                .form-input.uppercase-i { text-transform: uppercase; }
                .form-textarea { resize: vertical; min-height: 90px; }
                .form-footer {
                    display: flex; gap: 1rem; flex-wrap: wrap;
                    padding: 1.5rem 2rem;
                    background: #F9FAFB;
                    border-top: 1px solid #F3F4F6;
                }
                .btn-submit {
                    flex: 1; min-width: 160px; padding: 0.875rem 1rem;
                    background: linear-gradient(135deg, #EA580C, #F59E0B);
                    color: #1C1410; font-family: 'DM Sans', sans-serif;
                    font-weight: 800; font-size: 0.9rem; letter-spacing: 0.5px;
                    border: none; border-radius: 10px; cursor: pointer;
                    box-shadow: 0 4px 14px rgba(234,88,12,0.3);
                    transition: transform 0.15s, box-shadow 0.15s;
                }
                .btn-submit:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(234,88,12,0.4); }
                .btn-cancel {
                    flex: 1; min-width: 140px; padding: 0.875rem 1rem;
                    background: #fff; color: #374151;
                    font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 0.9rem;
                    border: 1.5px solid #D1D5DB; border-radius: 10px; cursor: pointer;
                    transition: background 0.15s, border-color 0.15s;
                }
                .btn-cancel:hover { background: #F3F4F6; border-color: #9CA3AF; }
                @media (max-width: 560px) {
                    .form-grid-2 { grid-template-columns: 1fr; }
                    .form-body { padding: 1.25rem; }
                    .form-footer { padding: 1.25rem; }
                }
            `}</style>

            <div className="form-page">
                <div className="form-card">
                    <div className="form-card-header">
                        <p>{id ? 'Edición' : 'Registro'} · Auditorios</p>
                        <h1>{id ? 'Editar Datos del Salón' : 'Registrar Nuevo Auditorio'}</h1>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-body">
                            <div className="form-grid-2">
                                <div>
                                    <label className="form-label">Código Interno *</label>
                                    <input type="text" name="codigo" value={auditorio.codigo}
                                        onChange={handleChange} className="form-input uppercase-i"
                                        placeholder="Ej: SAL-A1" disabled={!!id} />
                                </div>
                                <div>
                                    <label className="form-label">Nombre del Salón *</label>
                                    <input type="text" name="nombre" value={auditorio.nombre}
                                        onChange={handleChange} className="form-input"
                                        placeholder="Ej: Gran Salón Principal" />
                                </div>
                            </div>

                            <div className="form-grid-2">
                                <div>
                                    <label className="form-label">Ubicación *</label>
                                    <input type="text" name="ubicacion" value={auditorio.ubicacion}
                                        onChange={handleChange} className="form-input"
                                        placeholder="Ej: Pabellón Norte - Piso 2" />
                                </div>
                                <div>
                                    <label className="form-label accent">Capacidad (Aforo Máx) *</label>
                                    <input type="number" name="capacidad" value={auditorio.capacidad}
                                        onChange={handleChange} className="form-input"
                                        min="10" placeholder="Ej: 500" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Descripción y Equipamiento *</label>
                                <textarea name="descripcion" value={auditorio.descripcion}
                                    onChange={handleChange} className="form-textarea"
                                    placeholder="Ej: Proyector 4K, sistema de audio, tarima...">
                                </textarea>
                            </div>
                        </div>

                        <div className="form-footer">
                            <button type="submit" className="btn-submit">
                                {id ? 'Guardar Cambios' : 'Añadir al Catálogo'}
                            </button>
                            <button type="button" className="btn-cancel"
                                onClick={() => navigate('/dashboard/auditorios')}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default FormularioAuditorio
