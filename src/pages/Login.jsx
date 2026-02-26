import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import clienteAxios from '../config/axios'
import AuthContext from '../context/AuthProvider'
import Swal from 'sweetalert2'

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const { setAuth } = useContext(AuthContext)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if ([email, password].includes('')) {
            Swal.fire('Atención', 'Todos los campos son obligatorios', 'warning')
            return
        }

        try {
            const { data } = await clienteAxios.post('/login', { email, password })
            localStorage.setItem('token', data.token)
            setAuth(data)
            navigate('/dashboard')
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Acceso Denegado',
                text: error.response?.data?.msg || "Usuario o contraseña incorrectos"
            })
        }
    }

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

                :root {
                    --amber:   #F59E0B;
                    --orange:  #EA580C;
                    --amber-light: #FDE68A;
                    --dark:    #1C1410;
                    --dark-2:  #2D1F0E;
                    --card-bg: rgba(255,255,255,0.04);
                }

                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                html, body, #root {
                    width: 100%;
                    min-height: 100vh;
                    margin: 0;
                    padding: 0;
                }

                .login-root {
                    font-family: 'DM Sans', sans-serif;
                    min-height: 100vh;
                    width: 100%;
                    background-color: var(--dark);
                    background-image:
                        radial-gradient(ellipse 80% 60% at 10% 0%, rgba(234,88,12,0.35) 0%, transparent 60%),
                        radial-gradient(ellipse 60% 50% at 90% 100%, rgba(245,158,11,0.25) 0%, transparent 55%),
                        url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F59E0B' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1.5rem;
                    position: relative;
                    overflow: hidden;
                }

                /* Decorative floating blobs */
                .blob {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(80px);
                    opacity: 0.18;
                    pointer-events: none;
                }
                .blob-1 {
                    width: 420px; height: 420px;
                    background: var(--orange);
                    top: -120px; left: -100px;
                    animation: float 8s ease-in-out infinite;
                }
                .blob-2 {
                    width: 300px; height: 300px;
                    background: var(--amber);
                    bottom: -80px; right: -60px;
                    animation: float 10s ease-in-out infinite reverse;
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px) scale(1); }
                    50%       { transform: translateY(-24px) scale(1.05); }
                }

                /* Layout wrapper */
                .login-wrapper {
                    display: flex;
                    width: 100%;
                    max-width: 960px;
                    min-height: 560px;
                    border-radius: 24px;
                    overflow: hidden;
                    box-shadow: 0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(245,158,11,0.15);
                    position: relative;
                    z-index: 1;
                }

                /* Left panel */
                .login-panel-left {
                    flex: 1;
                    background: linear-gradient(145deg, var(--orange) 0%, var(--amber) 100%);
                    padding: 3rem 2.5rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    position: relative;
                    overflow: hidden;
                }
                .panel-pattern {
                    position: absolute;
                    inset: 0;
                    background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3C/g%3E%3C/svg%3E");
                    pointer-events: none;
                }
                .panel-brand {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(2rem, 4vw, 3rem);
                    font-weight: 900;
                    color: #fff;
                    line-height: 1.1;
                    letter-spacing: -0.5px;
                }
                .panel-brand span {
                    display: block;
                    font-size: 0.9rem;
                    font-family: 'DM Sans', sans-serif;
                    font-weight: 500;
                    letter-spacing: 3px;
                    text-transform: uppercase;
                    opacity: 0.85;
                    margin-bottom: 0.5rem;
                }
                .panel-features {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                .panel-features li {
                    display: flex;
                    align-items: center;
                    gap: 0.65rem;
                    color: rgba(255,255,255,0.9);
                    font-size: 0.9rem;
                    font-weight: 500;
                    margin-bottom: 0.85rem;
                }
                .feature-dot {
                    width: 8px; height: 8px;
                    background: rgba(255,255,255,0.6);
                    border-radius: 50%;
                    flex-shrink: 0;
                }
                .panel-footer-text {
                    font-size: 0.75rem;
                    color: rgba(255,255,255,0.55);
                    letter-spacing: 1px;
                    text-transform: uppercase;
                }

                /* Right panel (form) */
                .login-panel-right {
                    flex: 1;
                    background: #13100C;
                    padding: clamp(2rem, 5vw, 3.5rem);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                .form-eyebrow {
                    font-size: 0.7rem;
                    font-weight: 600;
                    letter-spacing: 3px;
                    text-transform: uppercase;
                    color: var(--amber);
                    margin-bottom: 0.5rem;
                }
                .form-title {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(1.6rem, 3vw, 2.2rem);
                    font-weight: 700;
                    color: #fff;
                    margin-bottom: 0.5rem;
                    line-height: 1.2;
                }
                .form-subtitle {
                    font-size: 0.875rem;
                    color: rgba(255,255,255,0.4);
                    margin-bottom: 2.5rem;
                }
                .form-group {
                    margin-bottom: 1.25rem;
                }
                .form-label {
                    display: block;
                    font-size: 0.72rem;
                    font-weight: 600;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    color: rgba(255,255,255,0.5);
                    margin-bottom: 0.5rem;
                }
                .form-input {
                    width: 100%;
                    padding: 0.875rem 1rem;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 10px;
                    color: #fff;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.95rem;
                    outline: none;
                    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
                    box-sizing: border-box;
                }
                .form-input::placeholder { color: rgba(255,255,255,0.2); }
                .form-input:focus {
                    border-color: var(--amber);
                    background: rgba(245,158,11,0.07);
                    box-shadow: 0 0 0 3px rgba(245,158,11,0.15);
                }
                .btn-submit {
                    width: 100%;
                    padding: 1rem;
                    margin-top: 0.75rem;
                    background: linear-gradient(135deg, var(--orange) 0%, var(--amber) 100%);
                    color: #1C1410;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.95rem;
                    font-weight: 700;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: transform 0.15s, box-shadow 0.15s, filter 0.15s;
                    box-shadow: 0 4px 20px rgba(234,88,12,0.45);
                }
                .btn-submit:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 28px rgba(234,88,12,0.55);
                    filter: brightness(1.05);
                }
                .btn-submit:active {
                    transform: translateY(0);
                }
                .divider {
                    height: 1px;
                    background: rgba(255,255,255,0.07);
                    margin: 2rem 0 1.25rem;
                }
                .form-note {
                    font-size: 0.78rem;
                    color: rgba(255,255,255,0.3);
                    text-align: center;
                    line-height: 1.5;
                }
                .form-note strong {
                    color: var(--amber);
                    font-weight: 600;
                }

                /* ── Responsive: stack panels vertically on small screens ── */
                @media (max-width: 640px) {
                    .login-wrapper {
                        flex-direction: column;
                        min-height: unset;
                        border-radius: 16px;
                    }
                    .login-panel-left {
                        padding: 2rem 1.5rem;
                        min-height: 180px;
                    }
                    .panel-features { display: none; }
                    .panel-footer-text { display: none; }
                    .login-panel-right {
                        padding: 2rem 1.5rem 2.5rem;
                    }
                    .form-subtitle { margin-bottom: 1.75rem; }
                }
            `}</style>

            <div className="login-root">
                <div className="blob blob-1" />
                <div className="blob blob-2" />

                <div className="login-wrapper">

                    {/* ── LEFT PANEL ── */}
                    <div className="login-panel-left">
                        <div className="panel-pattern" />

                        <div className="panel-brand">
                            <span>Bienvenido a</span>
                            COMferencee
                        </div>

                        <ul className="panel-features">
                            <li><span className="feature-dot" />Gestión de auditorios y espacios</li>
                            <li><span className="feature-dot" />Directorio de conferencistas</li>
                            <li><span className="feature-dot" />Control de reservas en tiempo real</li>
                            <li><span className="feature-dot" />Panel centralizado del evento</li>
                        </ul>

                        <p className="panel-footer-text">Plataforma para organizadores</p>
                    </div>

                    {/* ── RIGHT PANEL ── */}
                    <div className="login-panel-right">
                        <p className="form-eyebrow">Portal de acceso</p>
                        <h1 className="form-title">Inicia sesión</h1>
                        <p className="form-subtitle">Ingresa tus credenciales para continuar</p>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Correo electrónico</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    placeholder="admin@eventos.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Contraseña</label>
                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>

                            <button type="submit" className="btn-submit">
                                Ingresar al Portal
                            </button>
                        </form>

                        <div className="divider" />
                    </div>

                </div>
            </div>
        </>
    )
}

export default Login
