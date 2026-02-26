import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import clienteAxios from '../config/axios'
import Swal from 'sweetalert2'

const FormularioConferencista = () => {
    const [conferencista, setConferencista] = useState({
        nombre: '', apellido: '', cedula: '', genero: '',
        ciudad: '', direccion: '', fecha_nacimiento: '',
        telefono: '', email: '', empresa: ''
    })
    const navigate = useNavigate()
    const { id } = useParams()

    useEffect(() => {
        if (id) {
            const obtenerConferencista = async () => {
                try {
                    const { data } = await clienteAxios.get(`/conferencista/${id}`)
                    const fechaFormat = data.fecha_nacimiento?.includes('T')
                        ? data.fecha_nacimiento.split('T')[0]
                        : data.fecha_nacimiento
                    setConferencista({ ...data, fecha_nacimiento: fechaFormat })
                } catch (error) {
                    Swal.fire('Error', 'No se pudo cargar la información del ponente', 'error')
                    navigate('/dashboard/conferencistas')
                }
            }
            obtenerConferencista()
        }
    }, [id])

    const handleChange = (e) => setConferencista({ ...conferencista, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (Object.values(conferencista).includes('')) {
            Swal.fire('Atención', 'Todos los campos son obligatorios', 'warning')
            return
        }
        try {
            if (id) {
                await clienteAxios.put(`/conferencista/${id}`, conferencista)
                Swal.fire('¡Actualizado!', 'Datos del ponente actualizados', 'success')
            } else {
                await clienteAxios.post('/conferencistas', conferencista)
                Swal.fire('¡Registrado!', 'El conferencista ha sido invitado formalmente', 'success')
            }
            navigate('/dashboard/conferencistas')
        } catch (error) {
            Swal.fire('Error', error.response?.data?.msg || 'Error en el servidor', 'error')
        }
    }

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600;700;800&display=swap');
                .fconf-page { font-family: 'DM Sans', sans-serif; }
                .fconf-card {
                    background: #fff; border-radius: 20px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.08);
                    max-width: 900px; margin: 0 auto; overflow: hidden;
                }
                .fconf-header {
                    background: linear-gradient(135deg, #1C1410 0%, #2E2010 100%);
                    padding: 1.75rem 2rem; border-bottom: 3px solid #F59E0B;
                }
                .fconf-header p {
                    font-size: 0.7rem; font-weight: 700; letter-spacing: 2.5px;
                    text-transform: uppercase; color: #F59E0B; margin-bottom: 0.3rem;
                }
                .fconf-header h1 {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(1.4rem, 3vw, 1.8rem); font-weight: 700; color: #fff;
                }
                .fconf-body { padding: 2rem; display: flex; flex-direction: column; gap: 0; }
                .fconf-section {
                    padding-bottom: 1.5rem; margin-bottom: 1.5rem;
                    border-bottom: 1px solid #F3F4F6;
                }
                .fconf-section:last-child { border-bottom: none; padding-bottom: 0; margin-bottom: 0; }
                .section-title {
                    font-size: 0.68rem; font-weight: 700; letter-spacing: 2px;
                    text-transform: uppercase; color: #EA580C; margin-bottom: 1rem;
                }
                .fconf-grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.1rem; }
                .fconf-grid-2 { display: grid; grid-template-columns: repeat(2,1fr); gap: 1.1rem; }
                .fc-label {
                    display: block; font-size: 0.72rem; font-weight: 700;
                    letter-spacing: 1.5px; text-transform: uppercase;
                    color: #6B7280; margin-bottom: 0.4rem;
                }
                .fc-label.accent { color: #EA580C; }
                .fc-input, .fc-select {
                    width: 100%; padding: 0.8rem 1rem;
                    border: 1.5px solid #E5E7EB; border-radius: 10px;
                    background: #F9FAFB; color: #111827;
                    font-family: 'DM Sans', sans-serif; font-size: 0.875rem;
                    outline: none; transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
                    box-sizing: border-box;
                }
                .fc-input:focus, .fc-select:focus {
                    border-color: #F59E0B; background: #FFFBEB;
                    box-shadow: 0 0 0 3px rgba(245,158,11,0.15);
                }
                .fc-input:disabled { background: #F3F4F6; color: #9CA3AF; cursor: not-allowed; }
                .fconf-footer {
                    display: flex; gap: 1rem; flex-wrap: wrap;
                    padding: 1.5rem 2rem; background: #F9FAFB; border-top: 1px solid #F3F4F6;
                }
                .fc-btn-submit {
                    flex: 1; min-width: 160px; padding: 0.875rem 1rem;
                    background: linear-gradient(135deg, #EA580C, #F59E0B);
                    color: #1C1410; font-family: 'DM Sans', sans-serif;
                    font-weight: 800; font-size: 0.9rem; border: none;
                    border-radius: 10px; cursor: pointer;
                    box-shadow: 0 4px 14px rgba(234,88,12,0.3);
                    transition: transform 0.15s, box-shadow 0.15s;
                }
                .fc-btn-submit:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(234,88,12,0.4); }
                .fc-btn-cancel {
                    flex: 1; min-width: 140px; padding: 0.875rem 1rem;
                    background: #fff; color: #374151; font-family: 'DM Sans', sans-serif;
                    font-weight: 700; font-size: 0.9rem; border: 1.5px solid #D1D5DB;
                    border-radius: 10px; cursor: pointer; transition: background 0.15s;
                }
                .fc-btn-cancel:hover { background: #F3F4F6; }

                @media (max-width: 700px) { .fconf-grid-3 { grid-template-columns: 1fr; } }
                @media (max-width: 560px) {
                    .fconf-grid-2 { grid-template-columns: 1fr; }
                    .fconf-body { padding: 1.25rem; }
                    .fconf-footer { padding: 1.25rem; }
                }
            `}</style>

            <div className="fconf-page">
                <div className="fconf-card">
                    <div className="fconf-header">
                        <p>{id ? 'Edición' : 'Registro'} · Conferencistas</p>
                        <h1>{id ? 'Editar Perfil del Ponente' : 'Registrar Nuevo Conferencista'}</h1>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="fconf-body">

                            {/* Identificación */}
                            <div className="fconf-section">
                                <p className="section-title">Identificación</p>
                                <div className="fconf-grid-3">
                                    <div>
                                        <label className="fc-label">Cédula / Pasaporte *</label>
                                        <input type="text" name="cedula" value={conferencista.cedula}
                                            onChange={handleChange} className="fc-input"
                                            placeholder="Ej: 1712345678" disabled={!!id} />
                                    </div>
                                    <div>
                                        <label className="fc-label">Nombres *</label>
                                        <input type="text" name="nombre" value={conferencista.nombre}
                                            onChange={handleChange} className="fc-input" />
                                    </div>
                                    <div>
                                        <label className="fc-label">Apellidos *</label>
                                        <input type="text" name="apellido" value={conferencista.apellido}
                                            onChange={handleChange} className="fc-input" />
                                    </div>
                                </div>
                            </div>

                            {/* Perfil Profesional */}
                            <div className="fconf-section">
                                <p className="section-title">Perfil Profesional</p>
                                <div className="fconf-grid-3">
                                    <div>
                                        <label className="fc-label accent">Empresa / Institución *</label>
                                        <input type="text" name="empresa" value={conferencista.empresa}
                                            onChange={handleChange} className="fc-input"
                                            placeholder="Ej: Google, Universidad..." />
                                    </div>
                                    <div>
                                        <label className="fc-label">Fecha de Nacimiento *</label>
                                        <input type="date" name="fecha_nacimiento" value={conferencista.fecha_nacimiento}
                                            onChange={handleChange} className="fc-input" />
                                    </div>
                                    <div>
                                        <label className="fc-label">Género *</label>
                                        <select name="genero" value={conferencista.genero}
                                            onChange={handleChange} className="fc-select">
                                            <option value="">-- Seleccione --</option>
                                            <option value="Masculino">Masculino</option>
                                            <option value="Femenino">Femenino</option>
                                            <option value="Otro">Otro</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Contacto */}
                            <div className="fconf-section">
                                <p className="section-title">Contacto</p>
                                <div className="fconf-grid-2">
                                    <div>
                                        <label className="fc-label">Correo Electrónico *</label>
                                        <input type="email" name="email" value={conferencista.email}
                                            onChange={handleChange} className="fc-input"
                                            placeholder="ponente@empresa.com" />
                                    </div>
                                    <div>
                                        <label className="fc-label">Teléfono Móvil *</label>
                                        <input type="text" name="telefono" value={conferencista.telefono}
                                            onChange={handleChange} className="fc-input"
                                            placeholder="Ej: +593 991234567" />
                                    </div>
                                </div>
                            </div>

                            {/* Ubicación */}
                            <div className="fconf-section">
                                <p className="section-title">Ubicación</p>
                                <div className="fconf-grid-2">
                                    <div>
                                        <label className="fc-label">Ciudad de Origen *</label>
                                        <input type="text" name="ciudad" value={conferencista.ciudad}
                                            onChange={handleChange} className="fc-input"
                                            placeholder="Ej: Bogotá" />
                                    </div>
                                    <div>
                                        <label className="fc-label">Dirección *</label>
                                        <input type="text" name="direccion" value={conferencista.direccion}
                                            onChange={handleChange} className="fc-input" />
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="fconf-footer">
                            <button type="submit" className="fc-btn-submit">
                                {id ? 'Guardar Cambios' : 'Registrar Conferencista'}
                            </button>
                            <button type="button" className="fc-btn-cancel"
                                onClick={() => navigate('/dashboard/conferencistas')}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default FormularioConferencista
