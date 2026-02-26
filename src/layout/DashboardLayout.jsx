import { Outlet, Link, useLocation } from 'react-router-dom'
import { useContext, useState } from 'react'
import AuthContext from '../context/AuthProvider'

const DashboardLayout = () => {
    const { auth, cerrarSesion } = useContext(AuthContext)
    const location = useLocation()
    const [menuOpen, setMenuOpen] = useState(false)

    const navLinks = [
        { to: '/dashboard',              label: 'Inicio',            icon: '🏠', exact: true },
        { to: '/dashboard/auditorios',   label: 'Auditorios',        icon: '🏢' },
        { to: '/dashboard/conferencistas', label: 'Conferencistas',  icon: '🎤' },
        { to: '/dashboard/reservas',     label: 'Agenda / Reservas', icon: '📅' },
    ]

    const isActive = (link) =>
        link.exact
            ? location.pathname === link.to
            : location.pathname.startsWith(link.to)

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');

                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                html, body, #root {
                    width: 100%;
                    min-height: 100vh;
                    font-family: 'DM Sans', sans-serif;
                }

                :root {
                    --amber:  #F59E0B;
                    --orange: #EA580C;
                    --dark:   #1C1410;
                    --dark-2: #251A0F;
                    --dark-3: #2E2010;
                    --sidebar-w: 260px;
                }

                /* ── LAYOUT ── */
                .dash-root {
                    display: flex;
                    min-height: 100vh;
                    width: 100%;
                    background: #F3F4F6;
                }

                /* ── SIDEBAR ── */
                .sidebar {
                    width: var(--sidebar-w);
                    min-height: 100vh;
                    background: var(--dark);
                    display: flex;
                    flex-direction: column;
                    flex-shrink: 0;
                    position: sticky;
                    top: 0;
                    height: 100vh;
                    overflow-y: auto;
                    z-index: 40;
                    transition: transform 0.3s ease;
                }
                .sidebar-brand {
                    padding: 2rem 1.5rem 1.5rem;
                    border-bottom: 1px solid rgba(255,255,255,0.07);
                }
                .sidebar-brand h2 {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.75rem;
                    font-weight: 900;
                    color: #fff;
                    letter-spacing: -0.5px;
                }
                .sidebar-brand h2 span { color: var(--amber); }
                .sidebar-brand p {
                    font-size: 0.7rem;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    color: rgba(255,255,255,0.35);
                    margin-top: 0.2rem;
                }
                .sidebar-nav {
                    padding: 1.5rem 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.35rem;
                    flex: 1;
                }
                .nav-label {
                    font-size: 0.65rem;
                    font-weight: 700;
                    letter-spacing: 2.5px;
                    text-transform: uppercase;
                    color: rgba(255,255,255,0.25);
                    padding: 0.5rem 0.75rem 0.25rem;
                    margin-top: 0.5rem;
                }
                .nav-link {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem 1rem;
                    border-radius: 10px;
                    text-decoration: none;
                    font-weight: 600;
                    font-size: 0.9rem;
                    color: rgba(255,255,255,0.65);
                    transition: background 0.15s, color 0.15s;
                }
                .nav-link:hover {
                    background: rgba(255,255,255,0.06);
                    color: #fff;
                }
                .nav-link.active {
                    background: linear-gradient(135deg, var(--orange), var(--amber));
                    color: #1C1410;
                    font-weight: 700;
                    box-shadow: 0 4px 14px rgba(234,88,12,0.35);
                }
                .nav-link .nav-icon { font-size: 1.1rem; }

                .sidebar-footer {
                    padding: 1.25rem 1.5rem;
                    border-top: 1px solid rgba(255,255,255,0.07);
                }
                .sidebar-user {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 1rem;
                }
                .user-avatar {
                    width: 38px; height: 38px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--orange), var(--amber));
                    display: flex; align-items: center; justify-content: center;
                    font-weight: 800;
                    font-size: 0.85rem;
                    color: #1C1410;
                    flex-shrink: 0;
                }
                .user-info p { font-size: 0.85rem; font-weight: 600; color: #fff; }
                .user-info span { font-size: 0.72rem; color: rgba(255,255,255,0.35); }
                .btn-logout {
                    width: 100%;
                    padding: 0.65rem;
                    background: rgba(239,68,68,0.12);
                    border: 1px solid rgba(239,68,68,0.25);
                    border-radius: 8px;
                    color: #FCA5A5;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.82rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: background 0.15s, border-color 0.15s;
                }
                .btn-logout:hover {
                    background: rgba(239,68,68,0.22);
                    border-color: rgba(239,68,68,0.45);
                }

                /* ── MAIN ── */
                .dash-main {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    min-width: 0;
                    min-height: 100vh;
                }
                .topbar {
                    background: #fff;
                    padding: 1rem 2rem;
                    border-bottom: 3px solid var(--amber);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    position: sticky;
                    top: 0;
                    z-index: 30;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
                }
                .topbar-title {
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: #9CA3AF;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                }
                .topbar-title span {
                    color: #1C1410;
                    font-weight: 700;
                }

                /* Hamburger */
                .hamburger {
                    display: none;
                    background: none;
                    border: none;
                    cursor: pointer;
                    flex-direction: column;
                    gap: 5px;
                    padding: 4px;
                }
                .hamburger span {
                    display: block;
                    width: 24px; height: 2px;
                    background: #1C1410;
                    border-radius: 2px;
                    transition: 0.3s;
                }

                .dash-content {
                    padding: 2rem;
                    flex: 1;
                }

                /* Mobile overlay */
                .sidebar-overlay {
                    display: none;
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.55);
                    z-index: 35;
                }

                /* ── RESPONSIVE ── */
                @media (max-width: 768px) {
                    .sidebar {
                        position: fixed;
                        top: 0; left: 0;
                        height: 100%;
                        transform: translateX(-100%);
                    }
                    .sidebar.open { transform: translateX(0); }
                    .sidebar-overlay.open { display: block; }
                    .hamburger { display: flex; }
                    .topbar { padding: 1rem; }
                    .dash-content { padding: 1.25rem; }
                }
            `}</style>

            <div className="dash-root">
                {/* Overlay mobile */}
                <div
                    className={`sidebar-overlay ${menuOpen ? 'open' : ''}`}
                    onClick={() => setMenuOpen(false)}
                />

                {/* ── SIDEBAR ── */}
                <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
                    <div className="sidebar-brand">
                        <h2>COM<span>ferencee</span></h2>
                        <p>Gestión de Eventos</p>
                    </div>

                    <nav className="sidebar-nav">
                        <span className="nav-label">Menú Principal</span>
                        {navLinks.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`nav-link ${isActive(link) ? 'active' : ''}`}
                                onClick={() => setMenuOpen(false)}
                            >
                                <span className="nav-icon">{link.icon}</span>
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="sidebar-footer">
                        <div className="sidebar-user">
                            <div className="user-avatar">
                                {auth.nombre?.[0]}{auth.apellido?.[0]}
                            </div>
                            <div className="user-info">
                                <p>{auth.nombre} {auth.apellido}</p>
                                <span>Organizador</span>
                            </div>
                        </div>
                        <button className="btn-logout" onClick={cerrarSesion}>
                            Cerrar Sesión
                        </button>
                    </div>
                </aside>

                {/* ── MAIN ── */}
                <div className="dash-main">
                    <header className="topbar">
                        <p className="topbar-title">
                            Bienvenido, <span>{auth.nombre} {auth.apellido}</span>
                        </p>
                        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                            <span /><span /><span />
                        </button>
                    </header>

                    <div className="dash-content">
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    )
}

export default DashboardLayout
